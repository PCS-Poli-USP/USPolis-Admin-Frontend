---
prev:
  text: 'Backend'
  link: '/dev/backend'

next:
  text: 'Banco de Dados'
  link: '/dev/database'
---

# Frontend

Para a lista de tecnologias utilizadas veja [Tecnologias Utilizadas](/dev/stack#frontend). Aqui vamos focar em como o código está organizado e nas convenções que seguimos.

## Roteamento e controle de acesso

As rotas ficam centralizadas em `src/AppRoutes.tsx`, e são organizadas em uma cadeia de rotas de layout/guarda:

- `AxiosInterceptorRoute` — conecta o interceptor do axios para a sessão atual
- `PersistLogin` — tenta restaurar a sessão de login ao carregar a página (via cookie de sessão e/ou refresh token)
- `PrivateRoute` — exige que o usuário esteja autenticado
- `RestrictedRoute` / `AdminRoute` — exigem permissões adicionais (funcionário/admin)

Os grupos principais de rotas são: `public/*` (sem autenticação), `profile/*` (autenticado), `oferings/*` + `dates/*` + `scheduling/*` (restrito) e `admin/*` (apenas admin).

## Estado global

Não usamos Redux nem Zustand, apenas Context API do próprio React (`src/context/`):

- `AppContext` — estado de autenticação (`loggedUser`, `accessToken`, `isAuthenticated`), loading global, `logout` e `isMobile`
- `MenuContext` — estado da UI do menu lateral
- `FeatureGuideContext` — tours guiados de onboarding (usa a lib `react-joyride`)

## Camada de API

Os componentes nunca chamam o axios diretamente. O padrão para cada recurso do backend é sempre o mesmo, em três partes:

1. **Modelos**: `src/models/http/requests/<recurso>.request.models.ts` e `.../responses/<recurso>.response.models.ts` — tipos que espelham o formato esperado pela API
2. **Hook de serviço**: `src/hooks/API/services/use<Recurso>Service.ts` — um hook que retorna as funções de CRUD/consulta (`get`, `getById`, `create`, `update`, `deleteById`, ...), construído em cima do `useAxiosPrivate()` (uma instância autenticada do axios) ou da instância pública em `src/services/api/axios.ts`
3. **Consumidores**: as páginas/componentes chamam o hook de serviço, gerenciam seu próprio `useState`/`useEffect` ao redor dele, e usam `usePaginatedResponse<T>()` para endpoints de listagem paginados

Ao adicionar um novo recurso do backend, siga sempre esse mesmo padrão (modelos → hook de serviço → página consumidora) em vez de chamar o axios diretamente.

`src/services/auth/auth.service.ts` cuida do login/logout/refresh de token; `src/routes/axiosInterceptor.route.tsx` e `src/routes/persistLogin.route.tsx` conectam a renovação de token ao axios.

## Páginas e módulos de funcionalidades

Cada rota mapeia para uma pasta em `src/pages/<funcionalidade>/`. As funcionalidades maiores seguem uma estrutura interna parecida, por exemplo `src/pages/classes/`:

- `<funcionalidade>.tsx` / `index.tsx` — página principal (tabela + toolbar + modais)
- `Tables/` — definições de tabela usando `@tanstack/react-table`
- `<Nome>Modal/` — um modal de criar/editar, geralmente dividido em um wizard com Formik em `Steps/First`, `Steps/Second`, etc., onde cada passo tem seu próprio `.form.ts` (schema Yup + valores padrão), `.interface.ts` (tipos do formulário) e `.tsx` (campos)
- Validações de domínio ficam em `src/utils/<funcionalidade>/<funcionalidade>.validator.ts` e são reaproveitadas tanto pelos schemas Yup quanto por checagens inline

As páginas "hub" (`adminHub`, `oferingsHub`, `dateHub`, `schedulingHub`, `publicHub`) são páginas de entrada/menu que linkam para um grupo de páginas relacionadas.

## Blocos compartilhados

- `src/components/common/` — UI reaproveitável, com destaque para o kit de formulário reexportado em `form/` (`Input`, `SelectInput`, `MultiSelectInput`, `CheckBox`, `ListInput`, `NumberInput`, `SwitchInput`, `RadioButton`, `TextareaInput`), feito para ser usado dentro de formulários Formik
- `src/components/allocation/` — widgets de alocação/calendário compartilhados entre as páginas relacionadas a alocação
- `src/utils/enums/` — enums em TS que espelham os enums do backend (tipos de turma, dias da semana, recorrência, tipos de conflito, tipos de permissão, etc.) — prefira esses enums a strings soltas
- `src/utils/<domínio>/` — helpers e validadores por domínio (espelha as pastas de `pages/`/`hooks/`: prédios, turmas, salas, reservas, solicitações, calendários, disciplinas, usuários, etc.)
- `src/utils/theme.ts` — tema do Chakra (`chakraTheme`, tokens de cor customizados `uspolis.*` com variantes claro/escuro) e o tema do MUI (`muiTheme`)
- `src/utils/tanstackTableHelpers/` — helpers de coluna/tabela compartilhados para o `@tanstack/react-table`
- `src/models/interfaces/` — interfaces TS transversais (ex: `modalProps.ts` para o contrato comum de `isOpen`/`onClose` de modais)

## Convenções

- A nomenclatura de arquivos mistura `kebab.case.ts` e `camelCase` dependendo da profundidade da pasta — siga a convenção já usada nos arquivos irmãos daquele diretório
- Modais normalmente seguem o contrato compartilhado `isOpen`/`onClose` (veja `src/models/interfaces/modalProps.ts`)
- Formulários em múltiplos passos sempre separam **schema/valores padrão** (`*.form.ts`), **tipos** (`*.interface.ts`) e **marcação** (`*.tsx`) em arquivos separados por passo
- Todos os textos visíveis ao usuário estão em português (pt-BR); o `moment` é configurado com o locale `pt-br`
- TypeScript em modo estrito (`strict`, `noUnusedLocals`, `noUnusedParameters`); os erros do ESLint são rebaixados para warnings, então rode o lint manualmente antes de abrir um PR — o build não falha por causa deles

## Modo dark

O app tem suporte a modo escuro via `useColorMode` do Chakra. Um detalhe importante: os tokens semânticos `uspolis.*` (ex: `uspolis.black`, `uspolis.white`) **trocam de valor** entre os modos claro/escuro (`uspolis.black` vira branco no modo escuro, por exemplo). Se você precisa de uma cor de fundo ou texto que deve **sempre** parecer igual independente do tema (ex: um bloco de código com fundo sempre escuro), use um valor hexadecimal fixo em vez do token semântico — usar o token nesse caso inverte as cores no modo escuro.
