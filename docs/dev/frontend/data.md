---
prev:
  text: 'Frontend › Rotas e controle de acesso'
  link: '/dev/frontend/routing'

next:
  text: 'Frontend › Formulários, componentes e tema'
  link: '/dev/frontend/forms-ui'
---

# Estado global e camada de API

## Estado global

O frontend não usa Redux, Zustand nem React Query. O estado global é só a Context API do React, em `src/context/`. Todo o resto (listas, formulários, filtros) é estado local das páginas e dos hooks de domínio.

### `appContext` (`src/context/AppContext.tsx`)

É o contexto da sessão. O objeto exportado se chama `appContext` (minúsculo) e o provider é o export default. Ele expõe:

| Membro | Para que serve |
|---|---|
| `loggedUser` | O usuário logado (`UserResponse`, com `is_admin`, `buildings`, grupos, papéis...), ou `null` |
| `isAuthenticated` / `setIsAuthenticated` | Se existe uma sessão válida |
| `getSelfFromBackend()` | Faz `GET /users` com o cookie e preenche `loggedUser`. É o que o `PersistLogin` e o `auth-callback` chamam |
| `logout()` | Chama `POST /auth/logout` e limpa o usuário |
| `loading` / `setLoading` | Carregamento do usuário (as guardas mostram a `LoadingPage` enquanto ele é `true`) |
| `persist` / `setPersist` | Se o `PersistLogin` deve tentar restaurar a sessão (padrão `true`) |
| `backendUnavailable` / `setBackendUnavailable` | Ligado pelo interceptor quando uma requisição nem chega a ter resposta (veja abaixo) |
| `isMobile` | `true` abaixo de 800 px (`useMediaQuery` do Chakra) |

Ao montar, o contexto apaga o `refresh_token` que versões antigas guardavam no `localStorage`. Quando o usuário é carregado, `getSelfFromBackend()` também o identifica no Clarity (só o id e o tipo de usuário).

### `uiContext` (`src/context/UIContext.tsx`)

Estado da interface: `isOpenMenu`, `onOpenMenu` e `onCloseMenu` para o menu lateral, e `view` (`UIViewType.MOBILE` abaixo de 768 px, `TABLET` abaixo de 1024 px, `DESKTOP` acima), com os atalhos `isMobile`, `isTablet` e `isDesktop`. É usado pelo layout `EmptyPage` e por páginas que mudam de forma conforme o tamanho da tela.

> [!NOTE]
> Existem dois `isMobile` com breakpoints diferentes: o do `appContext` (800 px) e o do `uiContext` (768 px). Em código novo, prefira o do `uiContext`.

### `FeatureGuideContext` (`src/context/FeatureGuideContext/`)

Controla o **tour guiado** do react-joyride. É um tour único e global, com os passos definidos em `utils.tsx` (`createSteps()` e os índices em `FG_STEP_INDEXES`) e os tipos em `steps.tsx`. O `<Joyride>` é renderizado pelo layout `EmptyPage`, e o tour é iniciado pelo botão da barra superior (`drawer.navbar.tsx`).

Há um segundo sistema, menor, para avisos de **novidades**: os componentes em `components/common/NewsJoyride/` com o hook `hooks/useNewsJoyride`, que guarda no `localStorage` a última novidade já vista.

## Camada de API

Componentes e páginas não chamam o axios diretamente. O acesso ao backend passa por quatro camadas:

```text
models/http/{requests,responses}      tipos que espelham a API
        ↓
hooks/API/services/use<Recurso>Service.ts     só HTTP
        ↓
hooks/<domínio>/use<Domínio>.ts       estado + toasts + ErrorParser
        ↓
página / componente
```

### 1. Modelos HTTP

`src/models/http/requests/<recurso>.request.models.ts` e `src/models/http/responses/<recurso>.response.models.ts` são interfaces TypeScript que espelham os schemas de request e response do backend (`server/models/http/` no backend). Respostas paginadas usam `PaginatedResponse<T>` (`paginated.response.models.ts`), e os tipos de erro do axios ficam em `common.response.models.ts`.

Esses tipos são escritos à mão. Quando um schema muda no backend, o modelo correspondente precisa ser atualizado aqui também.

### 2. Hook de serviço

`src/hooks/API/services/use<Recurso>Service.ts` é um hook **fino**, só de HTTP: ele devolve funções que fazem uma requisição e retornam a `Promise<AxiosResponse<T>>`, sem estado, sem toast e sem tratamento de erro. Exemplo (`useBuildingsService.ts`):

```ts
const useBuildingsService = () => {
  const axios = useAxiosPrivate();

  const getAll = (): Promise<AxiosResponse<Array<BuildingResponse>>> => {
    return axios.get('/buildings');
  };

  const create = (data: CreateBuilding): Promise<AxiosResponse<BuildingResponse>> => {
    return axios.post('/admin/buildings', data);
  };

  return { getAll, create /* , update, deleteById, ... */ };
};

export default useBuildingsService;
```

As URLs são relativas ao `VITE_USPOLIS_API_ENDPOINT` e seguem os prefixos de cada tier do backend (rotas de admin começam com `/admin`; veja [Backend › Rotas e tiers](/dev/backend/routes)).

### 3. Hook de domínio

`src/hooks/<domínio>/use<Domínio>.ts` envolve o hook de serviço e é o que as páginas realmente usam. Ele guarda o estado (`loading`, a lista carregada), mostra os toasts de sucesso e erro com `useCustomToast` e traduz o erro do backend com um `ErrorParser`:

```ts
const useClassrooms = (initialFetch: boolean = true) => {
  const service = useClassroomsService();
  const [loading, setLoading] = useState(false);
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const parser = new ClassroomErrorParser();
  const showToast = useCustomToast();

  const getClassrooms = useCallback(async () => {
    setLoading(true);
    await service
      .getMine()
      .then((response) => setClassrooms(response.data.sort(sortClassroomResponse)))
      .catch((error) => showToast('Erro', parser.parseGetError(error), 'error'))
      .finally(() => setLoading(false));
  }, [showToast, service]);

  // ... create, update, delete: mostram um toast de sucesso e recarregam a lista
};
```

O `ErrorParser` (`src/hooks/errorParser.ts`) é uma classe base que recebe o nome do modelo em português e monta mensagens como `Erro ao criar Sala: <detail do backend>`. Cada domínio tem a sua subclasse, que pode sobrescrever as mensagens:

```ts
export class ClassroomErrorParser extends ErrorParser {
  constructor() {
    super('Sala');
  }
}
```

Os hooks de domínio mais antigos ficam soltos na raiz de `src/hooks/` (`useBuildings.ts` + `buildingErrorParser.ts`), e os mais novos em uma pasta por domínio (`hooks/classrooms/useClassrooms.ts` + `classroomErrorParser.ts`). Em código novo, use a pasta.

Para listagens paginadas, o hook de domínio usa `usePaginatedResponse<T>()` (`src/hooks/API/usePaginatedResponse.ts`), que guarda a `PaginatedResponse<T>` atual (`page`, `page_size`, `total_items`, `total_pages`, `data`). Veja `hooks/solicitations/useSolicitations.ts` como exemplo.

Algumas páginas simples chamam o hook de serviço direto, sem hook de domínio. Isso é aceitável quando não há estado para compartilhar, mas aí a página precisa tratar o erro e o toast por conta própria.

### 4. Página

A página chama o hook de domínio, passa os dados para a tabela e os modais e chama as funções de criar/atualizar/remover a partir das ações do usuário.

## As duas instâncias do axios

`src/services/api/axios.ts` exporta:

- o **default**, uma instância pública sem credenciais. É usada por endpoints públicos que não precisam de sessão, como a busca (`useSearchService`), as consultas públicas de reservas (`useReservationsService` usa as duas instâncias) e a página de API key (`useApiKeyLinksService`);
- `axiosPrivate`, com `withCredentials: true`, para que o navegador envie o cookie `session`. Ela não é importada diretamente: os hooks de serviço a obtêm via `useAxiosPrivate()`.

Ambas usam `VITE_USPOLIS_API_ENDPOINT` como `baseURL`. O `AuthHttpService` (`src/services/auth/auth.service.ts`) cria uma terceira instância, só para `/auth`.

## Autenticação e sessão

A autenticação é feita **só pelo cookie httpOnly `session`** que o backend define. Nenhum token fica no JavaScript nem no `localStorage`, e as requisições não levam o header `Authorization`.

1. O usuário clica em "Entrar" na página `/auth`, que chama `useGoogleLogin({ flow: 'auth-code' })` do `@react-oauth/google`.
2. O Google redireciona para `/auth-callback?code=...` (o `VITE_REDIRECT_URI`).
3. O `auth-callback` chama `GET /auth/get-tokens?auth_code=...` com `withCredentials`. O backend troca o código no Google e responde com `Set-Cookie: session` (httpOnly).
4. O `auth-callback` chama `getSelfFromBackend()` (`GET /users`), que preenche o `loggedUser`.
5. O usuário é levado para `/public/allocations`.

Ao recarregar a página, o `PersistLogin` chama `getSelfFromBackend()` de novo: como o cookie é enviado automaticamente, isso funciona até numa aba nova. O ciclo de vida do cookie (renovação deslizante de 30 dias, teto de 90) está em [Backend › Autenticação e permissões](/dev/backend/auth).

### O interceptor (`src/hooks/API/axios/useAxiosPrivate.ts`)

`useAxiosPrivate()` instala um **interceptor de resposta** na `axiosPrivate` e o remove quando o componente desmonta. Ele faz duas coisas:

- **401 com usuário logado:** a sessão expirou ou foi revogada. Mostra o toast "Sessão expirada" e chama `logout()`. Como todo hook de serviço instala o mesmo interceptor, uma flag na requisição (`_sessionExpiredHandled`) garante que só o primeiro reaja.
- **Nenhuma resposta** (certificado inválido, DNS, conexão recusada): liga `backendUnavailable`, para que telas que coletam dados sensíveis possam se desabilitar. Isso não acontece com `VITE_ENVIROMENT=development`, porque os certificados autoassinados do dev fariam toda requisição parecer uma falha de rede.

### CSRF e origem

Requisições que alteram dados (não-GET) vindas de uma página fora do `ALLOWED_ORIGINS` do backend são recusadas. Por isso o frontend precisa ser servido de uma origem que esteja nessa lista, inclusive em desenvolvimento (por exemplo, `https://localhost:3000`). Se você acessar o frontend por um IP da rede local, adicione esse endereço ao `ALLOWED_ORIGINS` do backend.
