---
prev:
  text: 'Backend › Como adicionar um recurso'
  link: '/dev/backend/new-resource'

next:
  text: 'Frontend › Estrutura de arquivos'
  link: '/dev/frontend/structure'
---

# Frontend

O frontend do USPolis é uma SPA em **React 18 + TypeScript**, construída com **Vite** e servida estaticamente. A interface usa o **Chakra UI v2** como biblioteca principal de componentes e o **MUI v7** em pontos específicos (o shell do layout e os seletores de data). Todo o código fica no repositório [USPolis-Admin-Frontend](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend), em `src/`. Esta documentação fica no mesmo repositório, em `docs/`.

Para a lista completa de bibliotecas e versões veja [Tecnologias Utilizadas](/dev/stack#frontend). Para subir o projeto, veja [Configurando seu Ambiente](/dev/enviroment/#frontend).

## Mapa desta seção

| Página | O que você encontra |
|---|---|
| [Estrutura de arquivos](/dev/frontend/structure) | A árvore completa do repositório e de `src/`, a tabela de páginas e rotas, e as convenções de nome |
| [Rotas e controle de acesso](/dev/frontend/routing) | Como as rotas se aninham, o que cada guarda verifica e as variáveis que pulam o login em desenvolvimento |
| [Estado global e camada de API](/dev/frontend/data) | Os contextos, as quatro camadas de acesso ao backend, o login e o tratamento de sessão expirada |
| [Formulários, componentes e tema](/dev/frontend/forms-ui) | react-hook-form + Yup, o kit de formulário, tabelas, calendários, tema e modo escuro |
| [Testes](/dev/frontend/testing) | Vitest, Testing Library e o helper de renderização |
| [Como adicionar uma funcionalidade](/dev/frontend/new-feature) | O passo a passo de ponta a ponta, do modelo HTTP ao link no menu |

## Como a aplicação sobe

O ponto de entrada é o `index.html` da raiz, que carrega `src/main.tsx`. Esse arquivo inicializa o [Microsoft Clarity](/dev/stack#analytics) (só se `VITE_CLARITY_PROJECT_ID` estiver configurado) e monta a árvore de providers, de fora para dentro:

```tsx
<ThemeProvider theme={muiTheme}>            // MUI (tema e modo escuro do MUI)
  <ChakraProvider theme={chakraTheme}>      // Chakra (tema principal)
    <GoogleOAuthProvider clientId={...}>    // login com Google
      <AppContextProvider>                  // usuário logado, sessão, loading
        <UIContextProvider>                 // menu lateral e breakpoint
          <LocalizationProvider adapterLocale='pt-br'>  // datas do MUI com moment
            <FeatureGuideProvider>          // tour guiado (react-joyride)
              <BrowserRouter>
                <ErrorBoundary>
                  <AppRoutes />             // src/AppRoutes.tsx
```

Os contextos estão descritos em [Estado global e camada de API](/dev/frontend/data), e as rotas em [Rotas e controle de acesso](/dev/frontend/routing).

Quase todas as páginas são renderizadas dentro de `src/components/common/EmptyPage/`, que é o **shell do layout**: a barra superior (`drawer.navbar.tsx`, com o botão de tema e o início do tour), o menu lateral (`drawer.body.tsx`, onde ficam os links de navegação), o modal "Fale conosco", o tour do react-joyride e um `ErrorBoundary` em volta do `<Outlet />`. Apesar do nome, ele não é uma "página vazia": é o layout de todas as rotas filhas de `/`.

## Configuração do Vite

`vite.config.mts` na raiz do projeto. A extensão `.mts` força o carregamento como ESM nativo, necessário porque o Vitest depende de pacotes ESM-only e o `package.json` não define `"type": "module"`.

- `server.port = 3000` e `server.host = true` (escuta em todas as interfaces, não só `localhost`).
- HTTPS é ligado **apenas quando `VITE_ENVIROMENT=development`**, lendo `certs/cert.pem` e `certs/key.pem`. Nesse modo, se os arquivos não existirem o servidor não sobe. Com outros valores de `VITE_ENVIROMENT` ele sobe em HTTP puro. No Docker, o `docker/entrypoint.sh` gera os certificados sozinho.
- `build.outDir = 'build'`: é essa pasta que o CI/CD copia para o servidor (veja [Configurando seu Ambiente › CI/CD](/dev/enviroment/#o-que-o-ci-cd-faz-de-verdade)).
- Não há aliases de import (`@/...`): todos os imports são relativos.
- O plugin `vite-plugin-eslint` roda o ESLint durante o dev server com `failOnError: false` e `failOnWarning: false`. Erros de lint aparecem no terminal, mas **nunca** derrubam o servidor nem o build. Ele é desligado quando `VITEST` está definido, para não poluir a saída dos testes.
- O bloco `test` configura o Vitest (veja [Testes](/dev/frontend/testing)).

> [!WARNING]
> O `yarn build` é só `vite build`: ele **não** roda o `tsc` nem o ESLint, e o CI também não. Um erro de tipo ou de lint não impede o deploy. Rode `yarn lint` e a checagem de tipos (`npx tsc --noEmit`) antes de abrir um PR.
