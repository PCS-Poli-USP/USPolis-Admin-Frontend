---
prev:
  text: 'Arquitetura'
  link: '/dev/architecture'

next:
  text: 'Backend'
  link: '/dev/backend'
---

# Configurando seu ambiente

Nessa página vamos ensinar como configurar seu ambiente para poder começar a desenvolver os códigos do USPolis. Para ter acesso a uma lista detalhada das tecnologias com links para as documentações acesse a página [Tecnologias Utilizadas](/dev/stack).

O USPolis é dividido em dois repositórios: **USPolis-Admin-Backend** e **USPolis-Admin-Frontend** (esse, inclusive, é o repositório onde essa documentação vive, dentro da pasta `docs/`). Nenhum dos dois repositórios tem um `Dockerfile` ou `docker-compose` — o setup local assume um **PostgreSQL instalado diretamente na sua máquina**.

## Banco de dados

Antes de rodar o backend você precisa de um PostgreSQL rodando localmente (não existe uma versão containerizada oficial). O jeito mais simples é instalar o Postgres direto no seu sistema operacional (`apt install postgresql`, Postgres.app no Mac, etc.) — qualquer versão recente funciona.

Crie **dois bancos**: um para o dia a dia do desenvolvimento e outro exclusivo para a suíte de testes (a suíte de testes roda migrações reais e não deve compartilhar dados com o banco que você usa para navegar na aplicação), por exemplo `uspolis` e `uspolis_test`.

Com os bancos criados, o backend só enxerga o banco através das variáveis de ambiente — não existe nenhum script que crie o banco em si por você, apenas o schema dentro dele (isso é feito pelas migrações do Alembic, veja [Banco de Dados › Migrações](/dev/database/migrations)):

- `DATABASE_URI` / `DATABASE_NAME` — conexão usada pela aplicação (SQLAlchemy/psycopg2), ex: `DATABASE_URI=postgresql://usuario:senha@localhost:5432` e `DATABASE_NAME=uspolis`
- `ALEMBIC_URL` — conexão usada pelo Alembic para rodar as migrações (usa o driver asyncpg), ex: `postgresql+asyncpg://usuario:senha@localhost:5432/uspolis`
- `TEST_DATABASE_URI` / `TEST_DATABASE_NAME` / `TEST_ALEMBIC_URL` — os mesmos três, mas apontando para o banco `uspolis_test`

Depois de configurar essas variáveis (veja a seção [Backend](#backend) abaixo para onde elas ficam) e instalar as dependências do backend, rode as migrações para criar todas as tabelas:

```bash
poetry run alembic upgrade head
```

Isso precisa ser repetido tanto para o banco de desenvolvimento quanto para o de testes (a suíte de testes já roda isso sozinha a cada execução, usando `TEST_ALEMBIC_URL` — veja [Backend › Testes](/dev/backend#testes)). Para mais detalhes sobre os models, como criar uma migração nova e o funcionamento interno do Alembic aqui, veja [Banco de Dados](/dev/database).

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

Ou seja, para desenvolvimento local você precisa de **dois arquivos**: `.env` (com `ENVIRONMENT=DEVELOPMENT`) e `.env.dev` (com todas as demais variáveis). Use o `.env.example` do repositório como referência de quais variáveis existem — ele lista todas elas (sem valores).

Algumas variáveis úteis para o dia a dia de desenvolvimento, além das de banco já citadas acima:

- `OVERRIDE_AUTH=True` + `MOCK_EMAIL=<email de um usuário já existente no seu banco>` — pula completamente o login via Google OAuth e autentica toda requisição como esse usuário fixo. Extremamente útil para desenvolver localmente sem precisar configurar credenciais OAuth reais ou logar de verdade a cada refresh. **Nunca habilite isso em produção.**
- `FIRST_SUPERUSER_EMAIL` / `FIRST_SUPERUSER_NAME` — usados pelo script de seed (veja abaixo) para criar o primeiro usuário administrador.
- `GOOGLE_AUTH_CLIENT_ID` / `GOOGLE_AUTH_CLIENT_SECRET` / `GOOGLE_AUTH_REDIRECT_URI` / `G_AUTH_DOMAIN_NAME` — só são realmente necessárias se você for testar o fluxo de login de verdade (sem `OVERRIDE_AUTH`).
- `MAIL_*` — credenciais SMTP; se não forem configuradas, qualquer fluxo que dispare e-mail (aprovação/negação de solicitação, notificação de reserva, etc.) vai falhar.

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

Isso vai gerar um certificado [SSL](https://developer.mozilla.org/pt-BR/docs/Glossary/SSL) autoassinado e uma chave privada, com duração de 365 dias. Garanta que exista uma pasta `/certs` e coloque os arquivos `key.pem` e `cert.pem` nessa pasta.

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

## Frontend

Para o frontend garanta que você possui Node.js 20 ou superior antes de fazer as próximas etapas. Para gerenciar as dependências usamos o Yarn, após instalar ele execute o seguinte comando:

```bash
yarn install
```

Após todas as dependências terem sido instaladas garanta que você configurou o seu `.env` e `.env.development` ou `.env.production` corretamente, siga como base o `.env.example`. 

Para o desenvolvimento é necessário apenas o ```.env``` e ```.env.development```. Já para produção crie o seu `.env.production`, que o vite na hora de buildar vai usar ele.

Da mesma forma que foi feito no backend, precisamos adicionar uma pasta `certs` e adicionar os arquivos `key.pem` e `cert.pem` nessa pasta. **UTILIZE OS MESMOS QUE VOCÊ GEROU NA ETAPA DO BACKEND**.

Para rodar o projeto em ambiente de desenvolvimento execute:

```bash
yarn dev
```

### Extensões e comandos para desenvolvimento

Conforme já detalhado na página [Tecnologias Utilizadas](/dev/stack#frontend), usamos algumas bibliotecas para checagem de tipos, formatação de código e testes. Se você utiliza o [VScode](https://code.visualstudio.com/), recomendamos as seguintes extensões:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer) e [Test Adapter Converter](https://marketplace.visualstudio.com/items?itemName=ms-vscode.test-adapter-converter)

Garanta que nas configurações do VSCode o formatter seja o Prettier e deixe marcado o format on save. Voceê deve estar se perguntando, como eu posso usar esse formatter se para o backend eu já uso o ruff? Recomendo a utilização de perfis no VSCode, um para o backend e outro para o frontend, uma documentação de como criar seus perfis pode ser acessada [aqui](https://code.visualstudio.com/docs/configure/profiles).

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


### Build, Preview e Deploy

> [!IMPORTANT]
> Se estiver fazendo um deploy da docs veja a próxima sessão antes de continuar

Para fazer o build do frontend use:

```bash
yarn build
```

Para ver uma prévia de como irá ficar o seu frontend após o build use:

```bash
yarn preview
```

Esse comando pega os arquivos do diretório `build`e serve eles, no terminal você verá algo como:

```bash
http://localhost:4173/
```

Que é onde ele está rodando os arquivos, uma coisa importante é que **cookies** não irão funcionar em http, por isso eles ficam limitados a dev ou em produção.

### Como testar, ver o preview e fazer deploy da docs?

A documentação roda em outra porta, não roda na mesma que o frontend em si. Por isso, para rodar a docs em ambiente de desenvolvimento faça:

```bash
yarn docs
```

Para fazer o build execute:

```bash
yarn docs:build
```

Os arquivos finais estarão em `/docs/.vitepress/dist`, tenha isso em mente.

Para o preview faça:

```bash
yarn docs:preview
```

Isso irá servir os arquivos de build na mesma porta que ele usa para executar o ambiente da docs em desenvolvimento.

Após buildar a docs você tem que garantir que os arquivos de `/docs/.vitepress/dist` estejam em `/docs`, sem isso, na hora de fazer o preview a docs provavelmente não irá funcionar.

Nosso script de CI/CD atualmente já gerencia esses detalhes, essa parte de mover arquivos buildados (que em produção vão para outro lugar) é necessário apenas para ver o preview final do frontend.

### O que o CI/CD faz de verdade

O workflow fica em `.github/workflows/ci_cd.yml` e roda a cada push na branch `main`. Em ordem, ele:

1. Instala as dependências com `yarn install --frozen-lockfile`
2. Builda a docs (`yarn docs:build`) e move `docs/.vitepress/dist` para `public/docs` — é exatamente o passo manual descrito acima, só que automatizado
3. Builda o frontend (`yarn build`), injetando as variáveis `VITE_*` de produção a partir dos **secrets** do repositório GitHub (não de um arquivo `.env.production` commitado — ele não existe no repositório, é gerado em memória pelo próprio workflow)
4. Via SSH, limpa `/var/www/html/docs/*` e `/diskb/home/frontend/*` no servidor
5. Copia a pasta `build/` para `/diskb/home/frontend` no servidor (`scp`)
6. Copia `build/docs/*` para `/var/www/html/docs/` no servidor
7. Reinicia o serviço `uspolis-frontend.service` (systemd) via SSH

Ou seja, o deploy do frontend e da docs acontece **juntos**, num único workflow, e não existe deploy manual — qualquer merge em `main` já dispara isso automaticamente.
