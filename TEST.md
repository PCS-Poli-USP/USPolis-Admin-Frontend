# Testes no USPolis Admin Frontend

Este documento descreve a infraestrutura de testes recomendada para o projeto: o que instalar, como organizar os arquivos, que tipo de teste escrever para cada camada da aplicação e como isso se encaixa no `CLAUDE.md` e no pipeline de CI existente.

> **Status:** o runner (Vitest), o lint de testes e um teste de exemplo já estão configurados e funcionando (`yarn test`). O que falta é ampliar a cobertura e adicionar MSW/Playwright — ver seção 7.

`@testing-library/react`, `@testing-library/jest-dom` e `@testing-library/user-event` já estavam em `devDependencies` antes deste trabalho, e `src/setupTests.ts` já importava `@testing-library/jest-dom`, mas não havia test runner configurado nem script `test` no `package.json`. Isso já foi resolvido: Vitest + `jsdom` + `@vitest/coverage-v8` foram instalados, `eslint-plugin-testing-library`/`eslint-plugin-jest-dom` também, e os scripts `test`/`test:watch`/`test:coverage` existem no `package.json`.

## 1. Ferramentas recomendadas

| Camada | Ferramenta | Por quê |
|---|---|---|
| Test runner + unit/integração | **Vitest** (instalado, pinado em `3.2.4`) | O projeto já usa Vite; Vitest reaproveita `vite.config.mts` (aliases, plugins, env), roda em ESM nativo e é muito mais rápido que Jest, sem precisar de Babel/ts-jest separado |
| Renderização de componentes | **@testing-library/react** (já instalado) | Testa o componente do ponto de vista do usuário (o que aparece na tela / o que é clicável), não detalhes de implementação |
| Interação de usuário | **@testing-library/user-event** (já instalado) | Simula eventos reais de forma mais fiel que `fireEvent` (foco, digitação, etc.) |
| Matchers de DOM | **@testing-library/jest-dom** (já instalado) | `toBeInTheDocument`, `toHaveTextContent`, etc. — já importado em `src/setupTests.ts` |
| Mock de API HTTP | **MSW (Mock Service Worker)** | Intercepta as chamadas `axios` no nível de rede, então os hooks de `src/hooks/API/services/` e `src/services/` são testados sem mockar cada função manualmente |
| E2E (fluxos críticos) | **Playwright** | Cobre login, criação de reserva/alocação, fluxo de agendamento etc. fim-a-fim, incluindo o roteamento com `PrivateRoute`/`AdminRoute` |
| Lint específico de teste | **eslint-plugin-testing-library** + **eslint-plugin-jest-dom** (instalados) | Evita antipadrões comuns (`getBy` onde deveria ser `findBy`, assert direto no DOM em vez de matcher do jest-dom, etc.) |

Não é necessário migrar nada existente — é só preencher a lacuna entre o que já está instalado e um runner funcional.

## 2. Setup inicial (já aplicado)

```bash
yarn add -D vitest jsdom @vitest/coverage-v8 eslint-plugin-testing-library eslint-plugin-jest-dom
```

`@vitejs/plugin-react` e o MSW não entraram aqui: o primeiro já estava instalado, o segundo é só necessário a partir da seção 4.3 (mock de API) e ainda não foi adicionado.

### 2.1 Configuração do Vitest

`vite.config.ts` foi renomeado para **`vite.config.mts`** e o import de `defineConfig` passou a vir de `vitest/config` (que reexporta o `defineConfig` do Vite já tipado com o bloco `test`), em vez de `vite`. Isso foi necessário, não só estético: com `package.json` sem `"type": "module"`, o Vite tentava carregar a config como CommonJS, e uma dependência ESM-only do Vitest (`std-env`) quebrava o `require()`. A extensão `.mts` força o carregamento como ESM nativo e resolve isso sem precisar adicionar `"type": "module"` ao `package.json` (o que quebraria `.prettierrc.js`, que usa `module.exports`).

```ts
// vite.config.mts
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
// ...
const isTest = process.env.VITEST === 'true';
// ...
plugins: [
  react(),
  ...(isTest ? [] : [eslintPlugin({ failOnError: false, failOnWarning: false })]),
],
// ...
test: {
  environment: 'jsdom',
  setupFiles: ['./src/setupTests.ts'],
  css: true,
  exclude: ['node_modules', 'build', 'e2e'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    exclude: ['src/main.tsx', 'src/**/*.d.ts', 'src/**/*.interface.ts'],
  },
},
```

`globals: true` **não** foi habilitado de propósito — os exemplos abaixo importam `describe`/`it`/`expect` explicitamente de `'vitest'`, o que evita mexer no `tsconfig.json` (habilitar globals exigiria adicionar `"types": ["vitest/globals"]`) e deixa mais explícito de onde cada helper vem.

`vite-plugin-eslint` (que roda o ESLint durante `dev`/`build`) agora é **desativado quando `process.env.VITEST` está setado** (`isTest` acima) — sem isso, cada teste imprimia os warnings de lint do arquivo importado no meio da saída do Vitest.

`src/setupTests.ts` foi ajustado para importar `@testing-library/jest-dom/vitest` em vez de `@testing-library/jest-dom` puro — esse é o subpath que a própria lib disponibiliza para estender o `expect` do Vitest corretamente (o import "puro" é pensado para o `expect` global do Jest).

> **Pin de versões:** `@vitest/coverage-v8`/`vitest` foram fixados em `3.2.4` porque a `5.0.1` exige `vite@^6.4.0` e o projeto está em `vite@^6.3.1` — com a 5.x, os testes falhavam ao carregar a config (`assetsInclude` incompatível) antes mesmo de rodar. `jsdom` foi fixado em `25.0.1` porque a versão mais recente (`30.x`) trouxe uma dependência transitiva (`@exodus/bytes`, via `html-encoding-sniffer`) que também é ESM-only e quebra o worker do Vitest no mesmo cenário de CJS/ESM. Se o `vite` do projeto for atualizado para `^6.4`+ no futuro, vale revisitar esse pin.

### 2.2 Scripts (`package.json`, já adicionados)

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

`test:ui` (`vitest --ui`) e `test:e2e` (`playwright test`) ainda não foram adicionados — dependem de `@vitest/ui` e do Playwright, que entram só quando a seção 4.5 for implementada.

### 2.3 CI

O único workflow hoje (`.github/workflows/ci_cd.yml`) só faz deploy em push para `main`, sem gate de qualidade em PR. Recomendo um segundo workflow (ex.: `.github/workflows/ci.yml`) disparado em `pull_request`, rodando `yarn lint`, `yarn test:coverage` e `yarn build` — assim testes quebrados bloqueiam merge antes de chegar em produção.

## 3. Onde colocar os arquivos de teste

Seguindo a convenção já usada no repo (arquivos co-localizados por feature, ex. `<feature>.form.ts` + `<feature>.interface.ts` + `<feature>.tsx` dentro da mesma pasta — ver `CLAUDE.md`), o mais consistente é **co-localizar os testes ao lado do arquivo testado**, em vez de uma pasta `__tests__/` central:

```
src/utils/classrooms/classrooms.validator.ts
src/utils/classrooms/classrooms.validator.test.ts

src/hooks/API/services/useSchedulesService.ts
src/hooks/API/services/useSchedulesService.test.ts

src/pages/classes/classes.tsx
src/pages/classes/classes.test.tsx

src/components/common/form/Input/index.tsx
src/components/common/form/Input/Input.test.tsx
```

Regra prática: `<nome-original>.test.ts(x)`, mantendo o mesmo estilo de nomenclatura (kebab-case ou camelCase) já usado pelo arquivo irmão que está sendo testado, conforme a convenção descrita no `CLAUDE.md`.

Testes de E2E (Playwright) ficam fora de `src/`, em `e2e/` na raiz, já que não são "unidade de código" e sim fluxos de usuário através do app inteiro.

## 4. O que testar em cada camada (pirâmide de testes)

### 4.1 Base — funções puras (`src/utils/**`)

Maior volume, mais barato e mais estável. Cobre principalmente `src/utils/<domain>/<domain>.validator.ts` (ex.: `classrooms.validator.ts`, `schedules.validator.ts`, `exam.validator.ts`) e helpers em `src/utils/tanstackTableHelpers/`. São funções sem DOM/React, então rodam em `node`/`jsdom` sem overhead de render:

```ts
// src/utils/classrooms/classrooms.validator.test.ts
import { describe, it, expect } from 'vitest';
import { isValidClassroomCapacity } from './classrooms.validator';

describe('isValidClassroomCapacity', () => {
  it('rejeita capacidade menor ou igual a zero', () => {
    expect(isValidClassroomCapacity(0)).toBe(false);
  });
});
```

Como esses validators também alimentam os schemas Yup usados nos formulários (ver `CLAUDE.md`, seção "Pages & feature modules"), testar aqui cobre indiretamente boa parte da validação de formulário sem precisar montar o formulário inteiro.

### 4.2 Componentes isolados (`src/components/common/`)

Os componentes de `src/components/common/form/` (`Input`, `SelectInput`, `MultiSelectInput`, `CheckBox`, `ListInput`, `NumberInput`, `SwitchInput`, `RadioButton`, `TextareaInput`) são o kit reutilizado em todos os formulários Formik do sistema — o melhor ponto de alavancagem: testar bem esses componentes uma vez cobre indiretamente dezenas de telas.

Como eles dependem de Chakra UI e, em alguns casos, do contexto do Formik, use um `render` utilitário próprio (ver seção 5) em vez do `render` puro do RTL.

```tsx
// src/components/common/form/Input/Input.test.tsx
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from 'src/test/renderWithProviders';
import { Input } from './index';

describe('Input', () => {
  it('exibe a mensagem de erro quando o campo é tocado e inválido', async () => {
    renderWithProviders(<Input name="email" label="E-mail" />, {
      formikInitialValues: { email: '' },
    });

    await userEvent.click(screen.getByLabelText('E-mail'));
    await userEvent.tab();

    expect(await screen.findByText(/campo obrigatório/i)).toBeInTheDocument();
  });
});
```

### 4.3 Hooks de API (`src/hooks/API/services/`)

Não teste mockando `axios` diretamente linha a linha — isso acopla o teste aos detalhes do Axios. Prefira **MSW**: ele intercepta a requisição HTTP real que o hook dispara, então o teste continua válido mesmo se a implementação trocar de `axios` para `fetch` no futuro.

```ts
// src/test/msw/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get(`${import.meta.env.VITE_USPOLIS_API_ENDPOINT}/classrooms`, () =>
    HttpResponse.json([{ id: 1, name: 'Sala 101' }]),
  ),
];
```

```ts
// src/hooks/API/services/useClassroomsService.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useClassroomsService } from './useClassroomsService';

it('busca as salas cadastradas', async () => {
  const { result } = renderHook(() => useClassroomsService());
  const classrooms = await result.current.get();
  expect(classrooms).toHaveLength(1);
});
```

Configure o servidor MSW uma vez em `src/setupTests.ts` (`beforeAll`/`afterEach`/`afterAll`).

### 4.4 Páginas / fluxos com Formik (`src/pages/<feature>/`)

Aqui o objetivo é testar o comportamento visível: abrir modal, preencher passos do wizard (`Steps/First`, `Steps/Second`, ...), submeter e verificar que a chamada de API certa foi feita e o feedback (toast/mensagem) apareceu. Não teste estado interno do Formik diretamente — interaja como um usuário faria, via `userEvent` e queries de `screen`.

Para páginas que dependem de `AppContext` (usuário autenticado, `isMobile`) ou de rotas (`react-router`), sempre use o `renderWithProviders` da seção 5 — nunca o `render` cru do Testing Library, senão cada teste reimplementa os mesmos providers manualmente.

### 4.5 E2E (Playwright)

Reservado para os fluxos que atravessam autenticação + roteamento + API real (ou um ambiente de staging), por exemplo:
- Login e redirecionamento conforme papel (`PrivateRoute`/`AdminRoute`/`RestrictedRoute`)
- Criar uma solicitação de sala e acompanhar o status em "Minhas Solicitações"
- Alocar uma turma em um horário e verificar conflito de agendamento

Poucos testes, alto valor — não tente cobrir cada tela em E2E; isso é papel das camadas 4.1–4.4.

## 5. Utilitário de render compartilhado

Como `ChakraProvider` e o `ThemeProvider` do MUI envolvem o app inteiro em `src/main.tsx` (ver `CLAUDE.md`), e várias páginas dependem de `AppContext`/`MenuContext`/rotas, crie um `render` próprio em vez de importar `render` do RTL em cada teste:

```tsx
// src/test/renderWithProviders.tsx
import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { Formik } from 'formik';
import { chakraTheme, muiTheme } from 'src/utils/theme';
import { AppContext } from 'src/context/AppContext';

export function renderWithProviders(
  ui: ReactElement,
  { formikInitialValues, route = '/', ...contextOverrides }: RenderOptions = {},
) {
  const wrapped = formikInitialValues ? (
    <Formik initialValues={formikInitialValues} onSubmit={() => {}}>
      {ui}
    </Formik>
  ) : (
    ui
  );

  return render(
    <MemoryRouter initialEntries={[route]}>
      <ChakraProvider theme={chakraTheme}>
        <ThemeProvider theme={muiTheme}>
          <AppContext.Provider value={{ ...defaultAppContext, ...contextOverrides }}>
            {wrapped}
          </AppContext.Provider>
        </ThemeProvider>
      </ChakraProvider>
    </MemoryRouter>,
  );
}
```

Isso mantém cada teste focado no comportamento, sem repetir a árvore de providers.

## 6. Boas práticas específicas de React/RTL

- **Query por comportamento visível ao usuário, não por implementação**: prefira `getByRole`, `getByLabelText`, `getByText` a `getByTestId`; use `data-testid` só como último recurso, quando não há um jeito acessível de selecionar o elemento.
- **`userEvent` em vez de `fireEvent`** para qualquer interação (clique, digitação, tab) — dispara os eventos na mesma ordem que um navegador real.
- **`findBy*`/`waitFor` para tudo que é assíncrono** (requisição via MSW, `useEffect` que busca dados) — nunca `setTimeout`/`sleep` artificial no teste.
- **Não testar detalhe de implementação** (estado interno de hook, nome de função privada) — teste o que aparece na tela e o que é enviado para a API.
- **Um `describe` por componente/hook/função, `it` descrevendo comportamento em português**, consistente com o restante do código do produto sendo em pt-BR (ver `CLAUDE.md`).
- **Resetar mocks/handlers do MSW entre testes** (`server.resetHandlers()` em `afterEach`) para evitar vazamento de estado entre casos.
- **Evitar `act()` manual** — RTL e `userEvent` já envolvem as interações em `act` internamente; precisar de `act()` manual geralmente indica um teste mal desenhado.
- **Cobertura como guia, não meta absoluta**: comece medindo (`test:coverage`) para achar áreas sem nenhum teste (validators e formulários críticos primeiro), sem perseguir 100%.

## 7. Ordem sugerida de adoção

1. ✅ Configurar Vitest + `test`/`test:watch`/`test:coverage`, rodando `src/setupTests.ts` (ajustado para `@testing-library/jest-dom/vitest`) e o lint de testes (`eslint-plugin-testing-library`/`eslint-plugin-jest-dom`).
2. 🔜 Escrever testes para `src/utils/<domain>/<domain>.validator.ts` (maior ROI, zero setup de providers) — há um primeiro exemplo real em [`src/utils/classrooms/classrooms.validator.test.ts`](src/utils/classrooms/classrooms.validator.test.ts); falta cobrir os demais domínios.
3. Criar `renderWithProviders` (seção 5) e cobrir os componentes de `src/components/common/form/`.
4. Introduzir MSW e cobrir 1–2 hooks de `src/hooks/API/services/` como referência para o time replicar.
5. Adicionar o workflow de CI em `pull_request` rodando lint + testes + build.
6. Só então avaliar Playwright para os 3–5 fluxos mais críticos do produto.

## 8. Referências para estudo

**Testing Library / RTL**
- [Documentação oficial do Testing Library](https://testing-library.com/docs/)
- [React Testing Library — guia oficial](https://testing-library.com/docs/react-testing-library/intro/)
- Kent C. Dodds — [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- Kent C. Dodds — [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)
- [Guia de queries do Testing Library](https://testing-library.com/docs/queries/about/#priority) (ordem de prioridade das queries)

**Vitest**
- [Documentação oficial do Vitest](https://vitest.dev/guide/)
- [Vitest — integração com Vite](https://vitest.dev/guide/why.html)

**Mock de API**
- [Mock Service Worker (MSW) — documentação](https://mswjs.io/docs/)
- [MSW + React Testing Library](https://mswjs.io/docs/integrations/node)

**Formik / formulários**
- [Formik — Testing](https://formik.org/docs/guides/testing)

**E2E**
- [Playwright — documentação oficial](https://playwright.dev/docs/intro)
- [Playwright — Best Practices](https://playwright.dev/docs/best-practices)

**Filosofia geral de testes de frontend**
- Martin Fowler — [Testing Pyramid / Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html)
- Kent C. Dodds — [The Testing Trophy and Testing Classifications](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [React — Testing overview (react.dev)](https://react.dev/learn/testing)

**Lint específico de testes**
- [eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library)
- [eslint-plugin-jest-dom](https://github.com/testing-library/eslint-plugin-jest-dom)
