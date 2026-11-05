---
prev:
  text: 'Administração'
  link: '/admin'
---

# API Keys

O USPolis expõe os seus dados públicos (alocações de salas, prédios, salas, turmas, disciplinas e reservas) por uma API HTTP. Qualquer pessoa pode consultar essas rotas de forma anônima, com um limite de requisições por IP. Para integrar um sistema de verdade, por exemplo o site de uma entidade estudantil, você precisa de uma **API key**: ela identifica a sua aplicação, tem limites próprios e pode ser revogada sem afetar mais ninguém.

Esta página explica quando você precisa de uma chave, como pedir uma, como usá-la (com exemplos em Python e TypeScript) e as regras de uso, que são parte do acordo para recebê-la.

## Você precisa de uma chave?

| Seu caso                                                              | Precisa de chave?                                                          |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Consultar algumas vezes para testar ou explorar os dados               | **Não.** As rotas públicas aceitam acesso anônimo, com limite por IP.       |
| Um **servidor/backend** que consulta a API e serve o seu site ou app   | **Sim.** A chave fica guardada no seu servidor.                             |
| Um **site estático** (só HTML/JS), sem servidor                        | **Sim, mas nunca no navegador.** Use uma função serverless que guarda a chave ([veja como](#site-sem-backend)). |

::: warning A chave é sempre de servidor
O USPolis não emite chaves para usar direto no navegador. Uma chave em código de front-end fica visível para qualquer visitante, e uma requisição de navegador (com o header `Origin`) é recusada com **403**.
:::

## Como pedir uma chave

Mande um e-mail para **uspolis@usp.br** com as informações abaixo. Pode copiar o modelo:

```text
Assunto: Pedido de API key do USPolis

Entidade/organização: Grêmio Politécnico
Contato técnico (nome e e-mail): Maria Silva <maria@gremio.org>
Para que vamos usar: mostrar no nosso site as salas das aulas do dia
Dados necessários (rotas): /allocations
Ambiente: produção                 (ou: homologação, para testes)
Volume esperado: ~500 requisições por dia
```

Algumas observações:

- **Peça só as rotas que vai usar.** Cada chave é limitada a uma lista de prefixos de rota (por exemplo, tudo sob `/allocations`). Acesso a todas as rotas públicas (`/`) só é liberado com uma justificativa por escrito.
- **O contato técnico precisa ser um e-mail que alguém lê.** É para ele que vão o link da chave e os avisos de chave vencendo ou vazada.
- **Uma chave por aplicação e por ambiente.** Se você tem um site e um app, ou produção e homologação, peça uma chave para cada. Isso permite trocar ou revogar uma sem derrubar as outras.
- **Volume acima do padrão?** Os limites padrão estão em [Limites](#limites). Se precisar de mais, diga no pedido e explique por quê.

### Recebendo a chave

A equipe cadastra a sua entidade e emite a chave **por um link de uso único**, enviado ao e-mail de contato. Ninguém da equipe vê a chave: ela só aparece para quem abrir o link.

1. Abra o link (`https://uspolis.com.br/api-key/...`) e clique em **Revelar chave**. Só abrir a página não gasta o link: o que gasta é o clique.
2. **Copie a chave na hora** e guarde-a num gerenciador de segredos ou numa variável de ambiente do seu servidor. Depois do clique, o link para de funcionar.
3. O link vale por **1, 24 ou 72 horas**, conforme combinado. Se expirar sem ser aberto, a chave é cancelada e você precisa pedir um novo link.

::: danger O link diz que já foi aberto, mas não foi você?
Avise a equipe **na hora** pelo uspolis@usp.br. Alguém pode ter visto a chave antes de você: ela será revogada e uma nova será emitida.
:::

O USPolis guarda só uma versão irreversível (hash) da chave, então **não tem como mostrá-la de novo**. Se você perder a chave, ela é revogada e outra é emitida.

## Como usar a chave

Envie a chave no header **`X-API-Key`**, em requisições **GET** (ou HEAD), sempre por **HTTPS**. A URL base da API é:

```text
https://uspolis.com.br/api
```

O exemplo abaixo busca as alocações do dia 17/10/2026 em `/allocations/events`:

::: code-group

```bash [cURL]
curl -H "X-API-Key: $USPOLIS_API_KEY" \
  -H "User-Agent: site-gremio/1.0 (contato@gremio.org)" \
  "https://uspolis.com.br/api/allocations/events?start=2026-10-17&end=2026-10-17"
```

```python [Python]
import os

import requests

response = requests.get(
    "https://uspolis.com.br/api/allocations/events",
    params={"start": "2026-10-17", "end": "2026-10-17"},
    headers={
        "X-API-Key": os.environ["USPOLIS_API_KEY"],
        "User-Agent": "site-gremio/1.0 (contato@gremio.org)",
    },
    timeout=10,
)
response.raise_for_status()

for event in response.json():
    print(event["start"], event["classroom"], event["title"])
```

```ts [TypeScript (Node)]
// Node 18+ (fetch nativo). A chave vem de uma variável de ambiente.
const params = new URLSearchParams({ start: '2026-10-17', end: '2026-10-17' });

const response = await fetch(
  `https://uspolis.com.br/api/allocations/events?${params}`,
  {
    headers: {
      'X-API-Key': process.env.USPOLIS_API_KEY!,
      'User-Agent': 'site-gremio/1.0 (contato@gremio.org)',
    },
  },
);
if (!response.ok) throw new Error(`USPolis respondeu ${response.status}`);

const events: { start: string; classroom: string | null; title: string }[] =
  await response.json();
for (const event of events) {
  console.log(event.start, event.classroom, event.title);
}
```

:::

::: warning Nunca coloque a chave na URL
Uma requisição com `?api_key=...` (ou `apikey`, `x-api-key`) na query string é recusada com **400**, mesmo que a chave também esteja no header. URLs ficam gravadas em logs, no histórico do navegador e em headers `Referer`.
:::

### Um cliente pronto para produção

Num sistema de verdade, envolva as chamadas num pequeno cliente que:

- lê a chave de uma variável de ambiente e se identifica com um `User-Agent`;
- faz **cache** das respostas por alguns minutos;
- respeita o **429**, esperando o `Retry-After` com espera exponencial e um pouco de aleatoriedade;
- divide períodos longos em pedaços de no máximo 31 dias (o teto de `/allocations/events`).

::: code-group

```python [Python]
import os
import random
import time
from datetime import date, timedelta

import requests

API_URL = "https://uspolis.com.br/api"
CACHE_SECONDS = 10 * 60  # alocações mudam pouco: 5 a 15 minutos é um bom valor
MAX_EVENTS_DAYS = 31     # teto de /allocations/events por requisição


class USPolisClient:
    def __init__(self, api_key: str, user_agent: str):
        self.session = requests.Session()
        self.session.headers.update({"X-API-Key": api_key, "User-Agent": user_agent})
        self._cache: dict[tuple, tuple[float, object]] = {}

    def get(self, path: str, params: dict | None = None, max_attempts: int = 5):
        key = (path, tuple(sorted((params or {}).items())))
        cached = self._cache.get(key)
        if cached and time.monotonic() - cached[0] < CACHE_SECONDS:
            return cached[1]

        for attempt in range(max_attempts):
            response = self.session.get(f"{API_URL}{path}", params=params, timeout=10)
            if response.status_code != 429:
                response.raise_for_status()
                data = response.json()
                self._cache[key] = (time.monotonic(), data)
                return data
            # 429: espere o Retry-After (ou mais, a cada tentativa) + aleatoriedade.
            retry_after = int(response.headers.get("Retry-After", "1"))
            time.sleep(max(retry_after, 2**attempt) + random.uniform(0, 1))
        raise RuntimeError("USPolis: limite de requisições excedido")

    def allocation_events(self, start: date, end: date) -> list[dict]:
        events: list[dict] = []
        chunk_start = start
        while chunk_start <= end:
            chunk_end = min(chunk_start + timedelta(days=MAX_EVENTS_DAYS - 1), end)
            events += self.get(
                "/allocations/events",
                {"start": chunk_start.isoformat(), "end": chunk_end.isoformat()},
            )
            chunk_start = chunk_end + timedelta(days=1)
        return events


client = USPolisClient(
    api_key=os.environ["USPOLIS_API_KEY"],
    user_agent="site-gremio/1.0 (contato@gremio.org)",
)
events = client.allocation_events(date(2026, 8, 1), date(2026, 12, 15))
```

```ts [TypeScript (Node)]
const API_URL = 'https://uspolis.com.br/api';
const CACHE_MS = 10 * 60 * 1000; // alocações mudam pouco: 5 a 15 minutos é um bom valor
const MAX_EVENTS_DAYS = 31; // teto de /allocations/events por requisição
const DAY_MS = 24 * 60 * 60 * 1000;

export interface AllocationEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  classroom: string | null;
  classroom_capacity: number | null;
  resourceId: string;
  type: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export class USPolisClient {
  private cache = new Map<string, { at: number; data: unknown }>();

  constructor(
    private apiKey: string,
    private userAgent: string,
  ) {}

  async get<T>(path: string, params: Record<string, string> = {}, maxAttempts = 5): Promise<T> {
    const url = `${API_URL}${path}?${new URLSearchParams(params)}`;
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.data as T;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await fetch(url, {
        headers: { 'X-API-Key': this.apiKey, 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(10_000),
      });
      if (response.status !== 429) {
        if (!response.ok) throw new Error(`USPolis respondeu ${response.status}`);
        const data = (await response.json()) as T;
        this.cache.set(url, { at: Date.now(), data });
        return data;
      }
      // 429: espere o Retry-After (ou mais, a cada tentativa) + aleatoriedade.
      const retryAfter = Number(response.headers.get('Retry-After') ?? 1);
      await sleep((Math.max(retryAfter, 2 ** attempt) + Math.random()) * 1000);
    }
    throw new Error('USPolis: limite de requisições excedido');
  }

  async allocationEvents(start: Date, end: Date): Promise<AllocationEvent[]> {
    const events: AllocationEvent[] = [];
    for (let from = start; from <= end; ) {
      const to = new Date(Math.min(from.getTime() + (MAX_EVENTS_DAYS - 1) * DAY_MS, end.getTime()));
      events.push(
        ...(await this.get<AllocationEvent[]>('/allocations/events', {
          start: isoDate(from),
          end: isoDate(to),
        })),
      );
      from = new Date(to.getTime() + DAY_MS);
    }
    return events;
  }
}

const client = new USPolisClient(
  process.env.USPOLIS_API_KEY!,
  'site-gremio/1.0 (contato@gremio.org)',
);
const events = await client.allocationEvents(new Date('2026-08-01'), new Date('2026-12-15'));
```

:::

::: tip Melhor ainda: busque em segundo plano
Em vez de consultar o USPolis a cada visita, deixe o seu backend buscar os dados a cada poucos minutos (um cron ou uma tarefa agendada), guardar o resultado e servir o seu site a partir dele. Assim o seu site continua no ar mesmo se a API estiver lenta.
:::

### Site sem backend

A chave **nunca** pode ir para o navegador: qualquer valor em código de front-end fica visível no DevTools e pode ser copiado por qualquer visitante. Por isso o USPolis não emite chaves para uso direto no navegador, e uma chave que chega com o header `Origin` (que todo navegador envia) é recusada com **403**.

Se o seu site é só HTML/JS, coloque uma **função serverless** entre ele e o USPolis. Ela guarda a chave, faz cache e devolve ao seu site só os dados de que ele precisa:

::: code-group

```ts [Next.js (Route Handler)]
// app/api/alocacoes-de-hoje/route.ts
// Roda no servidor (Vercel, Netlify...): a chave nunca chega ao navegador.
export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const response = await fetch(
    `https://uspolis.com.br/api/allocations/events?start=${today}&end=${today}`,
    {
      headers: {
        'X-API-Key': process.env.USPOLIS_API_KEY!,
        'User-Agent': 'site-gremio/1.0 (contato@gremio.org)',
      },
      next: { revalidate: 600 }, // cache de 10 minutos, compartilhado por todos os visitantes
    },
  );
  if (!response.ok) {
    return Response.json({ error: 'Falha ao consultar o USPolis' }, { status: 502 });
  }
  return Response.json(await response.json());
}
```

```ts [Cloudflare Worker]
// A chave fica num secret do Worker: `wrangler secret put USPOLIS_API_KEY`.
interface Env {
  USPOLIS_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const cache = caches.default;
    const cached = await cache.match(request);
    if (cached) return cached;

    const today = new Date().toISOString().slice(0, 10);
    const upstream = await fetch(
      `https://uspolis.com.br/api/allocations/events?start=${today}&end=${today}`,
      {
        headers: {
          'X-API-Key': env.USPOLIS_API_KEY,
          'User-Agent': 'site-gremio/1.0 (contato@gremio.org)',
        },
      },
    );
    if (!upstream.ok) return new Response('Falha ao consultar o USPolis', { status: 502 });

    const response = new Response(upstream.body, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600', // cache de 10 minutos
        'Access-Control-Allow-Origin': 'https://gremio.org', // só o seu site
      },
    });
    ctx.waitUntil(cache.put(request, response.clone()));
    return response;
  },
};
```

```python [Python (FastAPI)]
import os
import time
from datetime import date

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=["https://gremio.org"], allow_methods=["GET"]
)

HEADERS = {
    "X-API-Key": os.environ["USPOLIS_API_KEY"],
    "User-Agent": "site-gremio/1.0 (contato@gremio.org)",
}
CACHE_SECONDS = 10 * 60
_cache: dict = {"day": None, "at": 0.0, "data": None}


@app.get("/alocacoes-de-hoje")
async def alocacoes_de_hoje():
    today = date.today().isoformat()
    if _cache["day"] == today and time.monotonic() - _cache["at"] < CACHE_SECONDS:
        return _cache["data"]

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(
            "https://uspolis.com.br/api/allocations/events",
            params={"start": today, "end": today},
            headers=HEADERS,
        )
    if response.status_code != 200:
        raise HTTPException(502, "Falha ao consultar o USPolis")

    _cache.update(day=today, at=time.monotonic(), data=response.json())
    return _cache["data"]
```

:::

O seu site chama a função (`fetch('/api/alocacoes-de-hoje')`), nunca o USPolis direto. Alguns cuidados:

- **Exponha só o que o site usa**, com parâmetros fixos ou validados. Nunca repasse caminhos arbitrários (uma rota `/proxy/*` que encaminha qualquer coisa): isso transforma a sua função numa porta aberta para usar a sua chave.
- **Não repasse os headers do navegador.** Monte a requisição ao USPolis do zero: se o header `Origin` for encaminhado junto, a resposta é **403**.
- **Faça cache na função.** Todos os visitantes compartilham as mesmas respostas, e você fica longe dos limites da chave.
- **Restrinja o CORS da função** ao domínio do seu site, se ele estiver em outro domínio.

## O que a chave permite

- **Só leitura** (GET/HEAD) e **só rotas públicas**. A chave nunca representa um usuário do USPolis.
- **Só os prefixos liberados** para ela, por exemplo `/allocations` ou `/buildings`. Qualquer outra rota responde **403**.
- **Validade de no máximo 1 ano.** Antes de vencer, peça uma chave nova: a equipe emite a nova antes de desativar a antiga, para você trocar sem interrupção.

### Rotas mais usadas

| Rota                                | O que retorna                                                       |
| ----------------------------------- | ------------------------------------------------------------------- |
| `GET /allocations/events`           | Aulas e reservas alocadas entre `start` e `end` (padrão: hoje)       |
| `GET /allocations/resources`        | Prédios e salas, no formato usado pelo [Mapa de Salas](/allocations/) |
| `GET /buildings`                    | Prédios cadastrados                                                  |
| `GET /classrooms`                   | Salas                                                                |
| `GET /classes`                      | Turmas                                                               |
| `GET /subjects`                     | Disciplinas                                                          |
| `GET /reservations`                 | Reservas                                                             |

A lista completa das rotas, com parâmetros e formatos de resposta, fica no Swagger da API: [uspolis.com.br/api/docs](https://uspolis.com.br/api/docs) (procure as rotas da tag **Public**).

### Limites

Cada chave tem os seus próprios limites, todos aplicados ao mesmo tempo. Se nada for combinado, valem os padrões:

| Janela        | Requisições |
| ------------- | ----------- |
| 10 segundos   | 30          |
| 1 minuto      | 120         |
| 1 dia         | 10.000      |

Toda resposta traz os headers:

- `X-RateLimit-Limit`: o limite da janela mais apertada;
- `X-RateLimit-Remaining`: quantas requisições ainda cabem nela;
- `X-RateLimit-Reset`: segundos até ela zerar.

Ao passar do limite, a resposta é **429** com o header `Retry-After` (em segundos).

**Intervalos de datas:** `/allocations/events` aceita no máximo **31 dias** por requisição e as demais rotas, no máximo **1 ano**. Para períodos maiores, faça várias requisições (veja o [cliente de exemplo](#um-cliente-pronto-para-producao)).

### Formato da chave

```text
up_<ambiente>_<identificador>_<segredo>_<verificador>
up_live_a1b2c3d4e5f60718_<43 caracteres>_<6 caracteres>
```

- **`ambiente`**: `live` (produção) ou `test` (homologação). Uma chave só funciona no ambiente que a emitiu.
- **`identificador`**: 16 caracteres hexadecimais que identificam a chave sem revelá-la. É isso que você manda à equipe quando precisar de ajuda.
- **`segredo`**: a parte secreta. Nunca compartilhe a chave inteira.
- **`verificador`**: detecta erros de digitação e chaves cortadas.

## Respostas de erro

| Código | Significado                                                                                     | O que fazer                                                          |
| ------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 400    | Chave na URL, ou intervalo de datas inválido ou longo demais                                     | Mande a chave no header e respeite os tetos de datas                  |
| 401    | Chave inválida, expirada ou revogada                                                             | Confira a chave; se ela venceu ou vazou, peça outra                   |
| 403    | A chave não tem permissão para esta requisição (rota fora do escopo, método diferente de GET, ou chamada feita do navegador) | Confira a rota e se a chamada sai do seu servidor; se precisar de mais acesso, peça |
| 429    | Limite de requisições excedido, ou muitas tentativas com chave inválida a partir do seu IP       | Espere o `Retry-After` antes de tentar de novo                        |
| 503    | Chaves temporariamente indisponíveis do nosso lado                                               | Tente mais tarde e avise a equipe se persistir                        |

Por segurança, as mensagens de 401 e 403 são **genéricas** e não dizem o motivo exato. Se precisar de ajuda, mande à equipe o **identificador** da chave (o trecho depois de `up_live_`) e o horário da requisição, **nunca a chave inteira**.

::: info Uma chave inválida nunca vira acesso anônimo
Se a chave for recusada, a requisição falha: ela não cai para o acesso anônimo. Para testar sem chave, remova o header `X-API-Key`.
:::

## Boas práticas

São parte do acordo de uso. Descumpri-las pode levar à suspensão ou revogação da chave, sem aviso em caso de abuso.

### Guarde a chave como uma senha

- **A chave fica no servidor.** Nunca coloque em código de front-end, app mobile, repositório, print, issue ou ticket. Se ela aparecer num navegador, considere-a vazada.
- **Carregue de uma variável de ambiente** ou de um cofre de segredos (GitHub Actions secrets, Vault, AWS Secrets Manager...). Não escreva a chave no código.
- **Não versione o `.env`.** Adicione-o ao `.gitignore` e deixe no repositório só um `.env.example` sem valores.
- **Uma chave por aplicação e por ambiente.** Nunca compartilhe com outras entidades.

### Proteja-se contra vazamentos

Configure o seu scanner de segredos para ser avisado se a chave for commitada:

::: code-group

```toml [gitleaks.toml]
[extend]
useDefault = true

[[rules]]
id = "uspolis-api-key"
description = "USPolis API key"
regex = '''\bup_(live|test|dev)_[0-9a-f]{16}_[0-9A-Za-z]{43}_[0-9A-Za-z]{6}\b'''
keywords = ["up_live_", "up_test_", "up_dev_"]
```

```text [GitHub (padrão customizado)]
Settings → Code security → Secret scanning → Custom patterns → New pattern

Nome:    USPolis API key
Padrão:  \bup_(live|test|dev)_[0-9a-f]{16}_[0-9A-Za-z]{43}_[0-9A-Za-z]{6}\b
```

:::

**Vazou? Avise na hora** pelo uspolis@usp.br, mandando só o identificador. A equipe revoga a chave em segundos (a revogação vale já na próxima requisição) e emite outra.

### Seja um bom cliente da API

- **Faça cache do seu lado.** As alocações mudam pouco: guarde as respostas por pelo menos 5 a 15 minutos e peça intervalos curtos.
- **Respeite o 429.** Espere o `Retry-After`, tente de novo com espera exponencial e aleatoriedade, e nunca em loop.
- **Identifique-se** com um `User-Agent` que tenha o nome da sua aplicação e um contato, por exemplo `site-gremio/1.0 (contato@gremio.org)`.
- **Use timeouts** (10 segundos é um bom valor) para que uma lentidão da API não trave o seu sistema.
- **Use só o que foi liberado.** Não sonde outras rotas e não raspe dados além do escopo combinado.

### Dados e LGPD

Não revenda nem republique dados pessoais obtidos pela API. Use os dados conforme a LGPD e as políticas da USP.

### Renove antes de vencer

A chave tem validade máxima de 1 ano. Anote a data de vencimento e peça uma nova com algumas semanas de antecedência. Chaves sem uso por mais de 90 dias podem ser revogadas na revisão periódica da equipe.
