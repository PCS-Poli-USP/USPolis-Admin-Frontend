---
prev:
  text: 'Backend › Fluxo de uma requisição'
  link: '/dev/backend/request-flow'

next:
  text: 'Backend › Serviços e integrações'
  link: '/dev/backend/services'
---

# Autenticação e permissões

O controle de acesso do backend tem três níveis:

1. **Quem é o usuário**: token do Google ou cookie de sessão (`server/deps/authenticate.py`).
2. **Em que tier ele pode entrar**: as dependências de cada router (veja [Rotas e tiers](/dev/backend/routes)).
3. **O que ele pode fazer com cada objeto**: os permission checkers, com grupos e papéis.

As API keys de parceiros são um caminho separado, sem usuário, descrito no fim da página.

## Login

O login é feito com Google OAuth. Só e-mails de domínios em `ALLOWED_GMAILS_DOMAINS` (ou listados um a um em `ALLOWED_GMAILS`) entram: os outros recebem 403, "É necessário usar um email institucional para acessar o sistema".

1. O frontend obtém um código de autorização do Google e chama `GET /auth/get-tokens?auth_code=...` (`server/routes/public/auth_routes.py`).
2. O backend troca o código por tokens no Google (`server/services/auth/authentication_client.py`), busca os dados do usuário e procura o `User` pelo e-mail. **No primeiro login, o usuário é criado** sem grupos e sem ser admin: um admin precisa dar acesso depois.
3. O backend cria uma linha em `UserSession` e devolve o cookie `session`.

```python
response.set_cookie(
    key="session",
    value=token,            # secrets.token_urlsafe(32)
    httponly=True,
    secure=True,
    samesite="none" if CONFIG.development else "lax",
    max_age=SESSION_COOKIE_AGE,  # 90 dias
    path="/",
)
```

O banco **nunca guarda o token**: `UserSession.token_hash` é o SHA-256 dele. O `secure=True` exige HTTPS até em desenvolvimento, e é por isso que o ambiente local precisa de certificados (veja [Configurando seu Ambiente](/dev/enviroment/)).

## Como cada requisição é autenticada

`authenticate` tenta duas formas, nessa ordem:

1. **Token Bearer do Google** no header `Authorization`, validado no Google (com cache). Usado por clientes que não são o navegador.
2. **Cookie `session`**, resolvido contra a tabela `UserSession`. É o que o frontend usa.

Com o cookie, a sessão tem **expiração deslizante de 30 dias**, renovada pelo uso (`UserSessionRepository.slide_on_use`), com um **teto absoluto de 90 dias**: só um login interativo de verdade reinicia esse teto. O ciclo de vida completo (rotação do token a cada login, `/auth/refresh-token`, sessões antigas) está no `docs/SESSION_MANAGEMENT.md` do backend.

Variantes da mesma lógica:

| Função | Usada em | Sem credencial válida |
|---|---|---|
| `authenticate` | tiers `authenticated`, `restricted`, `admin` | 401 |
| `public_authenticate` | tier `public` | segue anônimo; se houver sessão, o usuário fica em `request.state.current_user` |
| `google_token_authenticate` | quem precisa só dos dados do Google (`GoogleAuthenticate`) | 401 |
| `google_id_token_authenticate` | `/mobile/authentication` (ID token do app mobile) | 401 |
| `health_token_authenticate` | `/health` | 401 |

### CSRF

O navegador envia o cookie em toda requisição para a API, qualquer que seja a página que a disparou. Por isso `is_trusted_cookie_request` (`server/services/security/csrf.py`) confere a origem das requisições que alteram dados:

- `GET`, `HEAD` e `OPTIONS` passam sempre (nunca devem alterar estado);
- os outros métodos precisam de um `Origin` (ou, na falta dele, um `Referer`) que esteja em `ALLOWED_ORIGINS` **ou** seja a própria origem da requisição (o host do `Origin` igual ao header `Host`);
- sem origem nenhuma, a requisição é recusada.

Quando a checagem falha, as rotas autenticadas respondem 403 ("Origem da requisição não permitida para sessão por cookie"), e as públicas atendem a requisição como anônima. Tokens Bearer e API keys não passam por essa checagem, porque uma página de terceiros não consegue anexar esses headers.

## Os gates de cada tier

```python
def restricted_authenticate(user: Annotated[User, Depends(authenticate)]) -> User:
    if user.is_admin:
        return user
    if not user.groups and not user.roles:
        raise RestrictedAccessRequired()  # 403
    return user


def admin_authenticate(user: Annotated[User, Depends(restricted_authenticate)]) -> None:
    if not user.is_admin:
        raise AdminAccessRequired()  # 403
```

O gate do tier `restricted` aceita os dois modelos de permissão: basta o usuário pertencer a um **grupo** ou ter um **papel** (`Role`). Ele só decide quem entra no tier. O que cada usuário pode fazer lá dentro continua sendo decidido objeto a objeto pelos checkers, abaixo: um papel que só cobre a sala 7 deixa o usuário passar pelo gate, mas ele recebe 403 ao abrir a sala 8.

O frontend aplica o mesmo critério no `RestrictedRoute` e no menu (`hasRestrictedAccess`, em `src/utils/users/users.formatter.ts`). Para isso, o `UserResponse` de `GET /users` traz `role_ids`. Se você mudar o gate, mude os dois lados (veja [Frontend › Rotas e controle de acesso](/dev/frontend/routing#o-criterio-do-restrictedroute)).

## Permissões por objeto

Depois do tier, cada operação é checada contra o objeto específico pelos **permission checkers** (`server/services/security/*_permission_checker.py`), quase sempre chamados pelos adapters (veja [Fluxo de uma requisição](/dev/backend/request-flow#_5-permission-checker)). Um usuário não-admin pode fazer uma ação num objeto se:

1. o objeto pertence a um dos seus **grupos** (o modelo antigo), **ou**
2. um dos seus **papéis** concede aquela ação naquele objeto (o modelo novo).

Admin passa em qualquer checagem.

### Grupos (modelo antigo)

Um `Group` pertence a um prédio e tem um conjunto de salas (`groupclassroomlink`) e de usuários (`groupuserlink`). Todo prédio tem um grupo principal (`Building.main_group`), que dá acesso a todas as salas do prédio. Quando um usuário entra num grupo, o prédio do grupo é adicionado a `user.buildings` (`userbuildinglink`), que é o que o frontend usa para liberar as páginas restritas e o que `OwnedBuildingIdsDep` usa para filtrar listagens.

### Papéis (modelo novo)

Um `Role` agrupa permissões e é atribuído a usuários por `/admin/roles`. Toda permissão pertence a um papel: não existem mais permissões dadas direto a um usuário. Há três tipos, todos herdando de `BasePermission` (`role_id`, `granted_at`, `granted_by_id`):

| Tabela | Escopo | Ações |
|---|---|---|
| `BuildingPermission` | um prédio, ou todos (curinga) | `CREATE`, `READ`, `UPDATE`, `DELETE`, `ALLOCATE`, `RESERVE`. Vale também para todas as salas do prédio |
| `ClassroomPermission` | uma sala, ou todas | `CREATE`, `READ`, `UPDATE`, `DELETE`, `ALLOCATE`, `RESERVE`, `REQUEST` |
| `CoursePermission` | um curso, ou todos | `CREATE`, `READ`, `UPDATE`, `DELETE`. Existe no banco, mas **nenhuma rota a aplica ainda** |

Algumas regras do modelo:

- uma permissão curinga (sem prédio/sala específico) para `UPDATE`, `DELETE`, `ALLOCATE`, `RESERVE` ou `REQUEST` só vale para admins;
- remover uma reserva (e prova, evento, reunião, aprovar ou negar solicitação) exige `RESERVE`, não `DELETE`;
- remover uma turma ou disciplina exige `UPDATE`, não `DELETE`: `DELETE` fica reservado para apagar o prédio ou a sala.

As permissões do usuário são achatadas num `PermissionIndex` (`server/services/security/role_permission_evaluator.py`) uma vez por requisição, via `PermissionIndexDep`, e cada checagem vira uma busca em dicionário. A tabela completa "quero fazer X → preciso da ação Y" e a história da migração de grupos para papéis estão no `docs/PERMISSIONS.md` do backend.

### `BuildingDep`

`BuildingDep` (`building_authenticate`) lê o prédio do header `building-id` e recusa (403) se ele não estiver entre os prédios do usuário. É legado: hoje só é usado pelo crawl de disciplinas do JupiterWeb (`POST` e `PATCH /subjects/crawl`, no tier `restricted`). Em código novo, use os permission checkers.

## API keys de parceiros

Parceiros acessam as **rotas públicas** com o header `X-API-Key`, sem representar nenhum usuário. O `ApiKeyMiddleware` valida a chave antes de qualquer rota:

- a chave é sempre de servidor: uma requisição com chave **e** header `Origin` recebe 403;
- cada chave aceita só `GET`/`HEAD`, só rotas públicas e só os prefixos de rota liberados para ela, e tem validade e limites de requisição próprios;
- o banco guarda só o HMAC da chave, calculado com `API_KEY_SECRET`;
- a chave é entregue por um link de uso único (`/api-key-links`), aberto na página `/api-key/:linkId` do frontend.

O guia para parceiros está em [API Keys](/api-keys/), e o desenho completo (formato da chave, cache, revogação, e-mails de expiração) no `docs/API_KEYS.md` do backend.

## Rate limit

O `RateLimitMiddleware` limita as requisições por IP (`ANON_RATE_LIMITS`) ou, com uma API key válida, pelos limites da chave (`apikeyratelimit`, ou `API_KEY_DEFAULT_LIMITS`). Os contadores ficam no Redis (`REDIS_URL`); sem Redis, o rate limit fica desligado. O modo vem de `RATE_LIMIT_MODE`: `off`, `shadow` (só conta e registra) ou `enforce` (bloqueia com 429, o padrão). Detalhes no `docs/RATE_LIMIT.md` do backend.

## Desenvolvendo sem o Google

Com `OVERRIDE_AUTH=True`, o `deps_overrides.py` troca `authenticate` por um mock que autentica toda requisição como o usuário de `MOCK_EMAIL`. Esse usuário precisa existir no banco (o `initial_data.py` cria o admin de `FIRST_SUPERUSER_EMAIL`, que é um bom candidato). Veja [Configuração](/dev/backend/config).
