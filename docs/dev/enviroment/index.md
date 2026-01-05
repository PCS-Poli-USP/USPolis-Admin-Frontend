---
prev:
  text: 'Arquitetura'
  link: '/dev/architecture'

next:
  text: 'Backend'
  link: '/dev/backend'
---

# Configurando seu ambiente

> [!WARNING]
> Documentação em construção...

Nessa página vamos ensinar como configurar seu ambiente para poder começar a desenvolver os códigos do USPolis. Para ter acesso a uma lista detalhada das tecnologias com links para as documentações acesse a página [Tecnologias Utilizadas]

## Banco de dados

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

Garanta que o seu arquivo `.env`e `.env.dev` ou `.env.prod` estejam corretamente configurados, no repositório existe um arquivo chamado `.env.example` com todos as variáveis de ambiente que utilizamos no backend.

Para rodar em ambiente de desenvolvimento é necessário apenas o `.env`e `.env.dev` corretamente configurados, além disso, utilizamos cookies e para isso é necessário rodar tanto o backend como o frontend utilizando protocolo [HTTPS](https://developer.mozilla.org/pt-BR/docs/Glossary/HTTPS).

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

Após buildar a docs você tem que garantir que os arquivos de `/docs/.vitepress/dist` estejam em `/public/docs`, sem isso, na hora de fazer o preview a docs provavelmente não irá funcionar.

Nosso script de CI/CD atualmente já gerencia esses detalhes, essa parte de mover arquivos buildados (que em produção vão para outro lugar) é necessário apenas para ver o preview final do frontend.
