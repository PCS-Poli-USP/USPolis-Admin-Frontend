---
prev:
  text: 'Backend › Autenticação e permissões'
  link: '/dev/backend/auth'

next:
  text: 'Backend › Serviços e integrações'
  link: '/dev/backend/services'
---

# Regras de permissão

Esta página reúne **todas** as regras que decidem o que um usuário pode ver e fazer. Toda requisição de um usuário que não é admin passa por três perguntas, em três lugares do código:

| Pergunta | Quem responde | Onde |
|---|---|---|
| Ele entra no tier `restricted`? | o gate do tier | `restricted_authenticate`, em `server/deps/authenticate.py` (veja [Autenticação e permissões](/dev/backend/auth#os-gates-de-cada-tier)) |
| Ele pode fazer esta ação **neste objeto**? | os permission checkers | `server/services/security/*_permission_checker.py` |
| **Quais objetos** aparecem nas listas dele? | o escopo de acesso | `AccessScope`, em `server/services/security/access_scope.py` |

As duas últimas usam as mesmas regras, descritas abaixo. Por isso, o que uma listagem mostra é exatamente o que o `GET` por id devolve.

> [!IMPORTANT]
> Admin passa em qualquer checagem e vê tudo. As regras abaixo valem para quem não é admin, com uma exceção, que é uma regra de consistência dos dados e vale também para o admin: [uma turma só é alocada nos prédios da sua disciplina](#alocacao).

## O modelo

As permissões pertencem a **papéis** (`Role`), e os papéis são atribuídos a usuários em `/admin/roles`. Não existe permissão dada direto a um usuário.

| Tabela | Recurso | Escopo | Ações |
|---|---|---|---|
| `BuildingPermission` | `BUILDING` | um prédio, ou todos (curinga) | `CREATE`, `READ`, `UPDATE`, `DELETE`, `ALLOCATE`, `RESERVE` |
| `ClassroomPermission` | `CLASSROOM` | uma sala, ou todas (curinga) | `CREATE`, `READ`, `UPDATE`, `DELETE`, `ALLOCATE`, `RESERVE`, `REQUEST` |
| `CoursePermission` | `COURSE` | um curso, ou todos | `CREATE`, `READ`, `UPDATE`, `DELETE`. **Nenhuma rota aplica ainda** |

Detalhes que costumam pegar de surpresa:

- **Curinga** é `resource_id = -1` na API, gravado como `NULL` no banco. Os nomes exibidos são "Todas as salas" e "Todos os prédios".
- **Recursos do papel:** um papel só vale para os recursos listados em `Role.resources`. Uma `ClassroomPermission` num papel que não lista `CLASSROOM` é ignorada.
- **Grupos (modelo antigo):** ainda valem, somados aos papéis. Um grupo concede **todas as ações** nas suas salas, e o grupo principal de um prédio concede todas as ações em todas as salas do prédio. Os prédios dos grupos do usuário também contam como prédios dele (`user.buildings`). A soma dos grupos fica isolada nos métodos `_legacy_group_*` do `AccessScope` e nos ramos de grupo dos checkers, para ser apagada quando os grupos forem aposentados.

## Implicações entre ações

Algumas ações não fazem sentido sozinhas. Reservar uma sala que você não consegue ver, por exemplo. Por isso, conceder uma ação concede também as ações de que ela depende:

| Ação concedida | Implica, no mesmo recurso |
|---|---|
| `CREATE`, `UPDATE`, `ALLOCATE`, `RESERVE`, `REQUEST` | `READ` |
| `DELETE` | `UPDATE` e `READ` |
| `READ` | nada |

Não há outras implicações. `UPDATE` não implica `ALLOCATE` nem `DELETE`, por exemplo, porque são capacidades diferentes.

As implicações são aplicadas uma vez, ao montar o `PermissionIndex` (`IMPLIED_ACTIONS` e `build_permission_index`, em `server/services/security/role_permission_evaluator.py`). Todas as checagens e o escopo leem esse índice. Isso tem três consequências:

- os papéis que já estão no banco, inclusive os migrados dos grupos, seguem as implicações sem migração de dados;
- o banco guarda só as ações que foram marcadas. Na tela de papéis, marcar uma ação marca as implicadas, que ficam travadas enquanto ela estiver marcada, e os cards dos papéis antigos mostram as implicadas contornadas;
- um [curinga ignorado](#curingas) não gera implicação nenhuma.

## Cascata prédio → sala

Uma permissão num **prédio** vale, com a mesma ação, para **todas as salas** do prédio (`has_classroom_permission`).

O contrário não vale: uma permissão numa sala não dá nenhuma ação sobre o prédio nem sobre as outras salas dele. Ela só faz o usuário [pertencer ao prédio](#pertencer-a-um-predio) para fins de visibilidade.

## Curingas

Um curinga só vale, para quem não é admin, nas ações `CREATE` e `READ`. Curingas de `UPDATE`, `DELETE`, `ALLOCATE`, `RESERVE` e `REQUEST` ficam gravados, mas são ignorados (`GLOBAL_WILDCARD_ADMIN_ONLY_ACTIONS`). Ninguém além do admin edita, aloca ou reserva "tudo".

Um curinga ignorado também não implica `READ` em tudo. Um papel com "reservar todas as salas" não ganha "ler todas as salas".

## Pertencer a um prédio

Um usuário **pertence a um prédio** quando pode ler o prédio, ou pode ler pelo menos uma sala dele (por papel, grupo ou cascata). É o que o modelo antigo dava a quem estava em qualquer grupo do prédio, inclusive nos que não são o principal.

Pertencer ao prédio dá visibilidade, não ação: o prédio aparece nos filtros e listagens, e o usuário vê as turmas das disciplinas do prédio (veja a [visibilidade das turmas](#visibilidade-de-turmas-e-disciplinas)). Para **agir**, valem as permissões da sala ou do prédio.

## O escopo de acesso e as listagens

O `AccessScope` resolve, por ação, os prédios e salas em que o usuário pode agir. É montado uma vez por requisição pelo `AccessScopeDep` (`server/deps/access_scope_dep.py`) e os resultados são guardados por ação.

| Método | O que devolve |
|---|---|
| `building_grant(ação)` | prédios com a ação (papéis + prédios dos grupos) |
| `classroom_grant(ação)` | salas com a ação: diretas, as dos prédios com a ação (cascata) e as dos grupos |
| `visible_building_grant(ação)` | prédios com a ação no prédio **ou** em alguma sala dele |
| `readable_building_ids()` | `visible_building_grant(READ)` em ids: os prédios a que o usuário [pertence](#pertencer-a-um-predio) |

Os `*_grant` devolvem um `Grant(all, ids)`. O `all` é `True` para admin e para curinga válido. Os métodos `*_ids` devolvem listas de ids prontas para o `IN` do SQL. Quando `all` é verdadeiro, eles buscam todos os ids.

As listagens seguem `READ`. A exceção é a caixa de solicitações, que segue `RESERVE`, porque aprovar ou recusar exige `RESERVE`.

| Listagem | Critério |
|---|---|
| `GET /users/my-buildings` | prédios a que o usuário pertence |
| `GET /users/my-classrooms` | salas com `READ` |
| `GET /users/my-subjects` | disciplinas ligadas aos prédios a que o usuário pertence |
| `GET /users/my-classes` | turmas dessas disciplinas, alocadas ou não |
| `GET /users/my-reservations` | reservas em salas com `READ` |
| `GET /occurrences` | ocorrências nos prédios a que o usuário pertence |
| `GET /solicitations`, `GET /solicitations/pending` | solicitações dos prédios em que o usuário tem `RESERVE` (no prédio ou em alguma sala) |
| `GET /conflicts/building/{id}` | só as salas do prédio com `READ`. Basta pertencer ao prédio |

### `GET /users/my-access`

Devolve o escopo já resolvido, para o frontend nunca reimplementar estas regras:

```json
{
  "is_admin": false,
  "scopes": {
    "read":     { "buildings": {"all": false, "ids": [3]},
                  "classrooms": {"all": false, "ids": [10, 11]},
                  "visible_buildings": {"all": false, "ids": [3]} },
    "allocate": { "...": "..." }
  }
}
```

Traz uma chave por ação: `create`, `read`, `update`, `delete`, `allocate`, `reserve` e `request`. Os valores já incluem implicações, cascata e grupos.

O frontend carrega essa resposta no login, no `access` do `appContext`, e decide tudo por ela (veja [Frontend › Estado global](/dev/frontend/data#o-que-o-usuario-pode-fazer-access)).

## Visibilidade de turmas e disciplinas

Uma turma não tem prédio próprio. O vínculo vem da **disciplina**, e uma disciplina pode ser adicionada a vários prédios.

**A convenção:** quem pertence a um dos prédios da disciplina vê, só para leitura, **todas** as turmas dela, alocadas ou não e onde quer que estejam os horários.

Exemplo: Cálculo 1 é dada em vários prédios da Poli. Cada prédio adiciona a disciplina para ver todas as turmas dela. Um funcionário da Elétrica vê inclusive as turmas já alocadas em outros prédios. Isso importa porque uma turma pode ter um horário num prédio e outro horário em outro, e os dois lados precisam saber.

A regra completa do `ClassPermissionChecker`:

| Ação na turma | Permitida se |
|---|---|
| `READ` | o usuário pertence a um dos prédios da disciplina, **ou** pode ler a sala de algum horário da turma |
| demais ações (`UPDATE`, ...) | algum horário está alocado numa sala em que o usuário pode fazer a ação, **ou** algum horário está sem sala e ele pode fazer a ação num prédio da disciplina |

Disciplinas seguem a mesma lógica no `SubjectPermissionChecker`. `READ` exige pertencer a um dos prédios da disciplina, e as outras ações exigem a ação num desses prédios.

Na prática, um funcionário com `UPDATE` no prédio A:
- edita as turmas sem sala de disciplinas de A e as turmas alocadas em salas de A;
- só **vê** a turma de Cálculo 1 alocada no prédio B.

**Excluir uma turma** exige `UPDATE` na turma **e** em todos os horários dela (`ClassRepositoryAdapter.delete`). Quem tem permissão só numa sala não apaga uma turma que também tem horários em salas de outros.

## Alocação

Alocar é atribuir uma sala a um horário de turma (`Schedule`), ou a uma ocorrência avulsa. A regra está num lugar só, `OccurrenceRepositoryAdapter.check_can_allocate`, e vale para todos os caminhos: `allocate-schedule`, `allocate-schedule-many`, `remove-schedule-allocation`, `PATCH /allocations/events` e `allocate-allocation-map`.

1. **`ALLOCATE` nas salas envolvidas.** É exigido na sala de destino e, se o horário já estava alocado, também na sala de origem: realocar é desalocar de lá. Desalocar exige `ALLOCATE` na sala atual.
2. **Nenhuma permissão na turma nem no prédio.** Quem tem `ALLOCATE` numa sala aloca nela uma turma sem sala, mesmo sem permissão no prédio. É o caso dos grupos comuns migrados para papéis, que têm permissões só nas próprias salas.
3. **A turma só vai para os prédios da sua disciplina.** Alocar uma turma numa sala de um prédio a que a disciplina não está ligada é recusado com **400**, também para o admin. Sem essa regra, a turma ficaria invisível para o pessoal daquele prédio, porque eles só veem turmas de disciplinas do prédio deles. Para alocar, adicione antes a disciplina ao prédio. A regra não se aplica a reservas, que não têm disciplina.

A permissão é checada antes da consistência. Quem não tem `ALLOCATE` recebe 403, e não 400.

## Reservas e solicitações

- Todo o ciclo de uma reserva (reunião, evento, prova), incluindo editar e apagar, exige `RESERVE` na sala. Se a reserva ainda não tem sala, exige `RESERVE` no prédio. Ao buscar uma reserva para alterá-la, o adapter já checa `RESERVE` (`ReservationRespositoryAdapter.get_by_id(id, action)`).
- Aprovar ou recusar uma solicitação exige `RESERVE` na sala.
- Criar ou editar uma solicitação para uma sala **restrita** (`restricted=True`) exige `REQUEST` nessa sala. Salas comuns não exigem nada.
- **Quem recebe o e-mail** de uma solicitação nova ou cancelada é quem pode aprová-la (`server/services/security/solicitation_recipients.py`), desde que tenha os e-mails ligados:
  - se a solicitação tem sala, quem tem `RESERVE` nessa sala, direto ou pelo prédio;
  - se não tem, quem tem `RESERVE` no prédio ou em alguma sala dele, a mesma regra da caixa de solicitações;
  - mais os membros dos grupos antigos correspondentes.

  O admin não recebe por ser admin, só por papel ou grupo. Um curinga de `RESERVE` não conta, porque é [ignorado](#curingas).

## Salas

- **Criar** uma sala exige `CREATE` no prédio. Os grupos são opcionais (`group_ids` pode vir vazio), e a sala fica coberta pelos papéis do prédio.
- **Editar** exige `UPDATE` na sala, e **apagar** exige `DELETE`.

## Rotas do dono e entidades globais

Algumas rotas não seguem permissão de prédio nem de sala, e sim **quem é o dono** do objeto:

| Objeto | Criar | Editar e apagar |
|---|---|---|
| Grade horária do usuário (`/users/schedules`) | o próprio usuário | só o dono. **Nem o admin**, porque é um dado pessoal |
| Solicitação | qualquer usuário logado (`REQUEST` se a sala for restrita) | editar: só quem pediu, nem o admin. Cancelar: quem pediu ou um admin |
| Categoria de feriado, feriado, calendário, evento institucional | qualquer usuário do tier `restricted` (com grupo ou papel) | quem criou ou um admin |

O evento institucional guarda quem o criou em `created_by_id`, desde a migração `5c2e8a7f9d14`. Os eventos criados antes não têm criador, e só um admin os altera. Curtir um evento pelo app não conta como edição: só o contador muda (`InstitutionalEventRepository.save_likes`).

## App mobile

As rotas `/mobile/*` são do app (repositório `USPolis-Mobile`) e não usam o login do site. Quem escreve pelo app se identifica com o **ID token do Google**, enviado cru no header `Authorization`, sem `Bearer`. Só o login do app (`/mobile/authentication`) usa o header `idToken`.

- **O usuário vem do token, nunca do corpo** (`MobileUserDep`, em `server/deps/google_auth_dep.py`). Postar, responder, curtir post, curtir evento, denunciar e mandar "Fale conosco" exigem o token. O `user_id` que o app ainda manda no corpo precisa ser o do token, senão a resposta é 403 (`check_acting_as`). Uma conta Google que ainda não tem usuário no app também recebe 403.
- **Apagar um post** é só para o autor.
- **Listar o "Fale conosco"** (`GET /mobile/comments`) é só para admin, porque a resposta traz o e-mail de quem escreveu.
- Ler posts, respostas, turmas e eventos continua público.

## Tabela de operações e ações

| Quero... | Recurso checado | Ação |
|---|---|---|
| Ler, editar, apagar um prédio | `BUILDING` | `READ`, `UPDATE`, `DELETE` |
| Criar uma sala | `BUILDING` | `CREATE` |
| Ler, editar, apagar uma sala | `CLASSROOM` | `READ`, `UPDATE`, `DELETE` |
| Alocar, realocar, desalocar | `CLASSROOM` | `ALLOCATE` nas salas de origem e destino ([regras](#alocacao)) |
| Reservar (reunião, evento, prova), editar, apagar | `CLASSROOM` (ou `BUILDING` sem sala) | `RESERVE` |
| Editar as ocorrências de uma reserva | `CLASSROOM` | `RESERVE` |
| Aprovar ou recusar uma solicitação | `CLASSROOM` | `RESERVE` |
| Solicitar uma sala restrita | `CLASSROOM` | `REQUEST` |
| Criar uma disciplina (ou o crawl do JupiterWeb) | `BUILDING` | `CREATE` |
| Ler uma disciplina | `BUILDING` | pertencer a um prédio dela |
| Editar ou apagar uma disciplina | `BUILDING` | `UPDATE` |
| Recrawlear disciplinas (`PATCH /subjects/crawl`) | `BUILDING` | `UPDATE` em **todas** as disciplinas pedidas. Uma de outro prédio recusa a requisição inteira |
| Criar uma turma | `BUILDING` (da disciplina) | `CREATE` |
| Ler uma turma | — | [visibilidade](#visibilidade-de-turmas-e-disciplinas) |
| Editar uma turma | `CLASSROOM` (ou `BUILDING` para horário sem sala) | `UPDATE` |
| Apagar uma turma | idem, em todos os horários | `UPDATE` |
| Criar horários numa turma, editar as ocorrências de um horário | `CLASSROOM` (como editar a turma) | `UPDATE`. Se o horário novo já vem com sala, também `ALLOCATE` nela |
| Ver as opções de reaproveitamento de alocação | — | `READ` em todas as turmas pedidas |
| Ver os logs de alocação de um horário | `BUILDING` | pertencer a um prédio da disciplina (ou ao prédio da reserva). Fora deles, 404 |
| Contar os conflitos por sala (`/classrooms/with-conflict-count`, `GET` e `POST`) | `BUILDING` | pertencer ao prédio. Lista só as salas com `READ` |
| Ver o relatório de ocupação de um prédio | `BUILDING` | `READ` |
| Ver os usuários de um prédio (`GET /users/{building_id}`) | `BUILDING` | pertencer ao prédio. Devolve só id, nome e e-mail |

Apagar turma ou disciplina usa `UPDATE`, e não `DELETE`, porque gerenciar a oferta não deve dar o poder de apagar o prédio ou a sala. Como `DELETE` implica `UPDATE`, quem pode apagar o prédio também apaga as disciplinas dele.

Esta tabela é a versão legível do registro de rotas dos testes (`tests/api/roles/route_registry.py`, veja [como cada rota é classificada](#como-cada-rota-e-classificada)). Se os dois divergirem, vale o registro, porque é ele que os testes conferem.

## Onde está no código

| Regra | Arquivo |
|---|---|
| Implicações, curingas, cascata | `server/services/security/role_permission_evaluator.py` |
| Escopo e "pertencer ao prédio" | `server/services/security/access_scope.py`, `server/deps/access_scope_dep.py` |
| `GET /users/my-access` | `server/routes/authenticated/user_routes.py`, `server/models/http/responses/access_response_models.py` |
| Visibilidade de turmas | `server/services/security/class_permission_checker.py` |
| Visibilidade de disciplinas | `server/services/security/subjects_permission_checker.py` |
| Alocação | `server/deps/repository_adapters/occurrence_repository_adapter.py` (`check_can_allocate`) |
| Gate do tier `restricted` e `BuildingDep` | `server/deps/authenticate.py` |
| Usuário do app pelo token (`MobileUserDep`, `check_acting_as`) | `server/deps/google_auth_dep.py` |
| Criador ou admin nos eventos institucionais | `server/repositories/institutional_event_repository.py` |
| Classe de cada rota | `tests/api/roles/route_registry.py` |

## Como cada rota é classificada

Toda rota da API tem uma **classe** no registro `ROUTE_REGISTRY` (`tests/api/roles/route_registry.py`). A classe diz quem pode chamar a rota. As rotas de `/admin` não são listadas uma a uma: todas são `ADMIN`, pelo prefixo.

| Classe | Quem chama | Como o app autentica |
|---|---|---|
| `PUBLIC` | qualquer um, sem login | `public_authenticate` (segue anônimo) |
| `HEALTH` | monitoramento, com `HEALTH_API_KEY` | `health_token_authenticate` |
| `MOBILE` | o app, com o token do Google | `google_authorization_authenticate` ou `google_id_token_authenticate` |
| `SELF` | qualquer usuário logado, nos próprios dados | `authenticate` |
| `GLOBAL_READ` | qualquer usuário logado (feriados, calendários...) | `authenticate` |
| `RESTRICTED_ANY` | quem tem grupo ou papel, sem mais checagem (criar entidade global) | `restricted_authenticate` |
| `OWNER` | o [dono](#rotas-do-dono-e-entidades-globais) do objeto | `authenticate` ou `restricted_authenticate`, mais a checagem do dono |
| `OBJECT` | quem tem a ação no recurso do objeto | idem, mais o permission checker. A linha diz o recurso e a ação |
| `ADMIN` | só admin | `admin_authenticate` |

O nível de autenticação de cada rota é lido da árvore de dependências dela, então os testes comparam a classe registrada com o que o app de fato faz.

**Ao criar uma rota:**

1. Adicione uma linha ao `ROUTE_REGISTRY`. Sem ela, `test_every_route_is_classified` falha e diz qual linha falta.
2. Se a classe for `OBJECT`, adicione uma linha ao `OPERATIONS` de `test_permission_matrix.py` (ou ao `LISTINGS` de `test_listings.py`, se a rota lista). Se for `OWNER`, uma linha ao `OWNER_OPERATIONS` de `test_owner_routes.py`. Os testes de cobertura de cada tabela cobram essa linha.
3. Atualize a [tabela de operações](#tabela-de-operacoes-e-acoes) desta página.

Uma brecha conhecida pode ser registrada com `gap(regra, "código")` e uma descrição em `KNOWN_GAPS`. Se a brecha muda a autenticação da rota (ela devia exigir token e não exige, por exemplo), os testes da porta da rota viram falha esperada (`xfail(strict=True)`) até a correção. Hoje não há nenhuma brecha registrada.

## Como essas regras são testadas

`tests/api/roles/` testa pela API com um usuário que **só tem papéis**: nenhum grupo e nenhum `user.buildings`. É o que garante que papéis sozinhos bastam. Os testes são guiados por tabela: um caso novo é uma linha, e não uma função.

**Peças compartilhadas** (`tests/api/roles/conftest.py` e `world.py`):

- `role_user` e `role_client`;
- dois prédios (`building_a`, `building_b`), com salas, disciplinas e turmas;
- `grant`, para dar permissões ao `role_user`:
  - `grant.building(building_a, [BuildingAction.READ])`;
  - `grant.classroom(None, [...])`, para um curinga;
  - `grant.legacy_group(building_a)`, para pô-lo no grupo principal (o modelo antigo);
- `world`, com esses objetos e helpers que criam, como admin e pelas factories e repositories, o que uma operação usa: turma alocada, reunião, prova, evento, solicitação, sala restrita.

**A guarda de rotas** (`test_route_guard.py`) testa a porta de cada rota, gerada a partir do registro e de `app.routes`:

| Teste | Esperado |
|---|---|
| Toda rota do app está no registro, e o registro não tem rota que não existe | — |
| A autenticação da rota bate com a classe | — |
| Sem credencial (rotas que exigem login) | 401 |
| Sem o token do app (`MOBILE`), ou com a chave errada (`HEALTH`) | 401 |
| Tier `restricted`, usuário sem grupo nem papel | 403 |
| `SELF` e `GLOBAL_READ`, usuário sem grupo nem papel | passa da porta |
| `RESTRICTED_ANY`, usuário com qualquer papel | passa da porta |
| `ADMIN`, usuário com o máximo que um papel pode ter | 403 |

**A matriz de permissões** (`test_permission_matrix.py`) roda cada rota `OBJECT` sobre um objeto do prédio A. O recurso e a ação vêm do registro. Cada operação roda em até sete variantes:

| Variante | O que o usuário tem | Esperado |
|---|---|---|
| `exact` | a ação no alvo | sucesso |
| `none` | nada | negado |
| `other` | a ação no outro prédio, ou numa sala dele | negado |
| `read_only` | só `READ` no alvo (só operações de escrita) | negado |
| `cascade` | a ação no prédio A (só operações de sala, e não para `REQUEST`, que prédio não tem) | sucesso |
| `wildcard` | a ação em tudo (`-1`) | sucesso para `READ` e `CREATE`, negado para as [ações só de admin](#curingas) |
| `legacy` | membro do grupo principal do prédio A, sem papel | sucesso |

Negado é 403, ou 404 quando o objeto é buscado só entre o que o usuário pode ver. A tabela de operações acima, junto com esta, define todos os casos.

**As listagens** (`test_listings.py`) criam um objeto no prédio A e outro no B e conferem quais o usuário recebe:

| Variante | O que o usuário tem | Lista |
|---|---|---|
| `exact` | a ação no prédio A (`classroom_a` nas listagens por sala) | A |
| `none` | nada | nada |
| `classroom` | a ação só em `classroom_a` (listagens por prédio, que seguem o "pertencer") | A |
| `cascade` | a ação no prédio A (listagens por sala) | A |
| `wildcard` | a ação em tudo | A e B para `READ`, nada para `RESERVE` |
| `legacy` | membro do grupo principal do prédio A | A |

**As rotas do dono** (`test_owner_routes.py`) rodam cada rota `OWNER` três vezes: como o dono (sucesso), como outro usuário (403) e como admin (sucesso, menos onde a [tabela do dono](#rotas-do-dono-e-entidades-globais) diz que nem o admin pode).

**As implicações** (`test_implications.py`) têm uma linha por par de `IMPLIED_ACTIONS`: o papel tem só a ação concedida e faz uma requisição que exige a implicada. Outra tabela fixa o que não é implicado, como `UPDATE` sem `DELETE` e `RESERVE` sem `ALLOCATE`.

Além das tabelas, os arquivos `test_role_*.py` fixam regras específicas, como a convenção do Cálculo 1, a alocação entre prédios e as reservas. As implicações e os curingas também têm testes unitários em `tests/unit/services/security/test_role_permission_evaluator.py`.

Ao mudar uma regra desta página, mude o teste correspondente e esta página juntos.

## Pendências conhecidas

- **`CoursePermission`:** existe, mas nenhuma rota a aplica.
- **App mobile:** a versão publicada denuncia, curte posts e curte eventos sem mandar o token. Essas três funções recebem 401 até o app mandar o token no `Authorization`, como já faz ao postar.
- **Aposentar os grupos:** apagar as tabelas e os ramos `_legacy_group_*` e de grupo dos checkers.
