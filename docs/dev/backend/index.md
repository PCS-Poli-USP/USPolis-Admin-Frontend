---
prev:
  text: 'Configurando seu ambiente'
  link: '/dev/enviroment'

next:
  text: 'Frontend'
  link: '/dev/frontend'
---

# Backend

Para a lista de tecnologias utilizadas veja [Tecnologias Utilizadas](/dev/stack#backend). Aqui vamos focar em como o código está organizado e nas convenções que seguimos.

Todo o código da aplicação fica dentro da pasta `server/` (não existe `app/` ou `src/` separado, o Poetry roda em `package-mode = false`).

## Ponto de entrada

A instância do FastAPI é criada em `server/app.py`:

```bash
server/
├── app.py          # instancia o FastAPI, middlewares e monta as rotas
├── config.py        # objeto CONFIG, lê o .env / .env.<ambiente>
├── db.py             # engine do SQLAlchemy + import de todos os models (necessário para o Alembic)
├── deps_overrides.py # troca as dependências de autenticação por mocks quando CONFIG.override_auth
├── exception_handlers.py
├── middlewares.py    # LoggerMiddleware
```

Para rodar em desenvolvimento (HTTPS, com reload) use:

```bash
python wsgi.py
```

Esse script sobe o `uvicorn` apontando para `server.app:app`, usando os certificados de `/certs` (veja [Configurando seu Ambiente](../enviroment/#backend)). Em produção, o processo ASGI (gunicorn/uvicorn workers) aponta para `asgi:app` (`asgi.py` só faz `from server.app import app`).

A documentação interativa do Swagger fica em `/api/docs` (`redoc` em `/api/redoc`), já que a API é montada com `root_path="/api"`.

Em `server/app.py`, além dos routers, também são registrados:

- `CORSMiddleware`, com as origens permitidas vindas de `CONFIG.allowed_origins` (`ALLOWED_ORIGINS`, CSV)
- `LoggerMiddleware` (`server/middlewares.py`) — loga toda requisição/resposta (veja `LOGGING.md` no repositório do backend para o formato exato)
- Handlers de exceção (`server/exception_handlers.py`): `IntegrityError` → 409, `NoResultFound` → 404, `GoogleAuthError` → 403
- Um `lifespan` (`server/services/cron/scheduler.py`) que, ao subir a aplicação, dispara duas tasks assíncronas em loop: uma limpeza de cache a cada hora (`periodic_cache_cleanup`) e uma rotina diária à meia-noite (horário de Brasília) que roda tarefas de manutenção (`periodic_daily_tasks` → `run_daily_tasks`, ex: expurgo de métricas de erro antigas). Ambas são canceladas no shutdown.

## Camadas de acesso (tiers)

As rotas são organizadas por **nível de acesso**, cada uma com sua própria dependência de autenticação aplicada no roteador inteiro (não em cada handler individualmente):

```bash
server/routes/
├── health/          # health-check, autenticado por API key
├── public/           # sem login (ex: autenticação, dados públicos de alocação)
├── authenticated/     # qualquer usuário logado
├── restricted/         # admin OU membro de pelo menos um grupo
├── admin/               # apenas admin
└── dev/                   # só existe quando CONFIG.environment == "development"
```

Cada pasta tem um `__init__.py` que aplica a dependência da camada e inclui os roteadores de cada recurso, por exemplo:

```python
router = APIRouter(dependencies=[Depends(restricted_authenticate)], tags=["Restricted"])
router.include_router(BuildingRouter)
router.include_router(ClassroomRouter)
```

Alguns recursos têm rotas em mais de uma camada (ex: salas têm rotas em `public`, `authenticated` e `restricted`, com níveis de detalhe diferentes), e recursos que são "especializações" de outro (exame, evento e reunião são todos tipos de reserva) têm seus roteadores montados como sub-rota do recurso pai.

## Organização por camada (não por funcionalidade)

Diferente do frontend (que organiza por funcionalidade), o backend organiza os arquivos **por tipo/camada**, com o nome do recurso no arquivo. Não existe uma pasta `reservations/` com tudo daquele domínio dentro — em vez disso:

| Camada | Pasta | Exemplo (reserva) |
|---|---|---|
| Rota (por tier) | `server/routes/<tier>/` | `reservation_routes.py` |
| Model do banco | `server/models/database/` | `reservation_db_model.py` |
| Schema de request | `server/models/http/requests/` | `reservation_request_models.py` |
| Schema de response | `server/models/http/responses/` | `reservation_response_models.py` |
| Repositório | `server/repositories/` | `reservation_repository.py` |
| Checagem de permissão | `server/services/security/` | `reservation_permission_checker.py` |
| Adapter repositório → rota | `server/deps/repository_adapters/` | `reservation_repository_adapter.py` |

A convenção de nome é sempre `<recurso>_<camada>.py`. Ao criar um recurso novo, siga esse mesmo padrão nas pastas correspondentes.

## Banco de dados

Os models do banco (SQLModel, `table=True`) ficam em `server/models/database/`, um arquivo por entidade (ou tabela de ligação, ex: `group_classroom_link.py`). Eles são **completamente separados** dos schemas Pydantic de request/response — o SQLModel não unifica as duas coisas aqui.

> [!IMPORTANT]
> Toda vez que criar um model novo, adicione o import dele em `server/db.py` — é essa lista de imports que faz o Alembic conseguir detectar o model na hora de gerar uma migração automaticamente (`--autogenerate`).

As migrações (Alembic) ficam em `migrations/`, configuradas em `alembic.ini`. Não existe script auxiliar, os comandos são os padrões do Alembic:

```bash
alembic revision --autogenerate -m "mensagem da migração"
alembic upgrade head
```

## Autenticação

O backend tenta autenticar de duas formas, nessa ordem:

1. **Token Bearer do Google OAuth**, validado via `AuthenticationClient.get_user_info()`
2. Se não houver token válido, cai para o **cookie de sessão** httponly (`session`), resolvido contra a tabela `UserSession` no banco

O cookie de sessão tem expiração deslizante de 30 dias, limitada a um máximo absoluto de 90 dias (só um login interativo de verdade reseta esse limite, uma renovação silenciosa não). Detalhes completos estão no `SESSION_MANAGEMENT.md` do repositório do backend.

Além do nível de acesso da rota (tier), existem duas checagens adicionais:

- **Por prédio**: `BuildingDep` verifica se o `building_id` (enviado via header) está entre os prédios do usuário, a não ser que ele seja admin
- **Por recurso**: cada `*_permission_checker.py` em `server/services/security/` faz checagens mais específicas dentro do handler da rota

> [!WARNING]
> Um sistema de permissões mais granular (por usuário ou por role, ligado a prédio/sala/curso) já existe no banco (`server/models/database/base_permission_db_model.py` e afins) mas ainda está em desenvolvimento — a maior parte das checagens de permissão hoje passa pelos `*_permission_checker.py`, que atualmente têm pouca cobertura de testes.

## Testes

A estrutura de `tests/` espelha os tiers de rotas:

```bash
tests/
├── api/{public,authenticated,restricted,admin}/  # testes HTTP completos via TestClient
├── integration/{repositories,services}/           # testes com banco, sem HTTP
├── unit/{models,services,utils}/                    # testes puros, sem banco
├── factories/{model,request,response,base}/          # factories (SQLModel/Faker) e builders de payload
└── conftest.py                                          # fixtures, aplica as migrações e isola cada teste numa transação
```

O isolamento entre testes **não** é feito truncando tabelas: a fixture de sessão (`tests/conftest.py`) abre uma transação e uma `SAVEPOINT`, entrega essa sessão pro teste, e ao final dá `rollback()` — nenhum dado escrito durante o teste sobrevive, sem precisar limpar tabela por tabela. As migrações de verdade (`alembic upgrade head`) são aplicadas uma única vez por sessão de testes (fixture `autouse`, `scope="session"`) contra o banco apontado por `TEST_ALEMBIC_URL`.

> [!WARNING]
> O `TESTS.md` do repositório do backend descreve um mecanismo antigo (truncar tabelas via uma função `truncate_tables`) que não é mais o que o código faz — o `README.md` do backend já está atualizado com a descrição correta (SAVEPOINT + rollback). Em caso de dúvida, confie no `conftest.py` e no `README.md`, não no `TESTS.md`.

Rodar os testes:

```bash
pytest                                    # suite completa
pytest tests/api/public/test_x.py          # um arquivo
pytest tests/api/public/test_x.py::test_x   # um teste específico
```

Requer `TEST_DATABASE_URI`, `TEST_DATABASE_NAME` e `TEST_ALEMBIC_URL` configurados no seu `.env`.

## Lint e checagem de tipos

```bash
mypy server
ruff check server
ruff format server
```

O `mypy` roda em modo bem estrito (`disallow_untyped_defs`, `disallow_incomplete_defs`, `warn_return_any`, `strict_equality`, entre outras flags em `[tool.mypy]` no `pyproject.toml`) — funções sem type hints ou com `Any` implícito não passam. O `ruff` usa `line-length = 88` e tem a regra `UP` (pyupgrade) habilitada.

## Documentação adicional no repositório do backend

Além desta página, o próprio repositório do backend tem alguns markdowns na raiz com detalhes que não duplicamos aqui:

- **`README.md`** — setup rápido, comandos de desenvolvimento e teste
- **`SESSION_MANAGEMENT.md`** — o ciclo de vida completo do cookie de sessão (criação, renovação deslizante de 30 dias, teto absoluto de 90 dias, limitações conhecidas como a ausência de um job de limpeza de sessões expiradas)
- **`LOGGING.md`** — os dois loggers (`app_logger` e `loki_access`), o que cada um registra e as regras de rotação de arquivo
- **`PERMISSIONS.md`** — o modelo de permissões baseado em `Role` (veja o aviso sobre isso na seção [Autenticação](#autenticação) acima) e o histórico de migração do modelo antigo baseado em `Group`
- **`TESTS.md`** — parcialmente desatualizado (veja o aviso na seção [Testes](#testes))
