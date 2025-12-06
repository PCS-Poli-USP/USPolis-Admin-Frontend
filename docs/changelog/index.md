# Changelog

Categorias: <span style="color: green">FEATURE</span>, <span style="color: #408080">IMPROVEMENT</span>, <span style="color: orange">BUGFIX</span>, <span style="color: red">HOTFIX</span>, <span style="color: gray">DOCS</span>

O changelog começou a ser registrado a partir do dia 15/11/2025.

## 2025

Aqui estão todas as principais mudanças realizadas no USPolis em 2025.

### API - 05/12/2025

<span style="color: #408080">IMPROVEMENT</span>

PR's: [#131](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/131) e [#144](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/144)

**Descrição:**

- Melhorias no desempenho das rotas de usuários e grupos, agora existe um response core para usuários
- Ajustes na tabela de salas

### Docs - 03/12/2025

<span style="color: #408080">IMPROVEMENT</span>

PR's: [#129](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/129)

**Descrição:**

- Melhorias na docs de dev, adição uma seção de deploy, arquivos, tecnologias e mais

### Docs - 29/11/2025

<span style="color: green">FEATURE</span>

PR's: [#125](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/125) e [#143](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/143)

**Descrição:**

- Criação dessa docs que você está vendo!
- Melhorias na página "Encontre suas aulas"
- Melhorias na página "Encontre suas provas"

### Correção de bug - 26/11/2025

<span style="color: orange">BUGFIX</span>

PR's: [#142](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/142)

**Descrição:**

- Correção de bug na rota do relatório de ocupação, para agendas sem dia da semana

### Relatórios de Ocupação - 24/11/2025

<span style="color: green">FEATURE</span>

PR's: [#115](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/115) e [#140](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/140)

**Descrição:**

- Página "Relatórios" com relatórios de taxa de ocupação das salas dos prédios

### Melhorias - 22/11/2025

<span style="color: #408080">IMPROVEMENT</span>

PR's: [#113](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/113) [#114](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/114)

**Descrição:**

- Melhorias na criação de reservas para dispositivos mobile
- Correção da Navbar para dispositivos desktop

### Correção de bug - 21/11/2025

<span style="color: orange">BUGFIX</span>

PR's: [#111](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/111)

**Descrição:**

- Correção de bug onde a criação de reservas pelo Mapa de Salas não estava corretamente preenchendo o formulário.
- Remoção de código antigo que não é mais utilizado.
- Agora uma combinação inválida da agenda está mostrando o erro.

### Correção de bug - 18/11/2025

<span style="color: red">HOTFIX</span>

PR's: [#110](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/110) e [#137](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/137)

**Descrição:**

- Correção de bug de autenticação para usuários novos, agora são corretamente criados.
- Remoção de loop na página de redirecionamento que constantemente tentava autenticar o usuário, agora ele tenta apenas uma vez.

### Correção de bug - 15/11/2025

<span style="color: orange">BUGFIX</span>

PR's: [#106](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/106)

**Descrição:**

- Correção do tamanho do Navbar para usuários mobile, limitando para 100vw.
- Agora o beacon de novas funcionalidades funciona corretamente para celulares.

### Fale Conosco - 15/11/2025

<span style="color: green">FEATURE</span>

PR's: [#105](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/105) e [#132](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/132)

**Descrição:**

- Criação da funcionalidade "Fale Conosco", onde os usuários podem mandar mensagens (feedbacks) ou reportar problemas (bugs) pelo próprio sistema do USPolis.
