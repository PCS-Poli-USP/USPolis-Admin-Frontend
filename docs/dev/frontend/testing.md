---
prev:
  text: 'Frontend › Formulários, componentes e tema'
  link: '/dev/frontend/forms-ui'

next:
  text: 'Frontend › Como adicionar uma funcionalidade'
  link: '/dev/frontend/new-feature'
---

# Testes

Os testes do frontend rodam no **Vitest** com **jsdom** e **Testing Library**. A cobertura ainda é pequena. O [`TEST.md`](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/blob/main/TEST.md) na raiz do repositório tem o plano para ampliá-la (o que testar em cada camada e em que ordem); esta página descreve o que já existe.

## Ferramentas e versões

| Pacote | Versão | Observação |
|---|---|---|
| `vitest` e `@vitest/coverage-v8` | `3.2.4` (fixa) | As duas precisam estar na mesma versão |
| `jsdom` | `25.0.1` (fixa) | Ambiente de DOM dos testes |
| `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`, `@testing-library/jest-dom` | | Renderização, interação e matchers como `toBeInTheDocument()` |

O motivo de cada versão fixa está no `TEST.md`. Não atualize esses pacotes isoladamente.

## Configuração

O bloco `test` do `vite.config.mts` define:

- `environment: 'jsdom'` e `css: true`;
- `setupFiles: ['./src/setupTests.ts']`;
- cobertura com o provider `v8`, relatórios `text` e `html`, ignorando `src/main.tsx`, os `*.d.ts` e os `*.interface.ts`.

O Vitest roda **sem `globals`**: importe `describe`, `it`, `expect` e `vi` de `'vitest'` em cada arquivo.

`src/setupTests.ts`:

- registra os matchers do jest-dom (`@testing-library/jest-dom/vitest`);
- chama `cleanup()` depois de cada teste. Sem `globals`, a Testing Library não consegue registrar essa limpeza sozinha;
- cria um `window.matchMedia` falso (sempre "não casa"), porque o jsdom não tem `matchMedia` e o `useMediaQuery` do Chakra o usa.

## Onde ficam os testes

Ao lado do código que testam, com o sufixo `.test.ts` ou `.test.tsx`:

| Arquivo | Tipo |
|---|---|
| `src/utils/classrooms/classrooms.validator.test.ts` | Função pura (validador) |
| `src/utils/search/search.formatter.test.ts` | Função pura (formatador) |
| `src/pages/search/search.test.tsx` | Página inteira, com o hook de serviço mockado |

## Renderizando com os providers

Componentes do app esperam o Chakra, o MUI, o router e o `appContext` em volta. `src/test/renderWithProviders.tsx` monta essa árvore (um `MemoryRouter` + `ChakraProvider` + `ThemeProvider` do MUI + `appContext.Provider`) e aceita:

- `route`: a URL inicial do `MemoryRouter` (caminho e query string);
- `appContextValue`: valores do `appContext` que o teste quer sobrescrever (por exemplo, um `loggedUser`);
- `formDefaultValues`: envolve o componente num `FormProvider` do react-hook-form com esses valores iniciais, para testar campos do kit de formulário, que leem o contexto com `useFormContext`.

```tsx
renderWithProviders(<GeneralSearch />, { route: '/public/search?q=calculo' });

renderWithProviders(<Input name='name' label='Nome' />, {
  formDefaultValues: { name: 'Sala 1' },
});
```

Quando o teste precisa do objeto do formulário (para chamar `trigger`, `setError` ou ler valores), crie o `useForm` no próprio teste e envolva o componente num `FormProvider`, como em `TEST.md`, seção 4.2.

## Mockando o backend

Não há MSW: os testes mockam o **hook de serviço** (ou o hook de domínio) com `vi.mock`, e controlam as respostas pelas funções mockadas. Exemplo de `search.test.tsx`:

```ts
// Objetos estáveis: os efeitos da página dependem dessas referências.
const service = { search: vi.fn(), getDocument: vi.fn() };
vi.mock('../../hooks/API/services/useSearchService', () => ({
  default: () => service,
}));

beforeEach(() => {
  service.search.mockResolvedValue({ data: response }); // um SearchResponse de exemplo
});
```

Devolva sempre o **mesmo objeto** do hook mockado (não um objeto novo a cada chamada): se o objeto mudar a cada render, os `useEffect`/`useCallback` que dependem dele disparam em loop.

## Comandos

```bash
yarn test               # roda tudo uma vez (vitest run)
yarn test:watch         # modo watch
yarn test:coverage      # com cobertura; o relatório HTML fica em coverage/
yarn test src/utils     # só os testes de um caminho
```

Com o ambiente Docker, rode dentro do container do frontend:

```bash
docker exec uspolis-admin-frontend-1 sh -c 'cd /app/frontend && yarn test'
```

> [!NOTE]
> O CI do frontend ainda não roda os testes (nem o lint, nem a checagem de tipos): ele só faz o deploy. Rode-os localmente antes de abrir um PR.
