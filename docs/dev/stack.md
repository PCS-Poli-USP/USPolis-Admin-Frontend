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

A seguir, um panorama das principais tecnologias do USPolis. Como cada uma é usada no código está nas seções [Backend](/dev/backend/) e [Frontend](/dev/frontend/), e como instalar tudo em [Configurando seu Ambiente](/dev/enviroment/).

## Backend

### Linguagem e ferramentas

[![Static Badge](https://img.shields.io/badge/Python-3.12-03a84e)](https://www.python.org/)
Linguagem principal, versão 3.12 ou superior.

[![Static Badge](https://img.shields.io/badge/poetry-%230352fc)](https://python-poetry.org/docs/)
Gerenciador de dependências e do ambiente virtual (o venv fica em `.venv/`, dentro do repositório).

[![Static Badge](https://img.shields.io/badge/mypy-gray)](https://www.mypy-lang.org)
Checagem estática de tipos, em modo estrito.

[![Static Badge](https://img.shields.io/badge/Ruff-6c09ed)](https://docs.astral.sh/ruff/)
Linter e formatador de código, escrito em Rust.

[![Static Badge](https://img.shields.io/badge/pytest-608080)](https://docs.pytest.org/en/stable/)
Framework de testes, com `pytest-cov` (cobertura), `pytest-asyncio` e `Faker` (dados de teste).

### API e banco

[![Static Badge](https://img.shields.io/badge/FastAPI-0cc2b6)](https://fastapi.tiangolo.com)
Framework da API, baseado nos type hints do Python. As rotas e a injeção de dependências são todas dele.

[![Static Badge](https://img.shields.io/badge/Pydantic-c22141)](https://docs.pydantic.dev/latest/)
Validação de dados (v2). Os schemas de request e response são classes Pydantic.

[![Static Badge](https://img.shields.io/badge/SQLModel-7c2ea3)](https://sqlmodel.tiangolo.com/)
ORM usado para definir as tabelas (`table=True`), construído sobre o SQLAlchemy e o Pydantic.

[![Static Badge](https://img.shields.io/badge/SQLAlchemy-edc309)](https://www.sqlalchemy.org/)
A ORM por baixo do SQLModel. Consultas mais elaboradas usam a API dele direto.

[![Static Badge](https://img.shields.io/badge/alembic-408080)](https://alembic.sqlalchemy.org/en/latest/)
Migrações do banco.

[![Static Badge](https://img.shields.io/badge/PostgreSQL-13%2B-1965c2)](https://www.postgresql.org/)
Banco relacional. A busca geral usa as extensões `pg_trgm` e `unaccent` e a busca textual do Postgres (veja [Busca geral](/dev/search/)), o que exige o PostgreSQL 13 ou superior para criar as extensões sem superusuário. O ambiente Docker usa o 16.

[![Static Badge](https://img.shields.io/badge/Redis-dc382d)](https://redis.io/docs/latest/)
Contadores do rate limit e cache das API keys. Opcional: sem ele, o rate limit fica desligado.

### Servidor e integrações

[![Static Badge](https://img.shields.io/badge/Uvicorn-499848)](https://www.uvicorn.org/)
[![Static Badge](https://img.shields.io/badge/Gunicorn-499848)](https://gunicorn.org/)
O Uvicorn serve a aplicação em desenvolvimento (`python wsgi.py`). Em produção, o Gunicorn gerencia vários workers Uvicorn.

[![Static Badge](https://img.shields.io/badge/Playwright-2ead33)](https://playwright.dev/python/)
Navegador headless (Chromium) usado pelo crawler que importa a grade do aluno do JupiterWeb.

[![Static Badge](https://img.shields.io/badge/BeautifulSoup-gray)](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
[![Static Badge](https://img.shields.io/badge/pandas-150458)](https://pandas.pydata.org/)
Scraping e leitura das páginas públicas do JupiterWeb e do Janus.

[![Static Badge](https://img.shields.io/badge/Jinja2-b41717)](https://jinja.palletsprojects.com/)
Templates dos e-mails.

[![Static Badge](https://img.shields.io/badge/python--decouple-gray)](https://github.com/HBNetwork/python-decouple)
Leitura das variáveis de ambiente (`.env` e `.env.<ambiente>`).

[![Static Badge](https://img.shields.io/badge/cryptography-gray)](https://cryptography.io/)
Cifra das API keys enquanto esperam ser reveladas pelo link de uso único.

## Frontend

### Linguagem e ferramentas

[![Static Badge](https://img.shields.io/badge/Node-20-1eeb25)](https://nodejs.org/pt)
Runtime de JavaScript usado para desenvolver e buildar. A versão 20 é a usada no Docker e no CI.

[![Static Badge](https://img.shields.io/badge/Yarn-4-291eeb)](https://yarnpkg.com/)
Gerenciador de pacotes, na versão 4 (Berry), com o binário versionado no próprio repositório.

[![Static Badge](https://img.shields.io/badge/Typescript-5-035afc)](https://www.typescriptlang.org/)
Linguagem do frontend, em modo estrito.

[![Static Badge](https://img.shields.io/badge/Vite-6-961eeb)](https://vite.dev/)
Servidor de desenvolvimento e build.

[![Static Badge](https://img.shields.io/badge/ESLint-24034f)](https://eslint.org/)
Analisador estático (flat config com typescript-eslint).

[![Static Badge](https://img.shields.io/badge/Prettier-4f2f03)](https://prettier.io/docs/)
Formatador de código.

[![Static Badge](https://img.shields.io/badge/Vitest-3.2.4-6e9f18)](https://vitest.dev/)
[![Static Badge](https://img.shields.io/badge/Testing%20Library-a10303)](https://testing-library.com/docs/)
Testes: o Vitest roda os testes (com jsdom), e a Testing Library renderiza e interage com os componentes.

### Bibliotecas da aplicação

[![Static Badge](https://img.shields.io/badge/React-18-408080)](https://react.dev/)
Biblioteca de interfaces. Usamos a versão 18.

[![Static Badge](https://img.shields.io/badge/React%20Router-6-ca4245)](https://reactrouter.com/)
Roteamento da SPA.

[![Static Badge](https://img.shields.io/badge/Chakra%20UI-v2-408080)](https://v2.chakra-ui.com/)
Biblioteca de componentes principal. Usamos a v2 (a v3 já existe, com outra API).

[![Static Badge](https://img.shields.io/badge/MUI-v7-007fff)](https://mui.com/)
Usado no shell do layout (menu lateral e barra superior) e nos seletores de data (`@mui/x-date-pickers`).

[![Static Badge](https://img.shields.io/badge/React%20Hook%20Form-7-ec5990)](https://react-hook-form.com/)
[![Static Badge](https://img.shields.io/badge/Yup-1-gray)](https://github.com/jquense/yup)
Formulários e validação.

[![Static Badge](https://img.shields.io/badge/Axios-1-5a29e4)](https://axios-http.com/)
Cliente HTTP.

[![Static Badge](https://img.shields.io/badge/FullCalendar-6-2c3e50)](https://fullcalendar.io/)
Calendários e grades de horário (Mapa de Salas).

[![Static Badge](https://img.shields.io/badge/TanStack%20Table-8-ff4154)](https://tanstack.com/table/v8)
Tabelas com ordenação, filtros e paginação.

[![Static Badge](https://img.shields.io/badge/Moment.js-gray)](https://momentjs.com/)
Datas, com o locale `pt-br`.

Outras bibliotecas com uso pontual: `react-joyride` (tours guiados), `@react-pdf/renderer` (PDFs do Mapa de Salas), `chakra-react-select` (selects múltiplos), `framer-motion` (animações), `react-dropzone` (upload de imagens) e `@react-oauth/google` (login).

## Infraestrutura

[![Static Badge](https://img.shields.io/badge/Docker-2496ed)](https://docs.docker.com/)
Cada repositório tem um `Dockerfile`, e o [USPolis-Admin](https://github.com/PCS-Poli-USP/USPolis-Admin) tem o Docker Compose que sobe o sistema inteiro (veja [Configurando seu Ambiente › Com Docker](/dev/enviroment/#com-docker)).

[![Static Badge](https://img.shields.io/badge/GitHub%20Actions-2088ff)](https://docs.github.com/actions)
Deploy automático a cada push na `main`, nos dois repositórios.

## Docs

[![Static Badge](https://img.shields.io/badge/VitePress-8A2BE2)](https://vitepress.dev/)
Gerador de sites estáticos (SSG), usado para gerar esta documentação a partir de arquivos markdown.

## Analytics

Ferramentas para entender como o sistema é usado e encontrar problemas. Como elas se encaixam está em [Logs, Grafana e Loki](/dev/observability/).

[![Static Badge](https://img.shields.io/badge/Grafana-f46800)](https://grafana.com/docs/grafana/latest/)
Plataforma de dashboards, onde ficam os painéis de acessos à API (requisições, erros, latência, rotas e usuários mais ativos), em `/analytics/`.

[![Static Badge](https://img.shields.io/badge/Loki-f2cc0c)](https://grafana.com/docs/loki/latest/)
Banco de logs da Grafana Labs, que guarda o log de acesso do backend por 30 dias e é consultado pelo Grafana com a linguagem LogQL.

[![Static Badge](https://img.shields.io/badge/Grafana%20Alloy-e5562a)](https://grafana.com/docs/alloy/latest/)
Coletor que lê o arquivo de log de acesso do backend, extrai os campos e envia ao Loki. Substituiu o Promtail.

[![Static Badge](https://img.shields.io/badge/Microsoft%20Clarity-0078d4)](https://learn.microsoft.com/clarity/)
Mapas de calor e gravações de sessão no frontend, para ver como as pessoas usam as telas. Só é ativado com `VITE_CLARITY_PROJECT_ID` configurado.
