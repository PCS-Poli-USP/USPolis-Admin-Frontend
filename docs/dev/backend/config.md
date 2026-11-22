---
prev:
  text: 'Backend › Serviços e integrações'
  link: '/dev/backend/services'

next:
  text: 'Backend › Testes, lint e tipos'
  link: '/dev/backend/testing'
---

# Configuração

Toda a configuração do backend vem de variáveis de ambiente, lidas uma vez em `server/config.py` e expostas no objeto `CONFIG`. Nenhum outro módulo lê `os.environ` direto: use sempre `CONFIG.<campo>`.

## Como os arquivos são carregados

O backend usa o [`python-decouple`](https://github.com/HBNetwork/python-decouple) em duas etapas:

1. Do arquivo `.env`, lê **só** `ENVIRONMENT` (padrão `DEVELOPMENT`) e converte para maiúsculas.
2. Conforme esse valor, lê todas as outras variáveis de um segundo arquivo:

| `ENVIRONMENT` | Arquivo |
|---|---|
| `DEVELOPMENT` | `.env.dev` |
| `PRODUCTION` | `.env.prod` |
| `STAGING` | `.env.stage` |
| qualquer outro valor | `.env.dev` |

Detalhes que costumam confundir:

- **Os dois arquivos precisam existir**, mesmo vazios: o decouple falha se não encontrar o arquivo. (O `docker/entrypoint.sh` cria arquivos vazios por isso.)
- **Variáveis do ambiente do processo ganham dos arquivos.** É assim que o Docker Compose injeta `DATABASE_URI`, `REDIS_URL`, etc.
- O `CONFIG.environment` em si é lido do **segundo** arquivo (ou do ambiente do processo), não do `.env`. Deixe `ENVIRONMENT` com o mesmo valor nos dois arquivos.
- Comparações com o ambiente nem sempre ignoram maiúsculas (veja o aviso sobre as rotas de dev em [Rotas e tiers](/dev/backend/routes#dev)). Em desenvolvimento manual, prefira `ENVIRONMENT=development` no `.env.dev`.

O `.env.example` do repositório lista todas as variáveis, com comentários. Ele não tem valores: copie-o para `.env.dev` e preencha.

## Variáveis obrigatórias

Estas variáveis **não têm valor padrão**: se não existirem (nem que vazias), a aplicação nem importa o `config.py`, e qualquer comando (`python wsgi.py`, `alembic`, `pytest`) falha na hora.

| Variável | Para que serve |
|---|---|
| `DATABASE_URI` | Conexão do SQLAlchemy **sem** o nome do banco, ex: `postgresql://usuario:senha@localhost:5432` |
| `DATABASE_NAME` | Nome do banco, ex: `uspolis`. A URL final é `f"{DATABASE_URI}/{DATABASE_NAME}"` |
| `ALEMBIC_URL` | Conexão do Alembic, com o driver asyncpg e o nome do banco: `postgresql+asyncpg://usuario:senha@localhost:5432/uspolis` |
| `MAIL_ADDRESS`, `MAIL_PASSWORD` | Conta SMTP que envia os e-mails |
| `GOOGLE_AUTH_CLIENT_ID`, `GOOGLE_AUTH_CLIENT_SECRET`, `GOOGLE_AUTH_REDIRECT_URI` | OAuth do Google para o login do frontend |
| `G_AUTH_CLIENT_ID` | Client id do Google do app mobile (valida o ID token em `/mobile/authentication`) |
| `G_AUTH_DOMAIN_NAME` | Lida pelo `config.py`, mas nenhum código usa o valor hoje. Pode ficar vazia |

Em desenvolvimento com `OVERRIDE_AUTH=True`, as do Google e do e-mail podem ficar vazias: só os fluxos que dependem delas falham.

## Todas as variáveis

### Ambiente e servidor

| Variável | Padrão | Para que serve |
|---|---|---|
| `ENVIRONMENT` | `DEVELOPMENT` | `development`, `production` ou `staging`. Escolhe o arquivo, liga o reload e o HTTPS do `wsgi.py` (development e staging) e o `SameSite=None` do cookie (development) |
| `PORT` | `5000` | Porta do `wsgi.py` e do gunicorn no Docker |
| `DEBUG` | `False` | Também escreve o `app_logger` no terminal, além do arquivo `logs/api.log` (`server/logger.py`) |
| `ALLOWED_ORIGINS` | `http://localhost:3000,https://uspolis.com.br,https://localhost:3000` | Origens com CORS e confiáveis para o cookie (CSV) |
| `FRONTEND_URL` | `http://localhost:3000` | Endereço do frontend nos links de uso único das API keys e nos links para páginas do site enviados nos e-mails (relato de bug, nova solicitação). **Precisa estar definida em produção**, senão esses links apontam para `localhost`. Se você acessa o frontend por outro endereço (um IP da rede local, por exemplo), ajuste aqui |
| `ROOT_URL` | `http://localhost:8000` | Base dos links de imagens nos e-mails: em produção, a raiz do site (o código acrescenta `/api`); em desenvolvimento, o próprio backend |

### Banco de dados

| Variável | Padrão | Para que serve |
|---|---|---|
| `DATABASE_URI`, `DATABASE_NAME`, `ALEMBIC_URL` | obrigatórias | veja acima |
| `DB_POOL_SIZE` | `5` | Conexões mantidas **por worker** |
| `DB_MAX_OVERFLOW` | `10` | Conexões extras por worker sob carga. Mantenha `workers × (pool + overflow)` abaixo do `max_connections` do Postgres |
| `DB_POOL_RECYCLE_SECONDS` | `1800` | Reabre conexões mais velhas que isso |

### Login e usuários

| Variável | Padrão | Para que serve |
|---|---|---|
| `GOOGLE_AUTH_*`, `G_AUTH_*` | obrigatórias | veja acima |
| `ALLOWED_GMAILS_DOMAINS` | vazio | Domínios de e-mail que podem entrar (CSV, ex: `usp.br`). **Vazio, ninguém entra** pelo login do Google |
| `ALLOWED_GMAILS` | vazio | E-mails avulsos liberados fora desses domínios (CSV) |
| `FIRST_SUPERUSER_EMAIL`, `FIRST_SUPERUSER_NAME` | `amdmin@uspolis.com`, `admin` | Admin criado por `python -m server.scripts.initial_data` |
| `OVERRIDE_AUTH` | `False` | Autentica toda requisição como `MOCK_EMAIL`. **Nunca em produção** |
| `MOCK_EMAIL` | `uspolis@usp.br` | Usuário usado pelo `OVERRIDE_AUTH`; precisa existir no banco |

### E-mail

| Variável | Padrão | Para que serve |
|---|---|---|
| `MAIL_HOST` | `smtp.gmail.com` | Servidor SMTP |
| `MAIL_PORT` | `465` | Porta (SMTP com SSL) |
| `MAIL_ADDRESS`, `MAIL_PASSWORD` | obrigatórias | Conta que envia |

### Rate limit e API keys

| Variável | Padrão | Para que serve |
|---|---|---|
| `REDIS_URL` | vazio | Redis do rate limit e do cache das API keys. Vazio desliga o rate limit |
| `RATE_LIMIT_MODE` | `enforce` | `off`, `shadow` (só conta e registra) ou `enforce` (bloqueia). Os testes sempre rodam com `off` |
| `ANON_RATE_LIMITS` | `40/10,150/60,5000/86400` | Limites por IP, no formato `máximo/janela_em_segundos`, todos aplicados juntos |
| `API_KEY_SECRET` | vazio | Segredo do HMAC das [API keys](/api-keys/): 32 ou mais bytes aleatórios, diferente em cada ambiente. Vazio, toda requisição com chave recebe 503. Gere com `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `API_KEY_DEFAULT_LIMITS` | `30/10,120/60,10000/86400` | Limites das chaves que não têm limites próprios |
| `HEALTH_API_KEY` | vazio | Chave do `/health`. Vazio, ninguém entra |

### Logs e métricas de erro

| Variável | Padrão | Para que serve |
|---|---|---|
| `LOG_MAX_SIZE` | `1073741824` (1 GB) | Tamanho máximo de cada arquivo de log antes de rotacionar |
| `LOG_BACKUP_COUNT` | `2` | Arquivos rotacionados mantidos |
| `LOG_QUEUE_MAX_SIZE` | `10000` | Registros esperando a thread de escrita, por logger e worker; acima disso são descartados |
| `LOG_BODY_MAX_BYTES` | `65536` | Corpos maiores que isso nunca são lidos nem registrados |
| `ACCESS_LOG_BUFFER_MAX` | `5000` | Linhas de `ApiAccessLog` esperando para ser gravadas |
| `ACCESS_LOG_FLUSH_SECONDS` | `2` | Intervalo entre as gravações em lote |
| `ACCESS_LOG_FLUSH_BATCH` | `200` | Linhas por transação; um lote cheio é gravado na hora |
| `ACCESS_LOG_MAX_PER_IP_PER_MINUTE` | `30` | Linhas de erro por IP por minuto; o resto vira uma linha de resumo |
| `ERROR_METRICS_RETENTION_DAYS` | `31` | Dias que as linhas de erro ficam guardadas antes da limpeza diária |

### Busca e crawlers

| Variável | Padrão | Para que serve |
|---|---|---|
| `SEARCH_INDEX_REFRESH_SECONDS` | `600` | Intervalo de atualização da view da [busca](/dev/search/) |
| `SEARCH_LOG_RETENTION_DAYS` | `365` | Dias que o [registro de buscas](/dev/search/#registro-de-buscas) fica guardado antes da limpeza diária |
| `SEARCH_LOG_MAX_NEW_QUERIES_PER_IP_PER_DAY` | `200` | Consultas novas que um IP pode adicionar ao registro de buscas por dia (contadas no Redis) |
| `SEARCH_LOG_MAX_NEW_QUERIES_PER_DAY` | `5000` | Consultas novas adicionadas ao registro de buscas por dia, somando todo mundo (o teto do tamanho da tabela) |
| `JUPITER_CRAWL_MAX_CONCURRENT` | `2` | Crawls autenticados do JupiterWeb ao mesmo tempo no host |
| `JUPITER_CRAWL_QUEUE_SECONDS` | `15` | Espera por uma vaga antes do 503 |
| `JUPITER_CRAWL_TIMEOUT_SECONDS` | `60` | Tempo máximo de um crawl (504) |
| `JUPITER_CRAWL_LOCK_DIR` | `<tmp>/uspolis-jupiter-crawl` | Diretório dos locks, compartilhado por todos os workers |

### Testes

| Variável | Padrão | Para que serve |
|---|---|---|
| `TEST_DATABASE_URI`, `TEST_DATABASE_NAME`, `TEST_ALEMBIC_URL` | vazio | Os mesmos três do banco, apontando para o banco exclusivo de testes (veja [Testes, lint e tipos](/dev/backend/testing)) |
| `TESTING` | `False` | Desliga Redis e rate limit. O `tests/conftest.py` liga sozinho |

### Só no Docker

Lidas pelo `docker/entrypoint.sh`, não pelo `config.py`:

| Variável | Padrão | Para que serve |
|---|---|---|
| `SEED_INITIAL_DATA` | `false` | Roda o `initial_data.py` ao subir |
| `GUNICORN_WORKERS` | `4` | Workers do gunicorn no alvo `prod` |
| `GUNICORN_FORWARDED_ALLOW_IPS` | `127.0.0.1` | De quem o gunicorn aceita `X-Forwarded-For` (o proxy) |

## Adicionando uma variável nova

1. Adicione o campo em `Settings` (`server/config.py`), **com um padrão** sempre que possível, para não quebrar o ambiente de quem ainda não tem a variável.
2. Adicione a linha ao `.env.example`, com um comentário dizendo o padrão e para que serve.
3. Atualize esta página.
4. Se ela for necessária em produção, combine com quem administra o servidor antes do deploy: o `.env.prod` fica só no servidor.
