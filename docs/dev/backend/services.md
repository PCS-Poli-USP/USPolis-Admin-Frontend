---
prev:
  text: 'Backend › Autenticação e permissões'
  link: '/dev/backend/auth'

next:
  text: 'Backend › Configuração'
  link: '/dev/backend/config'
---

# Serviços e integrações

`server/services/` guarda a lógica que não é rota nem repositório: integrações externas, tarefas em segundo plano e regras compartilhadas. A segurança (checkers, CSRF, API keys) também mora lá, em `services/security/`, mas está descrita em [Autenticação e permissões](/dev/backend/auth).

## Crawlers: JupiterWeb e Janus

Boa parte dos dados acadêmicos vem de **scraping de páginas públicas** dos sistemas da USP (veja [Arquitetura](/dev/architecture)).

| Módulo | Fonte | O que traz | Quem chama |
|---|---|---|---|
| `jupiter_crawler/crawler.py` | JupiterWeb (público) | Disciplinas e turmas da graduação | `SubjectRepository` (crawl de disciplinas, `/subjects/crawl` no tier `restricted`) |
| `janus_crawler/crawler.py` | Janus (público) | Disciplinas e turmas da pós-graduação | `SubjectRepository`, quando o crawl é pedido com o tipo Janus |
| `jupiter_crawler/active_courses_crawler/`, `inactive_courses_crawler/` | JupiterWeb | Cursos e habilitações (`CourseOptions`) | rotas de cursos (`public` e `admin`) |
| `jupiter_crawler/curriculum_crawler/` | JupiterWeb | Grades curriculares | rotas de currículos do admin |
| `jupiter_crawler/authenticated_crawler.py` | JupiterWeb (**com login do aluno**) | A grade de matrícula do próprio aluno | `/users/schedules` (importar a [Grade Horária](/profile/timetable/)) e `/dev/jupiter/scrape` |

Os crawlers públicos usam `requests`, `BeautifulSoup`/`html5lib` e `pandas`. O crawler autenticado precisa executar JavaScript e usa o **Playwright** com um Chromium headless: é por isso que a imagem Docker parte da imagem oficial do Playwright e que o `setup.sh` (e o deploy) instalam o Chromium.

Cada Chromium consome de 200 a 500 MB. O `crawl_limiter.py` limita quantos rodam ao mesmo tempo **na máquina inteira**, com `flock` em arquivos de um diretório compartilhado por todos os workers:

| Variável | Padrão | Efeito |
|---|---|---|
| `JUPITER_CRAWL_MAX_CONCURRENT` | 2 | Crawls simultâneos no host |
| `JUPITER_CRAWL_QUEUE_SECONDS` | 15 | Quanto uma requisição espera por uma vaga antes de receber 503 |
| `JUPITER_CRAWL_TIMEOUT_SECONDS` | 60 | Tempo máximo de um crawl, incluindo abrir o navegador (504 se passar) |
| `JUPITER_CRAWL_LOCK_DIR` | `<tmp>/uspolis-jupiter-crawl` | Diretório dos locks; precisa ser o mesmo para todos os workers |

> [!IMPORTANT]
> O HTML do JupiterWeb e do Janus muda sem aviso. Os testes dos crawlers (`tests/services/`) rodam contra **snapshots** de páginas reais guardados em `tests/data/`, e há scripts para gerar e promover snapshots novos em `tests/scripts/`. Quando um crawler quebrar em produção, comece gerando um snapshot novo da página (veja [Testes, lint e tipos](/dev/backend/testing#crawlers-e-snapshots)).

## E-mail

`server/services/email/email_service.py` monta os e-mails com **Jinja2** a partir de `server/templates/` e envia por SMTP com SSL (`MAIL_HOST`, `MAIL_PORT`, `MAIL_ADDRESS`, `MAIL_PASSWORD`).

| Template | Quando é enviado |
|---|---|
| `solicitations/solicitation-{requested,approved,updated,denied,cancelled,deleted}.html` | Ciclo de vida de uma [solicitação de sala](/scheduling/solicitations/) |
| `feedbacks/feedback.html`, `reports/bug-report.html` | Feedback e relato de bug enviados pelo "Fale conosco" |
| `api_keys/api-key-link.html` | Envio do link de uso único de uma API key |
| `api_keys/api-key-expiring.html` | Aviso diário de chaves perto de expirar |

Todos herdam de `_layout/base_email.html`. Os endereços nunca são escritos à mão nos templates, porque vêm de duas variáveis globais do Jinja definidas no `email_service.py`:

- `logo_url`: as imagens vêm de `server/static/assets/`, servidas por `/static`, num endereço montado a partir de `ROOT_URL`;
- `frontend_url`: o `FRONTEND_URL` sem a barra final. Use-o em todo link para uma página do site, por exemplo `href="{{ frontend_url }}/admin/bug-reports"`. Assim, um e-mail enviado em desenvolvimento ou staging aponta para o frontend daquele ambiente.

Um teste (`tests/unit/services/test_email_frontend_links.py`) falha se algum template tiver um link com o domínio `uspolis.com.br` escrito à mão. Ao renomear uma rota do frontend, procure o caminho antigo em `server/templates/`: nenhum teste do backend sabe quais rotas o frontend tem.

Para ver os templates sem enviar nada:

```bash
poetry run python scripts/preview_email_templates.py
```

Isso gera um HTML por template, com dados de exemplo, em `email_previews/` (com um `index.html` ligando todos).

Sem as credenciais SMTP configuradas, todo fluxo que envia e-mail falha.

## Cache em memória

`server/cache.py` tem dois decorators para cachear o resultado de rotas públicas muito acessadas:

- `@simple_cache(expire_seconds=...)`: chave pelos argumentos (usado em `/mobile/classes`);
- `@date_range_cache(expire_seconds=...)`: para consultas por intervalo de datas (usado em `/allocations`, o Mapa de Salas).

O cache vive **na memória de cada worker**: não é compartilhado entre workers nem sobrevive a um restart, e uma alteração pode levar até o tempo de expiração para aparecer em todos eles. As entradas vencidas são removidas de hora em hora pelo lifespan.

## Redis e rate limit

`server/services/redis_client.py` cria as conexões (`get_redis` assíncrona e `get_sync_redis`) a partir de `REDIS_URL`, e `server/services/rate_limiter.py` implementa as janelas fixas do rate limit. Hoje o Redis é usado pelo rate limit e pelas API keys (cache dos registros das chaves e contagem de tentativas com chave inválida). Sem `REDIS_URL`, o rate limit fica desligado e as chaves são consultadas direto no banco: a aplicação funciona normalmente. Veja [Autenticação e permissões › Rate limit](/dev/backend/auth#rate-limit).

## Tarefas agendadas

`server/services/cron/` contém o lifespan (`scheduler.py`), as tarefas diárias (`daily_tasks.py`) e a atualização do índice de busca (`search_index_task.py`). O que roda e quando está em [Visão geral › Lifespan](/dev/backend/#lifespan-server-services-cron-scheduler-py).

Para uma tarefa nova:

- coloque a lógica numa função síncrona que recebe uma `Session`;
- se for diária, adicione-a à lista `DAILY_TASKS` de `daily_tasks.py`. O `run_daily_tasks` roda as tarefas em sequência, numa thread e numa sessão só, e uma exceção numa tarefa interrompe as seguintes: trate os erros dentro da sua;
- se tiver outra frequência, crie um loop novo no `scheduler.py` e cancele-o no shutdown;
- lembre que ela roda em **todos os workers**.

## Logs de acesso

O `LoggerMiddleware` escreve cada requisição em dois arquivos de log (`server/logger.py`): `logs/api.log` (`app_logger`) e `logs/loki-access-api.log` (`loki_access`, lido pelo Alloy e enviado ao Loki). As respostas de erro também viram linhas em `ApiAccessLog`, mas não direto: o `access_log_writer.py` as acumula e grava em lote a cada `ACCESS_LOG_FLUSH_SECONDS`, com um teto por IP por minuto (`ACCESS_LOG_MAX_PER_IP_PER_MINUTE`) para que uma enxurrada de 404 vire uma linha de resumo e não milhares de `INSERT`s. Essas linhas alimentam a tela [Administração › Status da API](/admin/) e são apagadas depois de `ERROR_METRICS_RETENTION_DAYS`.

O formato dos logs, a rotação e quais corpos de requisição são registrados estão no `docs/LOGGING.md` do backend. O lado do Grafana e do Loki está em [Logs, Grafana e Loki](/dev/observability/).

## Busca geral

A busca pública (`/search`) lê de uma view materializada, `search_document`, atualizada a cada `SEARCH_INDEX_REFRESH_SECONDS` pelo lifespan. O repositório é `server/repositories/search_repository.py`. Veja [Busca geral](/dev/search/) e o `docs/SEARCH.md` do backend.

## Outros serviços

| Arquivo | O que faz |
|---|---|
| `conflict_checker.py` | Detecta conflitos de horário entre ocorrências numa mesma sala (usado na alocação e na tela de [Conflitos](/oferings/conflicts/)) |
| `occupance_reports_service.py` | Monta os [relatórios de ocupação](/oferings/reports/) dos prédios |
| `gmail_service.py` | Envia e-mails pela Gmail API, usado pelo fórum e pelos comentários do app mobile. Depende de `credentials.json`/`token.json` na raiz do backend |
| `auth/authentication_client.py` | Cliente do Google OAuth: troca o código por tokens e busca os dados do usuário, com cache e timeout |
