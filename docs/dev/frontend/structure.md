---
prev:
  text: 'Frontend › Visão geral'
  link: '/dev/frontend/'

next:
  text: 'Frontend › Rotas e controle de acesso'
  link: '/dev/frontend/routing'
---

# Estrutura de arquivos

Esta página descreve o repositório do frontend pasta por pasta. O frontend organiza o código **por funcionalidade** dentro de `src/pages/`, e o que é compartilhado entre funcionalidades fica em `components/`, `hooks/`, `models/` e `utils/`. O backend faz o contrário e organiza por camada, veja [Backend › Estrutura de arquivos](/dev/backend/structure).

## Raiz do repositório

```bash
USPolis-Admin-Frontend/
├── index.html            # entrada real do Vite (lang="pt-BR"), carrega /src/main.tsx
├── vite.config.mts       # dev server, HTTPS, build e bloco `test` do Vitest
├── tsconfig.json         # strict, noUnusedLocals, noUnusedParameters, sem aliases de import
├── eslint.config.mjs     # flat config (typescript-eslint, react, react-hooks, testing-library); erros viram warnings
├── .prettierrc.js        # aspas simples (inclusive em JSX), trailing comma, 80 colunas
├── package.json          # scripts e dependências; "packageManager": "yarn@4.9.2"
├── .yarnrc.yml           # Yarn 4 com nodeLinker: node-modules
├── .yarn/releases/       # binário do Yarn versionado no repo (qualquer yarn global delega para ele)
├── env.example           # variáveis VITE_* (sem ponto no nome do arquivo)
├── Dockerfile            # estágios base, dev (yarn dev), build (docs + app) e prod (serve -s build)
├── docker/               # entrypoint.sh (gera certs/ em dev) e README.md das imagens
├── .github/workflows/
│   └── ci_cd.yml         # deploy a cada push na main (veja Configurando seu Ambiente › CI/CD)
├── deploy.sh             # deploy manual legado (build + scp)
├── statistics.sh         # conta linhas de código e de docs
├── TEST.md               # infraestrutura de testes, versões fixadas e plano de cobertura
├── CHANGELOG_FRONTEND.md
├── public/               # copiado como está para o build (favicon, manifest, robots.txt)
│   └── docs/             # gerado: a docs buildada vai para cá antes do build do app (no .gitignore)
├── docs/                 # esta documentação (VitePress, base /docs/)
├── certs/                # cert.pem e key.pem do HTTPS local (no .gitignore)
└── src/                  # o código da aplicação
```

Os arquivos `.env`, `.env.development` e `.env.production` são locais e estão no `.gitignore`. Veja quais variáveis existem em [Configurando seu Ambiente › Frontend](/dev/enviroment/#frontend).

## `src/`

```bash
src/
├── main.tsx              # providers (veja Visão geral) e inicialização do Clarity
├── AppRoutes.tsx         # todas as rotas da aplicação
├── setupTests.ts         # setup do Vitest (jest-dom, cleanup, stub de matchMedia)
├── vite-env.d.ts         # tipos do import.meta.env
├── assets/               # imagens importadas pelo código (logo)
├── test/                 # utilitários de teste (renderWithProviders.tsx)
├── routes/               # rotas de layout/guarda (<nome>.route.tsx)
├── context/              # AppContext, UIContext, FeatureGuideContext/
├── services/             # código que não é hook
│   ├── api/axios.ts      #   as duas instâncias do axios (pública e com credenciais)
│   ├── auth/             #   AuthHttpService: troca do código do Google pelo cookie e logout
│   └── analytics/        #   clarity.ts e grafana.ts
├── hooks/                # hooks compartilhados (veja abaixo)
├── models/
│   ├── http/requests/    # <recurso>.request.models.ts: corpo das requisições
│   ├── http/responses/   # <recurso>.response.models.ts: respostas (inclui paginated e common)
│   └── interfaces/       # modalProps.ts (contrato isOpen/onClose) e serverResponses.ts
├── utils/                # helpers puros, sem React (veja abaixo)
├── components/
│   ├── common/           # UI reaproveitável (veja abaixo)
│   └── allocation/       # datePicker.modal.tsx, usado só pelo calendário do Mapa de Salas
└── pages/                # uma pasta por funcionalidade (veja a tabela abaixo)
```

`App.css`, `index.css`, `reportWebVitals.ts` e `react-app-env.d.ts` são sobras da época em que o projeto usava Create React App.

### `src/hooks/`

```bash
hooks/
├── API/
│   ├── axios/useAxiosPrivate.ts   # instala o interceptor de resposta e devolve a instância com credenciais
│   ├── services/                  # use<Recurso>Service.ts: um hook fino por recurso do backend, só HTTP
│   └── usePaginatedResponse.ts    # estado de uma PaginatedResponse<T>
├── errorParser.ts                 # classe base ErrorParser: monta as mensagens de erro em pt-BR
├── <domínio>/                     # hooks de domínio "novos": use<Domínio>.ts + <domínio>ErrorParser.ts
│                                  #   (classes, classrooms, reservations, solicitations, users, roles, ...)
├── use<Domínio>.ts                # hooks de domínio "antigos", soltos na raiz (useBuildings, useCalendars, ...)
├── <domínio>ErrorParser.ts        # parsers dos hooks antigos (buildingErrorParser, calendarErrorParser, ...)
├── search/useGeneralSearch.ts     # busca geral com debounce e cancelamento (veja Busca geral)
├── useCustomToast.tsx             # toast padrão do app (canto superior esquerdo, 5 s)
├── useAllowedBuildings.ts         # prédios em que o usuário logado pode atuar
├── useDrawerState.ts              # booleano persistido no localStorage (drawer_<chave>)
├── useNewsJoyride/                # controla o aviso de "novidades"
└── useOnFocusMobile/              # mantém o campo focado visível acima do teclado no celular
```

Hooks de serviço e hooks de domínio são camadas diferentes, explicadas em [Estado global e camada de API](/dev/frontend/data#camada-de-api). Ao criar um hook de domínio novo, use o formato de pasta (`hooks/<domínio>/`).

### `src/utils/`

```bash
utils/
├── theme.ts                # chakraTheme e muiTheme (veja Formulários, componentes e tema)
├── enums/                  # <nome>.enum.ts: enums que espelham os do backend
├── tanstackTableHelpers/   # tableFiltersFns.ts e tableSortingFns.ts
├── common/                 # conflito de horários, gerador de recorrência, CommonValidator
├── types/generics.ts       # MakeOptional, Without, XOR, XORN
├── hash/string.hash.ts     # cor estável a partir de uma string
├── location/               # isAdminRoute()
├── filters.ts, formatters.ts  # helpers genéricos de string
└── <domínio>/              # <domínio>.validator.ts, .sorter.ts, .formatter.ts, .mapper.ts...
                            #   (buildings, classes, classrooms, reservations, schedules, search, ...)
```

### `src/components/common/`

| Pasta | O que é |
|---|---|
| `EmptyPage/` | Shell do layout: barra superior, menu lateral, tour e "Fale conosco" (veja [Visão geral](/dev/frontend/#como-a-aplicacao-sobe)) |
| `form/` | Kit de campos para react-hook-form (veja [Formulários](/dev/frontend/forms-ui#kit-de-formulario)). É reexportado por `components/common/index.ts` |
| `DataTable/` | Tabela genérica sobre o `@tanstack/react-table`, usada pelas pastas `Tables/` das páginas |
| `PageContent/`, `PageHeader/`, `PageHeaderWithFilter/`, `PageBreadcrumb/` | Moldura padrão de uma página (conteúdo, título, filtro de período, breadcrumb) |
| `HubPageGrid/` | Grade de cards usada pelas páginas hub |
| `ClassroomCalendar/`, `ClassroomTimeGrid/`, `DateCalendarPicker/`, `AllocationOptionsModal/` | Widgets de calendário e alocação compartilhados (FullCalendar e MUI DateCalendar) |
| `ContactUsModal/` | Formulários de feedback e de relato de bug |
| `NewsJoyride/` | Tours curtos de "novidades" (docs, fale conosco) |
| `ErrorBoundary/`, `LoadingPage/`, `Loading/` | Tela de erro, carregamento de página inteira e indicadores de carregamento |
| `Dialog/`, `FloatingWindow/`, `Collapsable/`, `HelpPopover/`, `TooltipSelect/`, `PaginationDisplay/` | Componentes genéricos de UI |
| `ProfileButton/`, `UserImage/` | Avatar e menu do usuário |
| `Animation/` | Animações de dica (framer-motion) |

## `src/pages/`: funcionalidades e rotas

Cada pasta em `src/pages/` corresponde a uma ou mais rotas de `src/AppRoutes.tsx`. A coluna "Acesso" usa os nomes das guardas descritas em [Rotas e controle de acesso](/dev/frontend/routing).

| Pasta | Rota(s) | Acesso |
|---|---|---|
| `auth/` | `/auth`, `/auth-callback` | fora da cadeia de guardas |
| `apiKeyLink/` | `/api-key/:linkId` | fora da cadeia de guardas |
| `home/` | `/index` (`/` redireciona para cá) | sessão restaurada, fora do layout |
| `print/` | `/print/classroom-calendar` | sessão restaurada, fora do layout |
| `publicHub/` | `/public` | público |
| `allocation/` | `/public/allocations` (Mapa de Salas) | público |
| `findClasses/` | `/public/find-classes` | público |
| `findExams/` | `/public/find-exams` | público |
| `profile/` | `/profile` | `PrivateRoute` |
| `timetable/` | `/profile/timetable` | `PrivateRoute` |
| `mySolicitations/` | `/profile/solicitations` | `PrivateRoute` |
| `oferingsHub/` | `/oferings` | `RestrictedRoute` |
| `classrooms/` | `/oferings/classrooms` | `RestrictedRoute` |
| `subjects/` | `/oferings/subjects` | `RestrictedRoute` |
| `classes/` | `/oferings/classes` | `RestrictedRoute` |
| `calendars/` | `/oferings/calendars` | `RestrictedRoute` |
| `conflicts/` | `/oferings/conflicts` | `RestrictedRoute` |
| `occupationReports/` | `/oferings/reports` | `RestrictedRoute` |
| `dateHub/` | `/dates` | `RestrictedRoute` |
| `schedulingHub/` | `/scheduling` | `RestrictedRoute` |
| `reservations/` | `/scheduling/reservations` | `RestrictedRoute` |
| `solicitations/` | `/scheduling/solicitations` | `RestrictedRoute` |
| `adminHub/` | `/admin` | `AdminRoute` |
| `users/` | `/admin/users` | `AdminRoute` |
| `userSessions/` | `/admin/sessions` | `AdminRoute` |
| `roles/` | `/admin/roles` | `AdminRoute` |
| `groups/` | `/admin/groups` | `AdminRoute` |
| `buildings/` | `/admin/buildings` | `AdminRoute` |
| `reports/` | `/admin/bug-reports` | `AdminRoute` |
| `feedbacks/` | `/admin/feedbacks` | `AdminRoute` |
| `institutionalEvents/` | `/admin/institutional-events` | `AdminRoute` |
| `courses/` | `/admin/courses` | `AdminRoute` |
| `curriculums/` | `/admin/courses/:courseId/curriculums` | `AdminRoute` |
| `curriculumSubjects/` | `/admin/courses/:courseId/curriculums/:curriculumId/subjects` | `AdminRoute` |
| `apiStatus/` | `/admin/api-status` | `AdminRoute` |
| `searchLogs/` | `/admin/search-logs` ([registro de buscas](/dev/search/#registro-de-buscas)) | `AdminRoute` |
| `apiClients/` | `/admin/api-clients`, `/admin/api-clients/:clientId`, `/admin/api-clients/:clientId/keys/:keyId` | `AdminRoute` |
| `serverDocs/` | `/admin/server-docs` | `AdminRoute` |
| `tests/` | `/admin/tests` (força erros de propósito, para testar o tratamento de erro) | `AdminRoute` |
| `page404/` | `*` | dentro do layout |
| `page401/`, `pageError/` | sem rota própria: renderizadas pelas guardas e pelo `ErrorBoundary` | — |

A rota `/loading-page` aponta para `components/common/LoadingPage`, não para uma pasta de `pages/`.

### Anatomia de uma pasta de funcionalidade

As funcionalidades maiores seguem a mesma forma. Usando `src/pages/classrooms/` como exemplo:

```bash
classrooms/
├── classrooms.tsx                    # página: toolbar + tabela + modais, busca os dados pelos hooks de domínio
├── Tables/
│   └── classroom.tables.tsx          # colunas do @tanstack/react-table, renderizadas pelo DataTable
├── ClassroomModal/                   # modal de criar/editar
│   ├── classroom.modal.tsx           #   marcação, useForm + FormProvider
│   ├── classroom.modal.form.ts       #   schema Yup + valores padrão
│   └── classroom.modal.interface.ts  #   props do modal e tipo do formulário
└── ClassroomPermission/              # subcomponentes específicos da página
```

Modais com várias etapas têm uma pasta `Steps/` com uma subpasta por etapa (`First/`, `Second/`, ...), cada uma com o mesmo trio `.form.ts`/`.interface.ts`/`.tsx`. Veja `src/pages/classes/ClassModal/` e os detalhes em [Formulários](/dev/frontend/forms-ui#formularios-em-varias-etapas).

## Convenções de nome

O repositório tem convenções de épocas diferentes. **Siga a convenção dos arquivos vizinhos** da pasta que você está editando, sem introduzir uma terceira.

| O quê | Convenção | Exemplo |
|---|---|---|
| Pasta de funcionalidade | camelCase | `pages/institutionalEvents/` |
| Subpasta dentro de uma página ou de `components/common` | PascalCase | `ClassModal/`, `Tables/`, `Steps/First/` |
| Arquivo de página | `<funcionalidade>.tsx`, às vezes com um `index.tsx` que só reexporta; hubs e páginas mais novas usam direto `index.tsx` | `classes/classes.tsx` |
| Arquivos antigos dentro de uma página | minúsculas separadas por ponto | `class.modal.steps.first.form.ts`, `building.tables.tsx` |
| Arquivos mais novos | PascalCase ou camelCase, mantendo os sufixos | `roles/RoleModal/RoleModal.tsx`, `apiClients/IssueKeyModal/issueKeyModal.tsx` |
| Sufixos | `.form.ts` (schema), `.interface.ts` (tipos), `.table.tsx`, `.modal.tsx`, `.test.ts(x)` | |
| Componente de `components/common` | `index.tsx` ou `<nome>.component.tsx` | `DataTable/dataTable.component.tsx` |
| Hook de serviço | `hooks/API/services/use<Recurso>Service.ts`, export default | `useClassroomsService.ts` |
| Hook de domínio | `hooks/<domínio>/use<Domínio>.ts` + `<domínio>ErrorParser.ts` | `hooks/classrooms/useClassrooms.ts` |
| Modelos HTTP | `<recurso>.request.models.ts` / `<recurso>.response.models.ts` | `classroom.response.models.ts` |
| Utilitários de domínio | `utils/<domínio>/<domínio>.<papel>.ts` | `utils/classrooms/classrooms.validator.ts` |
| Enums | `utils/enums/<nome>.enum.ts` | `weekDays.enum.ts` |
| Rotas de guarda | `routes/<nome>.route.tsx` | `restricted.route.tsx` |

Exports: páginas, modais e hooks usam `export default`. Os campos do kit de formulário usam named export (`export function Input`).

Existem alguns nomes com erro de digitação que já são importados em vários lugares (`useSubjetcts.ts`, `calendar.responde.models.ts`, `resevations.validator.ts`, `clasrooms.enum.ts`). Não os corrija de passagem num PR de outra coisa: renomear exige atualizar todos os imports.
