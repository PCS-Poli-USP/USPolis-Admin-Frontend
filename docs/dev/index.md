---
next:
  text: 'Tecnologias Utilizadas'
  link: '/dev/stack'
---

# Documentação para Desenvolvedores

> [!IMPORTANT]
> Essa documentação é técnica e é destinada para **desenvolvedores**.
> Não encontrou uma explicação para a sua dúvida? Fale conosco através de **uspolis@usp.br**

Com o objetivo de auxiliar os futuros desenvolvedores e espalhar o conhecimento, decidimos criar essa documentação. Ela descreve como o USPolis é construído: os repositórios, como o código está organizado, as convenções que seguimos e o passo a passo para as tarefas mais comuns.

## Os repositórios

| Repositório | O que tem |
|---|---|
| [USPolis-Admin-Backend](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend) | A API em FastAPI, os models do banco e as migrações |
| [USPolis-Admin-Frontend](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend) | A SPA em React e esta documentação (pasta `docs/`) |
| [USPolis-Admin](https://github.com/PCS-Poli-USP/USPolis-Admin) | Junta os dois como submódulos e tem o `docker-compose.yml` que sobe o sistema inteiro, inclusive Grafana e Loki |

## Por onde começar

Recomendamos ler na ordem do menu à esquerda:

1. [Tecnologias Utilizadas](/dev/stack) e [Arquitetura](/dev/architecture): o panorama geral.
2. [Configurando seu Ambiente](/dev/enviroment/): como subir tudo na sua máquina, com Docker ou manualmente, e como funciona o deploy.
3. **Backend**, a partir da [Visão geral](/dev/backend/):
   - [Estrutura de arquivos](/dev/backend/structure) e [Rotas e tiers](/dev/backend/routes)
   - [Fluxo de uma requisição](/dev/backend/request-flow) e [Autenticação e permissões](/dev/backend/auth)
   - [Serviços e integrações](/dev/backend/services), [Configuração](/dev/backend/config) e [Testes, lint e tipos](/dev/backend/testing)
   - [Como adicionar um recurso](/dev/backend/new-resource)
4. **Frontend**, a partir da [Visão geral](/dev/frontend/):
   - [Estrutura de arquivos](/dev/frontend/structure) e [Rotas e controle de acesso](/dev/frontend/routing)
   - [Estado global e camada de API](/dev/frontend/data) e [Formulários, componentes e tema](/dev/frontend/forms-ui)
   - [Testes](/dev/frontend/testing) e [Como adicionar uma funcionalidade](/dev/frontend/new-feature)
5. [Banco de Dados](/dev/database/): tabelas, migrações e backup.
6. [Logs, Grafana e Loki](/dev/observability/) e [Busca geral](/dev/search/): subsistemas com página própria.

Se você só quer criar uma funcionalidade nova de ponta a ponta, vá direto para [Backend › Como adicionar um recurso](/dev/backend/new-resource): ela continua em [Frontend › Como adicionar uma funcionalidade](/dev/frontend/new-feature).

## Mantendo esta documentação

Esta referência descreve o código como ele é. Se você mudar algo que ela descreve (uma camada nova, uma variável de ambiente, uma convenção), atualize a página correspondente no mesmo PR. As páginas ficam em `docs/dev/` no repositório do frontend, e a sidebar em `docs/.vitepress/config.ts`.
