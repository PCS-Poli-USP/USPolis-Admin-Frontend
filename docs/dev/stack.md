---
prev:
  text: 'Guia para Desenvolvedores'
  link: '/dev/'

next:
  text: 'Arquitetura'
  link: '/dev/architecture'
---

# Tecnologias Utilizadas

**Usamos o site [Shields.io](https://shields.io/badges) para gerar esses badges**

A seguir, vamos mostrar um panorama geral das principais tecnologias utilizadas no USPolis, nas próximas páginas você encontrará detalhes de como configurar seu ambiente e começar a programar!

## Backend

No USPolis utilizamos as seguintes tecnologias para o backend:

[![Static Badge](https://img.shields.io/badge/Python-3.12-03a84e)](https://www.python.org/)
Como linguagem principal, versão 3.12+.

[![Static Badge](https://img.shields.io/badge/poetry-%230352fc)](https://python-poetry.org/docs/)
Poetry é um gerenciador de pacotes para python.

[![Static Badge](https://img.shields.io/badge/FastAPI-0cc2b6)](https://fastapi.tiangolo.com)
Framework para desenvolvimento de API's em python, baseada nos typehints do python.

[![Static Badge](https://img.shields.io/badge/SQLModel-7c2ea3)](https://sqlmodel.tiangolo.com/)
Uma biblioteca para interagir com banco de dados SQL usando código Python, uma ORM.

[![Static Badge](https://img.shields.io/badge/SQLAlchemy-edc309)](https://www.sqlalchemy.org/)
É uma ORM para Python que o SQLModel usa como base.

[![Static Badge](https://img.shields.io/badge/alembic-408080)](https://alembic.sqlalchemy.org/en/latest/)
Uma biblioteca para migração de banco de dados, utiliza o SQLAlchemy como base.

[![Static Badge](https://img.shields.io/badge/PostgreSQL-1965c2)](https://www.postgresql.org/)
Banco de dados relacional (SQL).

[![Static Badge](https://img.shields.io/badge/Pydantic-c22141)](https://docs.pydantic.dev/latest/)
Biblioteca para validação de dados em Python, tanto o SQLModel como o FastAPI utilizam o Pydantic.

[![Static Badge](https://img.shields.io/badge/mypy-gray)](https://www.mypy-lang.org)
Um type checker estático para Python.

[![Static Badge](https://img.shields.io/badge/Ruff-6c09ed)](https://docs.astral.sh/ruff/)
Um linter e formatador de código para Python, escrito em Rust.

[![Static Badge](https://img.shields.io/badge/pytest-608080)](https://docs.pytest.org/en/stable/)
Um framework para testes em python.

## Frontend

No USPolis utilizamos as seguintes tecnologias para o frontend:

[![Static Badge](https://img.shields.io/badge/Node-1eeb25)](https://nodejs.org/pt)
Node é um runtime de JavaScript para desenvolvimento de servidores, aplicativos webs, scripts e CLI.

[![Static Badge](https://img.shields.io/badge/Typescript-035afc)](https://www.typescriptlang.org/)
Typescript é uma linguagem de tipagem forte criada em cima do JavaScript.

[![Static Badge](https://img.shields.io/badge/React-408080)](https://react.dev/)
React é um framework para desenvolvimento de interfaces web, criado pelo Facebook.

[![Static Badge](https://img.shields.io/badge/Chackra-v2-408080)](https://v2.chakra-ui.com/)
Chakra UI é uma biblioteca de componentes, utilizamos a V2, atualmente está na V3.

[![Static Badge](https://img.shields.io/badge/Vite-961eeb)](https://vite.dev/)
Vite é uma ferramenta de build para frontend e aplicações web.

[![Static Badge](https://img.shields.io/badge/Yarn-291eeb)](https://yarnpkg.com/)
Yarn é um gerênciador de pacotes para node.

[![Static Badge](https://img.shields.io/badge/Testing%20Library-a10303)](https://testing-library.com/docs/)
Biblioteca para testes de frontend.

[![Static Badge](https://img.shields.io/badge/ESLint-24034f)](https://eslint.org/)
ESLint é um analisador estático, usamos ele no frontend.

[![Static Badge](https://img.shields.io/badge/Prettier-4f2f03)](https://prettier.io/docs/)
Prettier é um formator de código, focado em desenvolvimento web.

## Docs

[![Static Badge](https://img.shields.io/badge/VitePress-8A2BE2)](https://vitepress.dev/)
Um gerador de site estáticos (SSG), utilizamos ele para gerar nossa docs através de arquivos markdown.