---
prev:
  text: 'Frontend › Estrutura de arquivos'
  link: '/dev/frontend/structure'

next:
  text: 'Frontend › Estado global e camada de API'
  link: '/dev/frontend/data'
---

# Rotas e controle de acesso

Todas as rotas ficam em `src/AppRoutes.tsx`, com React Router v6. O controle de acesso não é feito página a página: ele vem de **rotas de layout** (sem `path` próprio, ou com o `path` do grupo) que envolvem grupos de rotas e decidem se renderizam o `<Outlet />` ou outra coisa. Essas rotas ficam em `src/routes/`.

## Como as rotas se aninham

```text
<Routes>
├── /auth, /auth-callback, /loading-page, /api-key/:linkId     (fora de tudo)
└── AxiosInterceptorRoute
    └── PersistLogin
        ├── /print/classroom-calendar, /index                  (sem layout)
        └── EmptyPage                                          (layout)
            ├── public/*  e  *  (404)
            └── PrivateRoute
                ├── profile, profile/timetable, profile/solicitations
                ├── RestrictedRoute
                │   └── oferings/*, dates, scheduling/*
                └── admin  (AdminRoute)
                    └── admin/*
```

Na prática, isso significa:

- **Fora de tudo** ficam as telas de login (`/auth`, `/auth-callback`), a `/loading-page` e a `/api-key/:linkId`, a página em que um parceiro sem conta revela a [API key](/api-keys/). Elas não restauram a sessão nem instalam o interceptor.
- **Com sessão restaurada, mas sem layout** ficam a home (`/index`, para onde `/` redireciona) e a página de impressão do calendário (`/print/classroom-calendar`).
- **Todo o resto** é renderizado dentro do layout `EmptyPage`, inclusive a página 404 (`path='*'`).

## As guardas

| Rota (arquivo) | O que verifica | Se falhar |
|---|---|---|
| `AxiosInterceptorRoute` (`axiosInterceptor.route.tsx`) | Nada. Só chama `useAxiosPrivate()` para instalar o interceptor antes do `PersistLogin` fazer a primeira requisição | — |
| `PersistLogin` (`persistLogin.route.tsx`) | Se `persist` está ligado e o usuário ainda não está autenticado, chama `getSelfFromBackend()` (que faz `GET /users` com o cookie) e mostra a `LoadingPage` enquanto espera | Segue sem usuário: um 401 só quer dizer "não está logado" |
| `PrivateRoute` (`private.route.tsx`) | `isAuthenticated` | Redireciona para `/auth`, guardando a rota original em `state.from` |
| `RestrictedRoute` (`restricted.route.tsx`) | `hasRestrictedAccess(loggedUser)`: o usuário é admin, tem pelo menos um prédio (`loggedUser.buildings`) **ou** tem algum papel (`loggedUser.role_ids`) | Renderiza a `Page401` no lugar (não redireciona) |
| `AdminRoute` (`admin.route.tsx`) | `loggedUser.is_admin` | Renderiza a `Page401` no lugar |

`RestrictedRoute` e `AdminRoute` mostram a `LoadingPage` enquanto o usuário ainda está sendo carregado, para não piscar a `Page401` num refresh.

Depois do login, o `auth-callback` sempre leva o usuário para `/public/allocations`. O `state.from` guardado pelo `PrivateRoute` hoje não é usado para voltar à página original.

> [!IMPORTANT]
> As guardas só controlam **o que aparece na tela**. Quem garante a segurança é o backend: cada rota da API tem seu nível de acesso e suas checagens de permissão (veja [Backend › Autenticação e permissões](/dev/backend/auth)). Nunca dependa só de uma guarda do frontend para proteger um dado.

### O critério do `RestrictedRoute`

O critério fica num lugar só, `hasRestrictedAccess` (`src/utils/users/users.formatter.ts`), usado pelo `RestrictedRoute`, pela seção restrita do menu lateral (`drawer.body.tsx`) e pelo `UsersValidator.checkUserRestrictedPermission`. Ele espelha o gate do tier `restricted` do backend, que aceita quem é admin, pertence a um **grupo** ou tem um **papel** (veja [Backend › Autenticação e permissões](/dev/backend/auth#os-gates-de-cada-tier)). Do lado do frontend, o grupo aparece como os prédios do usuário, e o papel como `role_ids`. Se você mexer no critério, mude os dois lados juntos.

## Pulando o login em desenvolvimento

Duas variáveis de ambiente (veja [Configurando seu Ambiente › Frontend](/dev/enviroment/#frontend)) existem só para facilitar o desenvolvimento local:

- `VITE_OVERRIDE_AUTH='true'`: o `PrivateRoute` deixa passar mesmo sem usuário autenticado. **Ela não afeta o `RestrictedRoute` nem o `AdminRoute`**, que continuam exigindo um `loggedUser` de verdade. Para ver as páginas restritas e de admin sem configurar o Google, use o `OVERRIDE_AUTH` do backend, que faz toda requisição ser autenticada como um usuário fixo.
- `VITE_OVERRIDE_PERSIST_LOGIN='true'`: o `PersistLogin` não consulta o backend ao carregar a página.

Nenhuma das duas deve estar ligada em produção.

## Páginas hub

As páginas hub são páginas de entrada que mostram uma grade de cards (`components/common/HubPageGrid`), cada card navegando para uma página do grupo:

| Hub | Rota | Cards |
|---|---|---|
| `publicHub` | `/public` | Busque no USPolis, Mapa de Salas |
| `oferingsHub` | `/oferings` | Salas, Disciplinas, Turmas, Calendários, Conflitos, Relatórios |
| `schedulingHub` | `/scheduling` | Reservas, Solicitações |
| `adminHub` | `/admin` | as páginas de admin, mais um card "Analytics (Grafana)" que abre o Grafana em outra aba (veja [Observabilidade](/dev/observability/)) |
| `dateHub` | `/dates` | Calendários (leva a `/oferings/calendars`) |

O `dateHub` não tem link no menu lateral: só se chega a ele pela URL.

## Onde a navegação é definida

Criar uma rota no `AppRoutes.tsx` não a coloca no menu. Os links do menu lateral ficam em `src/components/common/EmptyPage/drawer.body.tsx`, separados por seção (perfil, oferecimentos, agendamento, admin), e os cards de cada hub ficam no `index.tsx` do próprio hub. Ao criar uma página, atualize os três lugares quando fizer sentido (veja [Como adicionar uma funcionalidade](/dev/frontend/new-feature)).
