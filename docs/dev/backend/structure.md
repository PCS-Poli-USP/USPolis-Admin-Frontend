---
prev:
  text: 'Backend › Visão geral'
  link: '/dev/backend/'

next:
  text: 'Backend › Rotas e tiers'
  link: '/dev/backend/routes'
---

# Estrutura de arquivos

O backend organiza os arquivos **por camada**, e o nome do recurso vai no nome do arquivo. Não existe uma pasta `reservations/` com tudo daquele domínio: a reserva tem um arquivo em cada camada (rota, model, schema HTTP, repositório, checker, adapter). O frontend faz o contrário e organiza por funcionalidade, veja [Frontend › Estrutura de arquivos](/dev/frontend/structure).

## Raiz do repositório

```bash
USPolis-Admin-Backend/
├── server/              # todo o código da aplicação (veja abaixo)
├── migrations/          # Alembic: env.py, script.py.mako e versions/ (uma migração por arquivo)
├── alembic.ini          # script_location = migrations; a URL de lá é placeholder, o env.py sobrescreve
├── tests/               # suíte de testes (veja Testes, lint e tipos)
├── wsgi.py              # servidor de desenvolvimento (uvicorn com reload e HTTPS)
├── asgi.py              # alvo de produção (gunicorn asgi:app)
├── pyproject.toml       # dependências (main, dev, test) e configuração de mypy, ruff, pytest e coverage
├── poetry.lock
├── poetry.toml          # virtualenvs.in-project = true (o venv fica em .venv/ dentro do repo)
├── .env.example         # lista de variáveis de ambiente (veja Configuração)
├── Dockerfile           # base com Playwright/Chromium; estágios dev e prod
├── docker/              # entrypoint.sh (certs, pre_start, migrações, seed, uvicorn ou gunicorn) e README.md
├── setup.sh             # instala o Chromium do Playwright (chama scripts/install_playwright_chromium.sh)
├── scripts/             # install_playwright_chromium.sh, preview_email_templates.py, statistics.sh
├── docs/                # markdowns de desenho (veja Visão geral › Documentação adicional)
├── .github/workflows/
│   └── ci_cd.yml        # deploy a cada push na main (veja Configurando seu Ambiente)
├── certs/               # key.pem e cert.pem do HTTPS local (no .gitignore)
├── email_previews/      # saída do preview_email_templates.py (no .gitignore)
├── README.md
└── CLAUDE.md            # instruções para agentes (no .gitignore)
```

## `server/`

```bash
server/
├── app.py                  # instância do FastAPI, middlewares, routers, overrides e handlers
├── config.py               # objeto CONFIG (Settings), lido do .env / .env.<ambiente>
├── db.py                   # engine, get_db() e o import de todos os models (registro no metadata)
├── cache.py                # cache em memória por worker: @simple_cache e @date_range_cache
├── logger.py               # app_logger (logs/api.log) e loki_access (logs/loki-access-api.log)
├── deps_overrides.py       # troca a autenticação pelo mock quando OVERRIDE_AUTH=True
├── exception_handlers.py   # IntegrityError → 409, NoResultFound → 404, GoogleAuthError → 403
│
├── routes/                 # rotas, uma pasta por tier de acesso
│   ├── health/             #   /health, protegida por HEALTH_API_KEY
│   ├── public/             #   sem login obrigatório
│   ├── authenticated/      #   qualquer usuário logado
│   ├── restricted/         #   admin ou membro de algum grupo
│   ├── admin/              #   só admin, tudo sob /admin
│   └── dev/                #   só em development
│
├── deps/                   # dependências do FastAPI (Annotated[..., Depends(...)])
│   ├── authenticate.py     #   autenticação de cada tier, UserDep, BuildingDep
│   ├── session_dep.py      #   SessionDep
│   ├── permission_index_dep.py  # PermissionIndexDep (índice de papéis do usuário)
│   ├── access_scope_dep.py      # AccessScopeDep (escopo de acesso por ação)
│   ├── pagination_dep.py   #   PaginationDep (page, page_size)
│   ├── interval_dep.py     #   QueryIntervalDep (intervalo de datas, até 366 dias)
│   ├── google_auth_dep.py  #   ID token do Google para o app mobile
│   ├── conflict_checker.py #   ConflictCheckerDep
│   └── repository_adapters/  # <recurso>_repository_adapter.py: regras + permissão + commit
│
├── repositories/           # <recurso>_repository.py: consultas e escrita no banco (métodos estáticos)
│
├── models/
│   ├── database/           # <entidade>_db_model.py e <a>_<b>_link.py: tabelas SQLModel (table=True)
│   ├── http/
│   │   ├── requests/       # <recurso>_request_models.py: corpos de requisição (Pydantic)
│   │   ├── responses/      # <recurso>_response_models.py: respostas, com construtores from_<x>()
│   │   ├── exceptions/     # respostas de erro padronizadas
│   │   └── validators/     # validações reaproveitadas pelos requests (calendar, subject)
│   ├── dicts/              # TypedDicts: base/, database/, requests/ (assinaturas de update e factories)
│   └── page_models.py      # PaginationInput, tamanhos de página padrão e máximo
│
├── middlewares/            # logger, api_key, rate_limit e request_utils (IP do cliente, caminho)
│
├── services/               # lógica que não é rota nem repositório (veja Serviços e integrações)
│   ├── auth/               #   cliente do Google OAuth
│   ├── security/           #   permission checkers, avaliador de papéis, escopo de acesso (access_scope.py), CSRF, API keys
│   ├── cron/               #   lifespan e tarefas agendadas
│   ├── email/              #   envio de e-mails com templates Jinja2
│   ├── jupiter_crawler/    #   scraping do JupiterWeb (disciplinas, turmas, cursos, grades, grade do aluno)
│   ├── janus_crawler/      #   scraping do Janus (pós-graduação)
│   ├── access_log_writer.py    # grava ApiAccessLog em lote
│   ├── conflict_checker.py     # conflitos de horário/alocação
│   ├── occupance_reports_service.py  # relatórios de ocupação
│   ├── rate_limiter.py, redis_client.py  # rate limit sobre Redis
│   └── gmail_service.py        # Gmail API (fórum e comentários do mobile)
│
├── templates/              # e-mails Jinja2: _layout/, api_keys/, feedbacks/, reports/, solicitations/
├── static/assets/          # imagens servidas por /static (logos dos e-mails)
├── utils/                  # helpers puros: datas no fuso de Brasília, horários, ocorrências, type guards
│   └── enums/              #   enums do domínio (espelhados em src/utils/enums/ no frontend)
├── scripts/
│   ├── pre_start.py        #   espera o banco; num banco vazio, create_all() + alembic stamp head
│   ├── initial_data.py     #   cria o primeiro admin (FIRST_SUPERUSER_*)
│   └── dumps/              #   utilitários pontuais de importação de dados (não são rotina de backup)
├── mocks/deps/             # authenticate_mock.py, usado com OVERRIDE_AUTH
└── exceptions/             # exceções de banco compartilhadas
```

Algumas pastas existem vazias, sobras de reorganizações antigas: `server/models/validators/`, `server/models/http/validators/base/`, `server/services/interfaces/` e `server/mocks/services/`. Não coloque código novo nelas.

## Uma camada, um arquivo

Usando a sala (`classroom`) como exemplo:

| Camada | Pasta | Arquivo | Responsabilidade |
|---|---|---|---|
| Rota | `server/routes/<tier>/` | `classroom_routes.py` | Declara o endpoint, recebe o request validado e devolve o response |
| Adapter | `server/deps/repository_adapters/` | `classroom_repository_adapter.py` | Checa permissão, orquestra repositórios, faz o `commit` e traduz erros de banco |
| Checker | `server/services/security/` | `classrooms_permission_checker.py` | Decide se o usuário pode fazer aquela ação naquele objeto |
| Repositório | `server/repositories/` | `classroom_repository.py` | Consultas e escrita (`add`/`flush`), sem regra de permissão |
| Model | `server/models/database/` | `classroom_db_model.py` | A tabela |
| Request | `server/models/http/requests/` | `classroom_request_models.py` | `ClassroomRegister`, `ClassroomUpdate` |
| Response | `server/models/http/responses/` | `classroom_response_models.py` | `ClassroomResponse.from_classroom(...)` |
| Dicts | `server/models/dicts/{base,database,requests}/` | `classroom_*_dict.py` | Tipos dos dicionários usados em updates e nas factories de teste |

O caminho de uma requisição por essas camadas está em [Fluxo de uma requisição](/dev/backend/request-flow).

## Convenções de nome

A regra geral é `<recurso>_<camada>.py`, com o recurso no singular e em snake_case. As exceções que já existem:

| Camada | Padrão | Exceções |
|---|---|---|
| Rotas | `<recurso>_routes.py` | Em `routes/admin/` o padrão é `<recurso>_admin_routes.py` |
| Models | `<entidade>_db_model.py`; tabelas de ligação `<a>_<b>_link.py` | `user_absence.py`; `forum_db_model.py` define `ForumPost`; `mobile_comments_db_model.py` define `Comment` |
| Responses | `<recurso>_response_models.py` | Vários arquivos mais novos usam `<recurso>_response.py`; `bug_report_reponse_models.py` (com erro de digitação) |
| Checkers | `<recurso>_permission_checker.py` | Alguns no plural: `buildings_`, `classrooms_`, `subjects_permission_checker.py` |
| Dicts | `<recurso>_base_dict.py`, `<recurso>_database_dicts.py`, `<recurso>_requests_dicts.py` | |

Ao criar um recurso novo, siga o padrão geral nas pastas correspondentes. O passo a passo está em [Como adicionar um recurso](/dev/backend/new-resource).

## Dependências (`pyproject.toml`)

| Grupo | Para que | Instalar |
|---|---|---|
| principal | Tudo que a aplicação usa em produção | `poetry install --without test,dev` |
| `dev` | mypy, ruff e os pacotes de tipos (`types-*`, `pandas-stubs`) | `poetry install --with dev` |
| `test` | plugins do pytest (`pytest-asyncio`, `pytest-cov`), `faker`, `fakeredis`, `asgi-lifespan` | `poetry install --with test` |

O `requires-python` é `>=3.12`.
