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

Garanta que o seu arquivo ```.env```e ```.env.dev``` ou ```.env.prod``` estejam corretamente configurados, no repositório existe um arquivo chamado ```.env.example``` com todos as variáveis de ambiente que utilizamos no backend.

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

Após todas as dependências terem sido instaladas garanta que você configurou o seu ```.env``` e ```.env.development``` ou ```.env.production``` corretamente, siga como base o ```.env.example```.

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

### Build, Preview e Deploy

>[!IMPORTANT]
> Se estiver fazendo um deploy da docs veja a próxima sessão antes de continuar

Para fazer o build do frontend use:
```bash
yarn build
```

Para ver uma prévia de como irá ficar o seu frontend após o build use:
```bash
yarn preview
``` 

Esse comando pega os arquivos do diretório ```build```e serve eles, no terminal você verá algo como:
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

Os arquivos finais estarão em ```/docs/.vitepress/dist```, tenha isso em mente.

Para o preview faça:
```bash
yarn docs:preview
```

Isso irá servir os arquivos de build na mesma porta que ele usa para executar o ambiente da docs em desenvolvimento.

Após buildar a docs você tem que garantir que os arquivos de ```/docs/.vitepress/dist``` estejam em ```/public/docs```, sem isso, na hora de fazer o build e deploy do frontend a docs não vai funcionar, vai estar com a versão antiga. 

Nosso script de CI/CD atualmente já garante isso.

