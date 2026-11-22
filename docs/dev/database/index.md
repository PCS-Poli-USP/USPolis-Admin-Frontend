---
prev:
  text: 'Frontend › Como adicionar uma funcionalidade'
  link: '/dev/frontend/new-feature'

next:
  text: 'Tabelas, Modelos e Relacionamentos'
  link: '/dev/database/models'
---

# Banco de Dados

Usamos **PostgreSQL** como banco relacional, acessado a partir do backend via **SQLModel** (que por baixo dos panos usa **SQLAlchemy**) — veja [Tecnologias Utilizadas](/dev/stack#backend). Não há versão em nuvem/serverless: em produção é um PostgreSQL rodando no próprio servidor. Em desenvolvimento, você pode usar o container PostgreSQL 16 do Docker Compose do USPolis-Admin ou um Postgres instalado na sua máquina (veja [Configurando seu Ambiente](/dev/enviroment/)). Use o PostgreSQL 13 ou superior.

Esta seção cobre:

- [Tabelas, Modelos e Relacionamentos](/dev/database/models/) — as 54 tabelas do sistema, agrupadas por domínio
- [Migrações](/dev/database/migrations/) — como o schema evolui ao longo do tempo, via Alembic
- [Backup](/dev/database/backup/) — como os dados são protegidos contra perda

## Onde os models vivem

Cada tabela é um arquivo em `server/models/database/` no repositório do backend, com uma classe SQLModel (`table=True`). A convenção de nome de arquivo é `<entidade>_db_model.py` para tabelas "normais" e `<entidade_a>_<entidade_b>_link.py` para tabelas de ligação N:N (ex: `group_user_link.py`). A maioria dos models herda de `BaseModel` (`server/models/database/base_db_model.py`), que só define um `id: int` autoincremento como chave primária. Herdam direto de `SQLModel`, com chave primária própria: as nove tabelas de ligação (PK composta pelas duas FKs), `CourseOptions` (PK `codcur` + `codhab`), `UserScheduleEntry` (PK composta) e `UserSession` (PK `id` string). As tabelas de permissão herdam de `BasePermission` (`base_permission_db_model.py`), que acrescenta `role_id`, `granted_at` e `granted_by_id`.

> [!IMPORTANT]
> Sempre que um model novo for criado, ele precisa acabar sendo importado (direta ou indiretamente) por `server/db.py` — é essa cadeia de imports que registra a tabela em `SQLModel.metadata`, e é a partir desse metadata que o Alembic detecta o que mudou na hora de gerar uma migração com `--autogenerate` (veja [Migrações](/dev/database/migrations/)). Hoje isso funciona porque vários models são importados indiretamente por outros (ex: `user_db_model.py` importa `group_db_model`), então nem todo arquivo em `server/models/database/` precisa estar listado explicitamente em `server/db.py` — mas o mais seguro ao criar um recurso novo é sempre adicionar o import lá também.

## Separação entre model de banco e schema HTTP

Como já mencionado em [Backend](/dev/backend/request-flow#_7-sessao-e-model), os models do SQLModel (`server/models/database/`) são **exclusivamente** a representação da tabela — eles não são reaproveitados como schema de request/response da API. Isso é intencional: permite, por exemplo, que o model de banco tenha uma coluna sensível ou interna que nunca é serializada de volta para o cliente, sem precisar de `exclude=` espalhado pelo código.

## A tabela `reservation` como "hub" central

Boa parte do domínio de agendamento gira em torno da tabela `reservation`, que funciona como uma tabela "pai" genérica: toda reserva de sala — seja uma prova, um evento institucional ou uma reunião — cria uma linha em `reservation` e, associada a ela (por uma foreign key **única**, ou seja, é uma relação 1:1), uma linha na tabela da especialização correspondente:

| Especialização | Tabela | Campo extra além do vínculo com `reservation` |
|---|---|---|
| Prova | `exam` | `subject_id`, e quais turmas ela vale (`examclasslink`) |
| Evento institucional | `event` | `type`, `link` |
| Reunião | `meeting` | `link` |
| Solicitação pendente de aprovação | `solicitation` | prédio, sala pedida, quem pediu, justificativa de negação |

Isso é o equivalente, em SQL puro, ao padrão de herança "table-per-type": em vez de uma única tabela `reservation` com colunas opcionais para cada tipo (ou uma coluna `type` com um monte de `NULL`), cada especialização vive na sua própria tabela, e o campo comum (data, hora, prédio, sala, quem criou, recorrência) fica centralizado em `reservation` e em `schedule` (que guarda os horários e é o que efetivamente conecta uma reserva à sala e à agenda). Veja mais detalhes em [Tabelas, Modelos e Relacionamentos](/dev/database/models/#reservas-e-suas-especializacoes).

## Sistema de permissões

Existem hoje **duas camadas** de controle de acesso persistidas no banco, e as duas são consultadas em toda checagem (veja [Backend › Autenticação e permissões](/dev/backend/auth#permissoes-por-objeto)):

1. **Grupos** (modelo antigo): o vínculo usuário↔grupo (`groupuserlink`), grupo↔sala (`groupclassroomlink`) e usuário↔prédio (`userbuildinglink`, sincronizado a partir dos grupos). Os permission checkers olham primeiro para os grupos, e o gate do tier `restricted` olha **só** para eles.
2. **Papéis** (modelo novo): `role`, `userrole` e as permissões por recurso (`buildingpermission`, `classroompermission`, `coursepermission`), cada uma com uma lista de ações (ex: `Prédios · Criar`, `Prédios · Reservar`). Se os grupos não dão acesso, os checkers consultam os papéis. É o sistema mostrado na página [Minha Conta](/profile/) (seção "Papéis e permissões") e documentado no `docs/PERMISSIONS.md` do backend.

Os dois coexistem: uma migração (`6950bd048a6d`) criou um papel equivalente para cada grupo existente, e aposentar os grupos é um passo futuro. A `coursepermission` existe no banco, mas nenhuma rota a aplica ainda.

## Busca: a view `search_document`

A [busca geral](/dev/search/) não consulta as tabelas direto: ela lê uma **view materializada**, `search_document`, com uma linha por item pesquisável (disciplina, turma, sala, prédio, professor, prova, evento e monitoria), o texto já normalizado e um `tsvector` com pesos. Ela depende de objetos que não são tabelas:

- as extensões `unaccent` e `pg_trgm` (busca sem acento e por semelhança, para erros de digitação);
- a configuração de busca textual `pt_unaccent` (português, sem acentos);
- um índice único em `doc_key`, exigido pelo `REFRESH MATERIALIZED VIEW CONCURRENTLY`.

Tudo isso é criado à mão pela migração `5c8e1f2a9b47` (o autogenerate não enxerga views nem extensões). A view é atualizada pelo lifespan do backend a cada `SEARCH_INDEX_REFRESH_SECONDS` (veja [Backend › Visão geral](/dev/backend/#lifespan-server-services-cron-scheduler-py)).

> [!WARNING]
> A view só existe se as migrações forem aplicadas. Um banco montado por `SQLModel.metadata.create_all()` (o que o `server/scripts/pre_start.py` faz num banco vazio, antes de marcar as migrações como aplicadas com `alembic stamp head`) fica **sem a view**, e o `/search` falha. Veja [Migrações](/dev/database/migrations/#bancos-novos-e-o-pre-start-py).
