---
prev:
  text: 'Configurando seu Ambiente'
  link: '/dev/enviroment'

next:
  text: 'Backend › Estrutura de arquivos'
  link: '/dev/backend/structure'
---

# Backend

O backend do USPolis é uma API em **FastAPI** (Python 3.12), com **SQLModel/SQLAlchemy** sobre **PostgreSQL**, migrações com **Alembic** e dependências gerenciadas pelo **Poetry**. O código fica no repositório [USPolis-Admin-Backend](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend), todo dentro da pasta `server/`: não existe `app/` ou `src/` separado, e o Poetry roda com `package-mode = false`.

Para a lista completa de bibliotecas veja [Tecnologias Utilizadas](/dev/stack#backend). Para subir o projeto, veja [Configurando seu Ambiente](/dev/enviroment/#backend).

## Mapa desta seção

| Página | O que você encontra |
|---|---|
| [Estrutura de arquivos](/dev/backend/structure) | A árvore completa do repositório e de `server/`, a tabela de camadas e as convenções de nome |
| [Rotas e tiers](/dev/backend/routes) | Os níveis de acesso e a lista de todos os módulos de rota com seus prefixos |
| [Fluxo de uma requisição](/dev/backend/request-flow) | O caminho de uma requisição: middlewares, dependências, adapter, checker, repositório e model |
| [Autenticação e permissões](/dev/backend/auth) | Login, cookie de sessão, CSRF, os gates de cada tier, o sistema de papéis e as API keys |
| [Serviços e integrações](/dev/backend/services) | Crawlers do Júpiter e do Janus, e-mail, cache, Redis, tarefas agendadas e busca |
| [Configuração](/dev/backend/config) | Como o `.env` é carregado e a tabela de todas as variáveis de ambiente |
| [Testes, lint e tipos](/dev/backend/testing) | Estrutura de `tests/`, isolamento por transação, factories, comandos, mypy e ruff |
| [Como adicionar um recurso](/dev/backend/new-resource) | O passo a passo de ponta a ponta, do model à rota e aos testes |

As tabelas do banco têm uma seção própria: [Banco de Dados](/dev/database/).

## Pontos de entrada

| Arquivo | Uso |
|---|---|
| `server/app.py` | Cria a instância do FastAPI, registra middlewares, routers, overrides de dependência e handlers de exceção |
| `wsgi.py` | **Desenvolvimento.** `python wsgi.py` sobe o `uvicorn` em `server.app:app`, na porta `PORT` (padrão 5000). Em `development` ou `staging` liga o reload e o HTTPS, lendo `certs/key.pem` e `certs/cert.pem` da raiz do repositório do backend |
| `asgi.py` | **Produção.** Só faz `from server.app import app`. O processo de produção é `gunicorn asgi:app` com workers `uvicorn.workers.UvicornWorker` (veja `docker/entrypoint.sh`) |

A API é montada com `root_path="/api"`. Em produção, um proxy encaminha `/api/*` para o processo, então todas as rotas aparecem com o prefixo `/api` para quem consome. O Swagger fica em `/api/docs`, o ReDoc em `/api/redoc` e o schema em `/api/openapi.json`.

## O que o `app.py` registra

### Middlewares

```python
app.add_middleware(RateLimitMiddleware)
app.add_middleware(ApiKeyMiddleware)
app.add_middleware(CORSMiddleware, ...)
app.add_middleware(LoggerMiddleware)
```

No Starlette, o último middleware adicionado é o mais externo. A ordem de execução de uma requisição é, portanto:

```text
requisição → LoggerMiddleware → CORSMiddleware → ApiKeyMiddleware → RateLimitMiddleware → rotas
```

| Middleware | Arquivo | O que faz |
|---|---|---|
| `LoggerMiddleware` | `server/middlewares/logger_middleware.py` | Registra toda requisição e resposta nos logs e grava as respostas de erro em `ApiAccessLog` (veja `LOGGING.md` no backend e [Observabilidade](/dev/observability/)) |
| `CORSMiddleware` | Starlette | Libera só as origens de `ALLOWED_ORIGINS`, com credenciais. Expõe os headers `Retry-After` e `X-RateLimit-*` para o navegador |
| `ApiKeyMiddleware` | `server/middlewares/api_key_middleware.py` | Valida o header `X-API-Key` das [API keys de parceiros](/api-keys/). Sem o header, a requisição segue anônima; com uma chave inválida, é recusada e nunca vira anônima |
| `RateLimitMiddleware` | `server/middlewares/rate_limit_middleware.py` | Limita por IP ou, com uma chave válida, pelos limites da chave. Usa Redis; sem `REDIS_URL`, fica desligado |

O ApiKey e o RateLimit ficam **dentro** do CORS para que as respostas 401/403/429 ainda levem os headers de CORS (senão o navegador mostraria um erro de CORS no lugar do erro real). O ApiKey vem antes do RateLimit para que uma chave válida seja contada nos próprios limites. Sites de parceiros não recebem CORS: as chaves são só de servidor.

### Routers

`HealthRouter`, `PublicRouter`, `AuthenticatedRouter`, `RestrictedRouter` e `AdminRouter`, um por tier de acesso. O `DevRouter` só é incluído quando `CONFIG.environment == "development"`. Veja [Rotas e tiers](/dev/backend/routes).

### Overrides de dependência

`server/deps_overrides.py`: quando `OVERRIDE_AUTH=True`, troca a dependência `authenticate` por um mock (`server/mocks/deps/authenticate_mock.py`) que autentica toda requisição como o usuário de `MOCK_EMAIL`. Serve para desenvolver sem configurar o Google. **Nunca ligue isso em produção.**

### Handlers de exceção

`server/exception_handlers.py` converte exceções que escapam das rotas:

| Exceção | Status |
|---|---|
| `sqlalchemy.exc.IntegrityError` | 409 |
| `sqlalchemy.exc.NoResultFound` | 404 |
| `google.auth.exceptions.GoogleAuthError` | 403 |

Os erros de domínio (recurso não encontrado, nome repetido, sem permissão) são subclasses de `HTTPException` definidas no fim de cada repositório, adapter ou checker, com a mensagem em português no `detail`.

### Lifespan (`server/services/cron/scheduler.py`)

Ao subir, cada worker:

1. imprime a situação do rate limit (`check_rate_limit_setup`) e das API keys (`check_api_key_setup`);
2. inicia quatro tarefas assíncronas em loop:

| Tarefa | Frequência | O que faz |
|---|---|---|
| `periodic_cache_cleanup` | a cada hora | Remove as entradas expiradas do cache em memória (`server/cache.py`) |
| `periodic_daily_tasks` | à meia-noite (horário de Brasília) | Roda `run_daily_tasks` numa thread: apaga logs de erro mais antigos que `ERROR_METRICS_RETENTION_DAYS` (`purge_old_access_logs`), apaga o [registro de buscas](/dev/search/#registro-de-buscas) mais antigo que `SEARCH_LOG_RETENTION_DAYS` (`purge_old_search_logs`), expira links de entrega de API key vencidos (`expire_api_key_links`) e avisa por e-mail as chaves perto de expirar (`warn_expiring_api_keys`) |
| `periodic_search_index_refresh` | a cada `SEARCH_INDEX_REFRESH_SECONDS` (10 min) | Atualiza a view materializada da [busca geral](/dev/search/) |
| `ACCESS_LOG_WRITER.run_periodic_flush` | a cada `ACCESS_LOG_FLUSH_SECONDS` (2 s) | Grava em lote as linhas de `ApiAccessLog` acumuladas pelo logger |

No shutdown, as tarefas são canceladas, e o access log é descarregado uma última vez para não perder os erros das últimas requisições.

> [!NOTE]
> Com vários workers do gunicorn, **cada worker** roda as próprias tarefas. As que tocam o banco se protegem disso (por exemplo, a atualização do índice de busca usa um advisory lock do Postgres). Se você criar uma tarefa nova, pense no que acontece quando ela roda em paralelo em todos os workers.

## Documentação adicional no repositório do backend

Esta seção é a referência geral. Os desenhos detalhados de cada subsistema ficam em markdowns no próprio repositório do backend: o `README.md` na raiz e os demais em `docs/`.

| Arquivo | Assunto |
|---|---|
| `README.md` | Setup rápido e comandos do dia a dia |
| `docker/README.md` | Estágios da imagem Docker e o que o `entrypoint.sh` faz |
| `docs/API_KEYS.md` | Desenho das API keys de parceiros (formato, entrega por link de uso único, cache, revogação) |
| `docs/PARTNER_API.md` | Guia entregue aos parceiros |
| `docs/RATE_LIMIT.md` | Limites por IP e por chave, Redis e os modos `off`, `shadow` e `enforce` |
| `docs/SESSION_MANAGEMENT.md` | Ciclo de vida do cookie de sessão |
| `docs/LOGGING.md` | Os loggers, o que cada um registra, rotação e o access log em banco |
| `docs/PERMISSIONS.md` | O modelo de permissões baseado em papéis (`Role`) e a migração a partir dos grupos |
| `docs/SEARCH.md` | Desenho da busca geral (view materializada, ranking, extensões) |
| `docs/TESTS.md` | Infraestrutura de testes, factories e convenções |
| `docs/BUGS_FOUND.md` | Bugs encontrados e corrigidos, com a causa de cada um |
| `docs/BACKLOG.md` | Pendências conhecidas |
| `docs/CHANGELOG_FRONTEND.md` | Mudanças do backend que afetam o frontend |
