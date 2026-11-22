---
prev:
  text: 'Arquitetura'
  link: '/dev/architecture'

next:
  text: 'Backend › Visão geral'
  link: '/dev/backend/'
---

# Configurando seu ambiente

Nessa página vamos ensinar como configurar seu ambiente para poder começar a desenvolver os códigos do USPolis. Para ter acesso a uma lista detalhada das tecnologias com links para as documentações acesse a página [Tecnologias Utilizadas](/dev/stack).

O USPolis é dividido em dois repositórios: **USPolis-Admin-Backend** e **USPolis-Admin-Frontend** (esse, inclusive, é o repositório onde essa documentação vive, dentro da pasta `docs/`). Um terceiro repositório, **[USPolis-Admin](https://github.com/PCS-Poli-USP/USPolis-Admin)**, junta os dois como submódulos e tem o `docker-compose.yml` que sobe o sistema inteiro.

Há duas formas de montar o ambiente:

- **Com Docker** (recomendado): um comando sobe banco, Redis, backend, frontend e docs, sem instalar Python, Node ou PostgreSQL na sua máquina. Veja a seção [Com Docker](#com-docker) logo abaixo.
- **Manual**: cada parte instalada direto na sua máquina, descrita nas seções [Banco de dados](#banco-de-dados), [Backend](#backend) e [Frontend](#frontend).

## Com Docker

Cada repositório tem seu `Dockerfile`, com um estágio `dev` (hot-reload) e um `prod`. O compose do USPolis-Admin usa esses dois e acrescenta PostgreSQL, Redis e a docs. Você só precisa do Docker com o Compose:

```bash
git clone --recurse-submodules https://github.com/PCS-Poli-USP/USPolis-Admin.git
cd USPolis-Admin
cp .env.example .env
docker compose up
```

Na ordem, isso sobe `postgres` e `redis`, depois o `backend` (que espera o banco, roda `alembic upgrade head` e cria um admin de desenvolvimento), depois o `frontend` e a `docs`. O `.env.example` já vem pronto para desenvolvimento, com `OVERRIDE_AUTH` ligado, então não é preciso configurar o login do Google.

| O quê | Endereço |
|---|---|
| Frontend | `https://localhost:3000` |
| Swagger do backend | `https://localhost:5000/api/docs` |
| Documentação | `http://localhost:3001/docs/` |

- **Certificados:** os dois certificados HTTPS são autoassinados e gerados na primeira subida. Abra o Swagger uma vez e aceite o aviso do navegador: enquanto o navegador não confiar no certificado do backend, toda chamada do frontend falha com um `Network Error` sem detalhes.
- **Código:** as pastas `USPolis-Admin-Backend` e `USPolis-Admin-Frontend` do USPolis-Admin são montadas nos containers, então editar o código ali reflete na hora. Só é preciso reconstruir a imagem quando as dependências mudam.
- **Submódulos:** cada submódulo aponta para um commit fixo do seu repositório. Depois de um `git pull` no USPolis-Admin, rode `git submodule update --init --recursive`.
- **Porta ocupada:** mude só o lado do host no `.env` (`FRONTEND_PUBLISHED_PORT`, `BACKEND_PUBLISHED_PORT`, `POSTGRES_PUBLISHED_PORT`, `DOCS_PUBLISHED_PORT`). Se mudar a porta do frontend, ajuste também `ALLOWED_ORIGINS` e `FRONTEND_URL`.
- **Já tem Postgres ou os repositórios clonados em outro lugar?** Dá para reaproveitar: tire o `db` de `COMPOSE_PROFILES`, aponte `POSTGRES_HOST` para `host.docker.internal` e use `BACKEND_DIR` / `FRONTEND_DIR` para as suas pastas.
- **Grafana, Loki e Alloy:** ficam no profile opcional `analytics`, veja [Logs, Grafana e Loki](/dev/observability/).

O passo a passo completo (comandos do dia a dia, logs, testar a configuração de produção localmente, backups) está no `README.md` e em `docs/DOCKER.md` do USPolis-Admin.

## Banco de dados

Esta seção e as próximas descrevem o ambiente **manual**. Se você usa o Docker, o banco já vem pronto e pode pular para [Extensões e comandos para desenvolvimento](#extensoes-e-comandos-para-desenvolvimento).

Antes de rodar o backend você precisa de um PostgreSQL rodando localmente. O jeito mais simples é instalar o Postgres direto no seu sistema operacional (`apt install postgresql`, Postgres.app no Mac, etc.). Use o **PostgreSQL 13 ou superior**: a migração da busca geral cria as extensões `unaccent` e `pg_trgm`, e só a partir do 13 o dono do banco consegue criá-las sem ser superusuário. Para o rate limit funcionar, você também precisa de um Redis (veja `REDIS_URL` em [Arquivos de ambiente](#arquivos-de-ambiente)); sem ele, o rate limit só fica desligado.

Crie **dois bancos**: um para o dia a dia do desenvolvimento e outro exclusivo para a suíte de testes (a suíte de testes roda migrações reais e não deve compartilhar dados com o banco que você usa para navegar na aplicação), por exemplo `uspolis` e `uspolis_test`.

Com os bancos criados, o backend só enxerga o banco através das variáveis de ambiente. Nenhum script cria o banco em si: o schema dentro dele é criado pelas migrações do Alembic (veja [Banco de Dados › Migrações](/dev/database/migrations/)). A lista completa de variáveis está em [Backend › Configuração](/dev/backend/config); as do banco são:

- `DATABASE_URI` / `DATABASE_NAME` — conexão usada pela aplicação (SQLAlchemy/psycopg2), ex: `DATABASE_URI=postgresql://usuario:senha@localhost:5432` (**sem** o nome do banco) e `DATABASE_NAME=uspolis`
- `ALEMBIC_URL` — conexão usada pelo Alembic para rodar as migrações (usa o driver asyncpg), ex: `postgresql+asyncpg://usuario:senha@localhost:5432/uspolis`
- `TEST_DATABASE_URI` / `TEST_DATABASE_NAME` / `TEST_ALEMBIC_URL` — os mesmos três, mas apontando para o banco `uspolis_test`

Depois de configurar essas variáveis (veja a seção [Backend](#backend) abaixo para onde elas ficam) e instalar as dependências do backend, rode as migrações para criar todas as tabelas:

```bash
poetry run alembic upgrade head
```

Isso precisa ser repetido tanto para o banco de desenvolvimento quanto para o de testes (a suíte de testes já roda isso sozinha a cada execução, usando `TEST_ALEMBIC_URL` — veja [Backend › Testes](/dev/backend/testing)). Para mais detalhes sobre os models, como criar uma migração nova e o funcionamento interno do Alembic aqui, veja [Banco de Dados](/dev/database/).

## Backend

A primeira coisa que você deve fazer é garantir que possui Python 3.12 ou acima instalado em sua máquina. Ao trabalhar com projetos python, uma prática comum é a criação de um venv, um ambiente virtual onde suas dependências serão instaladas, para isso usamos o Poetry:

Primeiro instale o poetry usando o [pipx](https://pipx.pypa.io/stable/):

```bash
pipx install poetry
```

Para instalar apenas as dependências necessárias use:

```bash
poetry install --without test,dev
```

Para instalar as dependências de desenvolvimento:

```bash
poetry install --with dev
```

Para instalar as dependências de testes:

```bash
poetry install --with test
```

### Arquivos de ambiente

O backend usa o [`python-decouple`](https://github.com/HBNetwork/python-decouple), e o carregamento é em duas etapas: o arquivo `.env` (que você sempre precisa ter) só define uma variável, `ENVIRONMENT`, que pode ser `DEVELOPMENT`, `PRODUCTION` ou `STAGING`. Dependendo do valor, o backend carrega um segundo arquivo com todas as outras variáveis:

| `ENVIRONMENT` | arquivo carregado |
|---|---|
| `DEVELOPMENT` (padrão) | `.env.dev` |
| `PRODUCTION` | `.env.prod` |
| `STAGING` | `.env.stage` |

Ou seja, para desenvolvimento local você precisa de **dois arquivos**: `.env` (com `ENVIRONMENT=development`) e `.env.dev` (com todas as demais variáveis, inclusive `ENVIRONMENT=development` de novo, porque o valor usado pelo código é o do segundo arquivo). Os dois precisam existir, mesmo que vazios. Use o `.env.example` do repositório como referência: ele lista todas as variáveis, com comentários e sem valores. Os detalhes do carregamento estão em [Backend › Configuração](/dev/backend/config).

Algumas variáveis importam logo no primeiro dia:

- Estas **não têm valor padrão** e precisam existir no `.env.dev`, nem que vazias, senão nenhum comando do backend roda: `DATABASE_URI`, `DATABASE_NAME`, `ALEMBIC_URL`, `MAIL_ADDRESS`, `MAIL_PASSWORD`, `GOOGLE_AUTH_CLIENT_ID`, `GOOGLE_AUTH_CLIENT_SECRET`, `GOOGLE_AUTH_REDIRECT_URI`, `G_AUTH_DOMAIN_NAME` e `G_AUTH_CLIENT_ID`.
- `OVERRIDE_AUTH=True` + `MOCK_EMAIL=<email de um usuário já existente no seu banco>` — pula o login via Google e autentica toda requisição como esse usuário. Assim você desenvolve sem configurar credenciais OAuth. **Nunca habilite isso em produção.**
- `FIRST_SUPERUSER_EMAIL` / `FIRST_SUPERUSER_NAME` — usados pelo script de seed (veja abaixo) para criar o primeiro admin. Um bom valor para o `MOCK_EMAIL`.
- `ALLOWED_GMAILS_DOMAINS` (ex: `usp.br`) — só para testar o login de verdade: vazio, ninguém entra pelo Google.
- `MAIL_*` — sem credenciais SMTP, qualquer fluxo que envia e-mail (solicitações, link de API key, etc.) falha.
- `API_KEY_SECRET` — necessária para testar as [API keys](/api-keys/). Gere com `python -c "import secrets; print(secrets.token_urlsafe(48))"`.
- `REDIS_URL` / `RATE_LIMIT_MODE` — sem `REDIS_URL` o rate limit fica desligado. Com Redis, o modo padrão é `enforce` (bloqueia); use `shadow` ou `off` se ele atrapalhar o desenvolvimento.
- `FRONTEND_URL` — se você acessa o frontend por outro endereço que não `http://localhost:3000` (um IP da rede local, por exemplo), ajuste aqui e em `ALLOWED_ORIGINS`.

Depois de ter o `.env`/`.env.dev` prontos e o banco criado (veja [Banco de dados](#banco-de-dados) acima), rode as migrações e, opcionalmente, crie o primeiro usuário admin:

```bash
poetry run alembic upgrade head
poetry run python -m server.scripts.initial_data
```

O `initial_data.py` só cria o usuário se ainda não existir um com o e-mail de `FIRST_SUPERUSER_EMAIL` — rodar de novo não duplica nada.

Além disso, utilizamos cookies e para isso é necessário rodar tanto o backend como o frontend utilizando protocolo [HTTPS](https://developer.mozilla.org/pt-BR/docs/Glossary/HTTPS).

Para isso, execute os seguintes comandos para gerar os seus certificados:

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

Isso vai gerar um certificado [SSL](https://developer.mozilla.org/pt-BR/docs/Glossary/SSL) autoassinado e uma chave privada, com duração de 365 dias. Crie uma pasta `certs/` na raiz do repositório do backend e coloque os arquivos `key.pem` e `cert.pem` nela. O `wsgi.py` só liga o HTTPS (e o reload) com `ENVIRONMENT` em `development` ou `staging`.

Para rodar o servidor em um ambiente de desenvolvimento (sem otimizações):

```bash
python wsgi.py
```

### Extensões e comandos para desenvolvimento

Conforme já detalhado na página [Tecnologias Utilizadas](/dev/stack#backend), usamos algumas bibliotecas para checagem de tipos, formatação de código e testes. Se você utiliza o [VScode](https://code.visualstudio.com/), recomendamos as seguintes extensões:

- [Mypy](https://marketplace.visualstudio.com/items/?itemName=matangover.mypy)
- [Ruff](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff)
- [Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer) e [Test Adapter Converter](https://marketplace.visualstudio.com/items?itemName=ms-vscode.test-adapter-converter)

Garanta que nas configurações do VSCode o formatter seja o Ruff e deixe marcado o format on save.

O arquivo que ele considera para usar essas extensões é o `pyproject.toml`, nele você vai encontrar uma seção para o Mypy, uma para o Ruff e outra para os tests.

Caso tenha queira utilizar outro editor, lembre de sempre rodar os seguintes comandos enquanto estiver desenvolvendo:

Checagem a tipagem:

```bash
mypy server
```

Formatar o código:

```bash
ruff check server
ruff format server
```

Executar os testes:

```bash
pytest
```

### CI/CD do backend

O workflow `.github/workflows/ci_cd.yml` do backend roda a cada push na `main`. O job de CI só prepara o Python 3.12 (não roda testes, mypy nem ruff). O job de deploy entra no servidor por SSH e, em `/diskb/home/backend`, faz `git pull origin main`, `poetry install --without test,dev`, instala o Chromium do Playwright e reinicia o serviço `uspolis-backend.service` (systemd). O script de inicialização desse serviço, que fica no servidor e não no repositório, roda `alembic upgrade head` antes de subir o gunicorn: as migrações são aplicadas no próprio restart.

## Frontend

Garanta que você tem o **Node.js 20** (a versão usada no Docker e no CI). O gerenciador de pacotes é o **Yarn 4**, cujo binário fica versionado no próprio repositório (`.yarn/releases/`, apontado pelo `.yarnrc.yml`): qualquer `yarn` instalado globalmente, ou o `corepack enable`, delega para essa versão. Instale as dependências com:

```bash
yarn install
```

As variáveis de ambiente seguem o padrão do Vite (`VITE_*`) e ficam em arquivos locais, fora do git: o `.env` e o `.env.development` para desenvolvimento, e o `.env.production` para um build de produção local. Use como base o arquivo **`env.example`** (sem ponto no nome) da raiz do repositório.

| Variável | Para que serve |
|---|---|
| `VITE_USPOLIS_API_ENDPOINT` | URL base da API, ex: `https://localhost:5000/api` |
| `VITE_GOOGLE_AUTH_CLIENT_ID` | Client id do Google para o login |
| `VITE_REDIRECT_URI` | Para onde o Google volta depois do login (padrão `http://localhost:3000/auth-callback`) |
| `VITE_ENVIROMENT` | `development` liga o HTTPS do dev server e desliga o aviso de "backend indisponível" |
| `VITE_USPOLIS_DOCS_URL` | Endereço desta documentação, usado nos links do menu e da home |
| `VITE_OVERRIDE_AUTH` | `'true'` deixa passar o `PrivateRoute` sem login (não afeta as páginas restritas e de admin; veja [Frontend › Rotas](/dev/frontend/routing#pulando-o-login-em-desenvolvimento)) |
| `VITE_OVERRIDE_PERSIST_LOGIN` | `'true'` não tenta restaurar a sessão ao carregar a página |
| `VITE_DEBUG` | Mostra colunas extras de depuração em algumas tabelas |
| `VITE_CLARITY_PROJECT_ID` | Liga o Microsoft Clarity (vazio = desligado) |
| `VITE_GRAFANA_URL` | Link do card "Analytics" do admin (vazio = `/analytics/` no mesmo domínio) |

O `env.example` ainda não lista `VITE_USPOLIS_DOCS_URL`, `VITE_OVERRIDE_PERSIST_LOGIN` e `VITE_DEBUG`, e o `VITE_APP_NAME` que ele lista não é lido por nenhum código.

Com `VITE_ENVIROMENT=development`, o dev server sobe em HTTPS e **exige** os arquivos `certs/key.pem` e `certs/cert.pem` na raiz do repositório do frontend. **Use os mesmos que você gerou na etapa do backend**, para o navegador só precisar confiar num certificado.

Para rodar o projeto em ambiente de desenvolvimento execute:

```bash
yarn dev
```

### Extensões e comandos para desenvolvimento

Conforme já detalhado na página [Tecnologias Utilizadas](/dev/stack#frontend), usamos algumas bibliotecas para checagem de tipos, formatação de código e testes. Se você utiliza o [VScode](https://code.visualstudio.com/), recomendamos as seguintes extensões:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer) e [Test Adapter Converter](https://marketplace.visualstudio.com/items?itemName=ms-vscode.test-adapter-converter)

Garanta que nas configurações do VSCode o formatter seja o Prettier e deixe marcado o format on save. Você deve estar se perguntando, como eu posso usar esse formatter se para o backend eu já uso o ruff? Recomendo a utilização de perfis no VSCode, um para o backend e outro para o frontend, uma documentação de como criar seus perfis pode ser acessada [aqui](https://code.visualstudio.com/docs/configure/profiles).

No diretório principal do frontend você vai encontrar os seguintes arquivos:
- `eslint.config.mjs`
- `.prettierrc.js`

A docs para configurar o eslint com typescript é essa [aqui](https://typescript-eslint.io/packages/typescript-eslint), outras regras podem ser vistas nessa mesma docs. Já para o Prettier acesse [aqui](https://prettier.io/docs/options).

Caso tenha queira utilizar outro editor, lembre de sempre rodar os seguintes comandos enquanto estiver desenvolvendo:

Rodar o linter:

```bash
yarn lint
```

Formatar o código:

```bash
yarn format
```


Rodar os testes e checar os tipos:

```bash
yarn test
npx tsc --noEmit
```

Nenhum desses comandos roda no build nem no CI: o `yarn build` não falha por erro de lint ou de tipo. Rode-os antes de abrir um PR. Veja [Frontend › Testes](/dev/frontend/testing).

### Build e preview

Para fazer o build do frontend use:

```bash
yarn build
```

Os arquivos vão para `build/`. Para servir esse build localmente:

```bash
yarn preview
```

No terminal você verá algo como `http://localhost:4173/`. Esse servidor é HTTP, e o cookie de sessão exige HTTPS (`secure`), então o login não funciona no preview: ele serve para conferir o build, não para navegar logado.

### Docs: rodar, buildar e ver o preview

A documentação é um projeto VitePress separado, em `docs/`, e roda numa porta própria:

```bash
yarn docs            # servidor de desenvolvimento em http://localhost:3001/docs/
yarn docs:build      # build em docs/.vitepress/dist
yarn docs:preview    # serve o build (porta padrão do VitePress, 4173)
```

O `docs:build` **falha se houver link interno quebrado**, então rode-o antes de abrir um PR que mexe na docs. Os arquivos ficam em `docs/.vitepress/dist`.

Em produção, a docs é servida pelo mesmo domínio do frontend, em `/docs/`. Para isso, o CI (e o estágio `build` do Dockerfile) move `docs/.vitepress/dist` para `public/docs` **antes** do `yarn build`, e o Vite copia a pasta para `build/docs`. Para reproduzir isso localmente:

```bash
yarn docs:build
rm -rf public/docs && mv docs/.vitepress/dist public/docs
yarn build && yarn preview   # a docs fica em http://localhost:4173/docs/
```

A pasta `public/docs` está no `.gitignore`.

### O que o CI/CD faz de verdade

O workflow `.github/workflows/ci_cd.yml` ("Deploy Frontend") roda a cada push na `main`, num job só. Em ordem, ele:

1. Faz o checkout e configura o Node 20 com cache do Yarn
2. Instala as dependências (`yarn install --frozen-lockfile`)
3. Builda a docs (`yarn docs:build`) e move `docs/.vitepress/dist` para `public/docs`
4. Builda o frontend (`yarn build`), passando como variáveis de ambiente do passo, a partir dos **secrets** do repositório, apenas `VITE_USPOLIS_API_ENDPOINT`, `VITE_REDIRECT_URI`, `VITE_GOOGLE_AUTH_CLIENT_ID`, `VITE_USPOLIS_DOCS_URL` e `VITE_ENVIROMENT`. Nenhum arquivo `.env.production` é usado ou gerado
5. Via SSH, limpa `/var/www/html/docs/*` e `/diskb/home/frontend/*` no servidor
6. Copia a pasta `build/` para `/diskb/home/frontend` no servidor (`scp`)
7. Via SSH, copia `build/docs/*` para `/var/www/html/docs/` e apaga `build/docs` da cópia do frontend
8. Reinicia o serviço `uspolis-frontend.service` (systemd)

Ou seja, frontend e docs são publicados **juntos**, num único workflow, a cada merge na `main`. Observações:

- O CI **não roda** lint, testes nem checagem de tipos.
- O passo de build lê as variáveis `VITE_*` dos secrets do repositório, inclusive `VITE_CLARITY_PROJECT_ID` e `VITE_GRAFANA_URL`. Um secret que não existe chega vazio: sem `VITE_CLARITY_PROJECT_ID`, o Clarity fica desligado, e sem `VITE_GRAFANA_URL`, o card do Grafana aponta para `/analytics/`.
- Existem dois outros caminhos de deploy, fora do CI: o `deploy.sh` (legado, build local + `scp`) e o alvo `prod` do `Dockerfile`, usado pelo compose do USPolis-Admin.
