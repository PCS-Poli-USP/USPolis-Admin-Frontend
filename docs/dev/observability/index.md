---
prev:
  text: 'Backup'
  link: '/dev/database/backup'
---

# Logs, Grafana e Loki

Esta página reúne as ferramentas que mostram o que está acontecendo no USPolis: os arquivos de log do backend, o stack de analytics (**Loki**, **Alloy** e **Grafana**), a tela **Status da API** do Portal Admin, as rotas de health-check e o **Microsoft Clarity** no frontend.

Detalhes específicos da máquina de produção (caminhos, serviços, segredos) não ficam aqui: estão na página **Documentação do Servidor**, dentro do Portal Admin (`/admin/server-docs`), restrita a administradores.

## Visão geral

| Ferramenta | Responde a | Onde fica | Retenção |
|---|---|---|---|
| `logs/api.log` | O que aconteceu numa requisição específica, com corpo de erro | Arquivo no backend | Por tamanho (1 GB × 2 por padrão) |
| `logs/loki-access-api.log` | Uma linha por requisição, já no formato do Loki | Arquivo no backend | Por tamanho (10 MB × 5) |
| **Grafana + Loki** | Volume de acessos, rotas mais usadas e mais lentas, erros, usuários ativos | `/analytics/` | 30 dias (`LOKI_RETENTION_PERIOD`) |
| **Status da API** | Quais requisições deram erro e os incidentes abertos para elas | Portal Admin → Status da API | 31 dias (`ERROR_METRICS_RETENTION_DAYS`) |
| **Health-check** | O backend e o banco estão de pé? | `GET /health`, `GET /health/database` | — |
| **Microsoft Clarity** | Como as pessoas usam as telas (mapas de calor e gravações) | Painel do Clarity | Definida pelo Clarity |

## Logs do backend

O backend não envia nada direto para o Loki: ele escreve dois arquivos em `logs/`, configurados em `server/logger.py`, e outro processo os lê. Ambos rotacionam por tamanho (`RotatingFileHandler`): quando o arquivo enche, vira `.log.1`, o `.log.1` vira `.log.2` e assim por diante.

- **`api.log`** (`app_logger`): uma linha de requisição e uma de resposta para cada chamada, com método, rota, status, duração e e-mail do usuário. Para as rotas listadas em `LOG_BODY_RULES`, o corpo da requisição também vai para a linha de resposta quando ela é um erro, então um `grep 'status="409"'` já mostra o que causou o conflito. Tamanho e quantidade de arquivos vêm de `LOG_MAX_SIZE` e `LOG_BACKUP_COUNT`.
- **`loki-access-api.log`** (`loki_access`): uma linha por requisição, feita para o Loki:

  ```
  [2026-10-29 23:02:23] INFO client_ip="..." method="GET" path="/classes/12" status="200" duration="41.250" email="fulano@usp.br"
  ```

  `duration` é em milissegundos. Requisições `OPTIONS` e os caminhos de `LOKI_EXCLUDED_PATHS` (`/health`, `/analytics`, `/api/docs`, `/api/openapi.json`) ficam de fora.

O e-mail é o do usuário logado, qualquer que seja a forma de login (cookie de sessão, token ou o mock de `OVERRIDE_AUTH`), e `"N/A"` para requisições anônimas. O IP vem de `get_client_ip()`, que só confia no `X-Forwarded-For` enviado pelos proxies configurados no Uvicorn.

::: warning Dados sensíveis
- Antes de qualquer corpo ser registrado, as chaves de `SENSITIVE_BODY_KEYS` (`password`, `token`) são trocadas por `***REDACTED***`. Inclua ali qualquer campo novo que carregue um segredo.
- Só o `loki-access-api.log` vai para o Loki. O `api.log` fica de fora porque guarda a query string, e `/auth/refresh-token` leva um refresh token do Google na URL.
:::

::: danger Mudou o formato da linha? Mude a regex também
O Alloy lê o `loki-access-api.log` com uma regex (`analytics/alloy/config.alloy`, no repositório USPolis-Admin). Se o formato em `server/logger.py` mudar e a regex não acompanhar, as linhas continuam chegando ao Loki, mas sem nenhum campo extraído, e os painéis do Grafana ficam vazios.
:::

## Grafana, Loki e Alloy

O stack de analytics roda no `docker-compose.yml` do repositório **USPolis-Admin**, com os arquivos em `analytics/`. São três serviços, todos no profile `analytics`:

```
backend ──escreve──> volume backend_logs: /app/logs/loki-access-api.log
                          │ (montado só para leitura)
                     alloy ──envia──> loki <──consulta── grafana <── nginx /analytics/
```

| Serviço | O que faz | Estado guardado em |
|---|---|---|
| `loki` | Guarda as linhas de log (30 dias por padrão) | volume `loki_data` |
| `alloy` | Lê o arquivo de acesso, extrai os campos e envia ao Loki | volume `alloy_data` (posição de leitura) |
| `grafana` | Interface em `/analytics/`, com a fonte de dados Loki e os dashboards já configurados | volume `grafana_data` (usuários e dashboards criados na interface) |

Esse stack substituiu a instalação antiga direto no servidor (binários do Loki e do Promtail e um Grafana do sistema). O Promtail chegou ao fim da vida em março de 2026, então quem lê o arquivo agora é o **Grafana Alloy**. Em relação à instalação antiga:

- Cada linha mantém o próprio horário, e não o momento em que foi lida.
- A retenção funciona de verdade. A configuração antiga definia `retention_period`, mas não ligava a retenção do compactor, então nada era apagado.
- `route`, `path`, `client_ip`, `email` e `duration` viram metadados estruturados, filtráveis sem precisar interpretar a linha.

### Como o Alloy trata cada linha

1. A regex separa data, nível, IP, método, caminho, status, duração e e-mail.
2. A data da própria linha vira o horário do registro (o container do backend roda em UTC).
3. Os ids do caminho viram `:id` no campo `route`, para agrupar por endpoint: `/curriculum_subjects/3/subjects` vira `/curriculum_subjects/:id/subjects`.
4. Só `method` e `status` viram **labels**, porque têm poucos valores possíveis. Cada combinação de labels é um stream separado no Loki, então usar `path`, `email` ou `client_ip` como label criaria milhares deles.
5. Todo o resto vai como **metadado estruturado**.

O Alloy lê só o arquivo atual, nunca os `.log.1`, `.log.2`: senão cada linha seria enviada duas vezes depois de uma rotação.

### Ligando o stack

No `.env` do USPolis-Admin:

```bash
COMPOSE_PROFILES=db,analytics
GRAFANA_ADMIN_PASSWORD=<uma senha longa e aleatória>
# só em produção: a URL pública, usada nos links e redirecionamentos do Grafana
# GRAFANA_ROOT_URL=https://<domínio>/analytics/
```

Depois, `docker compose up -d`. Na primeira vez, o Alloy envia tudo o que já está no arquivo de acesso, até o limite da retenção.

- **Desenvolvimento** (sem nginx): `http://localhost:3030/analytics/`. A porta muda com `GRAFANA_PUBLISHED_PORT`.
- **Produção**: `https://<domínio>/analytics/`, pelo nginx do stack. Com o profile desligado, esse caminho responde 502 e o resto do site continua funcionando.

Outras variáveis opcionais: `LOKI_RETENTION_PERIOD` (padrão `720h`), `LOKI_MEM_LIMIT`, `GRAFANA_MEM_LIMIT`, `GRAFANA_BIND`.

### Acesso ao Grafana

No Portal Admin, o card **Analytics (Grafana)** e o item de mesmo nome no menu lateral abrem o dashboard "USPolis - Acessos à API" em nova aba. Se você ainda não entrou no Grafana, ele pede o login e depois volta para o dashboard.

O endereço vem de `VITE_GRAFANA_URL`, definida no build do frontend:

- **Vazia** (padrão): `/analytics/` no mesmo domínio do sistema, onde o nginx do stack serve o Grafana em produção.
- **Desenvolvimento com Docker**: o `docker-compose.override.yml` já define `http://localhost:3030/analytics/`.

O Grafana tem login próprio, separado do USPolis: ser admin no USPolis não dá acesso ao Grafana.

- O Grafana **não sobe** com `GRAFANA_ADMIN_PASSWORD` vazio, para nunca expor o `admin/admin` padrão numa URL pública. A variável só é lida quando o volume `grafana_data` é criado. Para trocar a senha depois:

  ```bash
  docker compose exec grafana grafana cli admin reset-admin-password '<nova senha>'
  ```

- Cadastro aberto e acesso anônimo estão desligados. Um administrador adiciona as pessoas em *Administration → Users and access → Users*, com o papel **Viewer**, a não ser que precisem editar.
- Os logs têm e-mail e IP de quem usou o sistema. Dê acesso só a quem precisa.

### Dashboard "USPolis - Acessos à API"

Fica na pasta **USPolis** do Grafana e mostra:

- **Números do período**: requisições, usuários distintos, IPs distintos, erros 5xx e latência p95
- **Gráficos no tempo**: requisições por status, latência, usuários ativos por hora e erros por status
- **Tabelas**: rotas mais acessadas, rotas mais lentas (p95), usuários mais ativos e rotas com mais erros
- **Logs**: as requisições que deram erro 5xx

Os dashboards são carregados de `analytics/grafana/dashboards/*.json` e não podem ser salvos pela interface. Para mudar um: edite na interface, use *Export → Export as JSON*, sobrescreva o arquivo nessa pasta e faça commit. O Grafana relê a pasta a cada 30 segundos. Um JSON novo ali vira um dashboard novo. Mantenha `"datasource": {"type": "loki", "uid": "loki"}` nos painéis.

Dashboards criados do zero na interface também funcionam, mas ficam só no volume `grafana_data`.

### Consultas úteis (LogQL)

Use o *Explore* ou o *Drilldown → Logs* do Grafana para perguntas pontuais. Labels são filtradas dentro das chaves, metadados com `|`:

```txt
# requisições de um usuário
{app="uspolis-backend-api"} | email="fulano@usp.br"

# erros 5xx em um endpoint
{app="uspolis-backend-api", status=~"5.."} | route="/classrooms/full/:id"

# requisições por endpoint na última hora
sum by (method, route) (count_over_time({app="uspolis-backend-api"} [1h]))

# latência p95 em ms
quantile_over_time(0.95, {app="uspolis-backend-api"} | unwrap duration [5m]) by (app)
```

### Problemas comuns

```bash
docker compose logs -f alloy        # erros de leitura ou de envio
docker compose logs -f loki
docker compose exec grafana wget -qO- http://loki:3100/ready
```

- **Nenhum dado novo**: confira se `docker compose exec backend tail /app/logs/loki-access-api.log` está crescendo e depois veja o log do `alloy`.
- **Linhas sem campos**: o formato da linha mudou no backend. Atualize a regex em `analytics/alloy/config.alloy`.
- **Linhas antigas faltando logo depois da primeira subida**: o Loki só consulta a memória para as últimas 3 horas. As linhas antigas lidas nessa primeira carga aparecem quando o bloco é gravado em disco, em até uns 30 minutos.
- **Disco cheio**: acima de 90% de uso no disco do volume, o Loki recusa os envios. O Alloy para de ler e tenta de novo com intervalos cada vez maiores, então nada se perde, a não ser que o arquivo de acesso rotacione antes. Libere espaço ou diminua `LOKI_RETENTION_PERIOD` e rode `docker compose restart alloy`.
- **Começar do zero**: apagar os volumes `loki_data` e `alloy_data` apaga todos os logs e faz o Alloy reenviar o que ainda estiver no arquivo. Nunca apague o `grafana_data`, a não ser que queira perder os usuários.

O passo a passo completo está em `analytics/README.md`, no repositório USPolis-Admin.

## Status da API (Portal Admin)

A tela **Status da API** mostra os erros que o próprio backend guarda no banco, sem depender do stack de analytics:

- **Logs de acesso**: cada resposta com status 400 ou maior vira uma linha na tabela de logs de acesso, com rota, método, status, duração, IP, user agent, usuário (ou API key) e o detalhe do erro. Ficam de fora o `401`, os caminhos de `LOKI_EXCLUDED_PATHS` e o `429`, que só é registrado no primeiro bloqueio de cada IP por janela, para o rate limit não virar uma escrita no banco a cada requisição.
- **Incidentes**: um administrador abre um incidente a partir de um log de acesso, com nível e descrição, e atualiza sua situação até a resolução.

Uma tarefa diária apaga os logs com mais de `ERROR_METRICS_RETENTION_DAYS` dias (31 por padrão).

## Health-check

As rotas `/health` dizem se o backend responde (`GET /health`) e se o banco responde em até 1 segundo (`GET /health/database`, que devolve `503` se não). Elas exigem a chave `HEALTH_API_KEY`, configurada no `.env` do backend. Essa chave não tem relação com as [API keys de parceiros](/api-keys/).

Elas ficam de fora do log de acesso do Loki e da tabela de erros do Status da API (`LOKI_EXCLUDED_PATHS`).

## Microsoft Clarity (frontend)

O frontend usa o [Microsoft Clarity](https://clarity.microsoft.com/) para mapas de calor e gravações de sessão (`src/services/analytics/clarity.ts`).

- Fica **desligado** a menos que `VITE_CLARITY_PROJECT_ID` esteja definido no build. Como toda variável `VITE_*`, ela entra no bundle no momento do build, então ambientes locais sem ela não carregam o script nem enviam nada.
- Do usuário logado, só o **id interno** (que o Clarity transforma em hash no navegador) e a tag `user_type` (`admin` ou `user`) são enviados. Nome e e-mail não vão para o Clarity.
- Se o script for bloqueado (por um bloqueador de anúncios, por exemplo), o erro é só registrado no console e o sistema continua funcionando.
