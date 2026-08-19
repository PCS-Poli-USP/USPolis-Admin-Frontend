# Changelog

Categorias: <span style="color: green">FEATURE</span>, <span style="color: #408080">IMPROVEMENT</span>, <span style="color: orange">BUGFIX</span>, <span style="color: red">HOTFIX</span>, <span style="color: #347aeb">DOCS</span>

O changelog começou a ser registrado a partir do dia 15/11/2025.

## 2026

### Documentação interna do servidor movida para área administrativa - 18/08/2026

<span style="color: green">FEATURE</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Nova página `/admin/server-docs`, restrita a administradores, com a documentação de infraestrutura (arquitetura, arquivos do servidor, deploy e CI/CD), incluindo árvores de diretório colapsáveis com botão de copiar caminho
- Remoção da seção "Servidor" da documentação pública, que continha informações sensíveis do servidor de produção (caminhos de arquivos, serviços, segredos de deploy)
- Novas páginas de documentação técnica sobre a organização do código do Backend e do Frontend

### Pré-visualização de PDF de alocação de disciplinas - 13/08/2026

<span style="color: green">FEATURE</span>, <span style="color: #408080">IMPROVEMENT</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- O modal de PDF de "Alocação das Disciplinas" agora mostra uma pré-visualização ao vivo do conteúdo, com navegação entre as páginas
- Nova coluna "Prédio" na tabela de alocação de disciplinas do PDF
- Rodapé com a marca do USPolis adicionado ao PDF e à pré-visualização
- Correção de contraste no menu de download de PDFs (texto ficava ilegível ao passar o mouse)
- Ajustes de layout no modal de PDF (largura, campos de data que ficavam cortados)

### Correção de conflito de horário ao editar reserva - 13/08/2026

<span style="color: orange">BUGFIX</span>, <span style="color: #408080">IMPROVEMENT</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Corrigido bug onde editar uma reserva já alocada mostrava um conflito de horário com ela mesma
- Calendário de disponibilidade de sala não duplica mais os eventos da própria reserva sendo editada, e agora abre sempre na semana atual
- Datas e horários solicitados agora aparecem como cartões agrupados por mês (com o dia da semana em destaque) no calendário de disponibilidade, em vez de uma única linha de texto
- Correção do calendário de seleção de data na tela de Alocação, que cortava os anos ímpares ao abrir a seleção de ano

### Persistência de sessão entre abas do navegador - 13/08/2026

<span style="color: orange">BUGFIX</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Corrigido bug onde abrir uma nova aba do navegador (já logado) pedia login novamente, mesmo com uma sessão válida

### Correções na alocação, conflitos de horário e importação da grade - XX/XX/2026

<span style="color: orange">BUGFIX</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Correção na tela de Alocação para abrir sempre no dia atual, ao invés da semana inteira
- Ações de editar/excluir uma reserva pelo calendário de alocação agora só ficam disponíveis para quem tem permissão sobre o prédio da reserva (administradores ou usuários vinculados ao prédio)
- Correção na verificação de conflito de horário das salas (evita falsos conflitos/negativos ao comparar horários que apenas se tocam nas bordas)
- Detecção de indisponibilidade do backend (ex: certificado expirado) na tela de Grade Horária, desabilitando temporariamente a importação pelo JúpiterWeb com um aviso ao usuário, ao invés de falhar silenciosamente

### Página de erro e tratamento de falhas inesperadas - XX/XX/2026

<span style="color: green">FEATURE</span>, <span style="color: #408080">IMPROVEMENT</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Criação de uma página de erro para falhas inesperadas de renderização, com opção de recarregar a página, voltar ao início, enviar feedback sobre o erro ou contatar o suporte por e-mail
- Adição de um `ErrorBoundary` para capturar erros de renderização e evitar que o usuário fique com a tela em branco
- O `ErrorBoundary` agora envolve apenas a área de conteúdo das páginas (dentro do layout principal), então um erro numa página mantém o cabeçalho e o menu lateral visíveis, ao invés de substituir a tela inteira
- Adição de uma página de testes (`/admin/tests`) para disparar erros manualmente e validar o comportamento da página de erro

### Fluxo de edição e exclusão de reservas pelo calendário - XX/XX/2026

<span style="color: #408080">IMPROVEMENT</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Botões de editar e excluir uma reserva diretamente pelo card de evento do calendário de alocação
- Possibilidade de atualizar uma solicitação já existente
- Correção no campo numérico dos formulários (ex: capacidade de sala), que não atualizava corretamente ao trocar de registro selecionado

### Reorganização da rota de alocação pública - XX/XX/2026

<span style="color: #408080">IMPROVEMENT</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Página de alocação pública movida para `/public/allocations`, com atualização dos links no menu lateral, no tour guiado e no cabeçalho mobile

### Correção de links na documentação de Perfil - XX/XX/2026

<span style="color: orange">BUGFIX</span>, <span style="color: #347aeb">DOCS</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Correção de link quebrado e de formatação na página de documentação de Perfil

### Melhorias em Cursos e Grades Curriculares - XX/XX/2026

<span style="color: #408080">IMPROVEMENT</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Busca de cursos diretamente do JúpiterWeb ao cadastrar um curso, evitando digitação manual do nome/código
- Mensagens de confirmação ao criar ou atualizar um curso
- Correções de detalhes nas páginas de grades curriculares e disciplinas da grade

### Revamp do relatório de ocupação - XX/XX/2026

<span style="color: #408080">IMPROVEMENT</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Reformulação visual da página de Relatórios de Ocupação, com novo filtro de período
- Correção na atualização dos dados exibidos após editar uma alocação pelo relatório

### Cards de turmas e provas na busca pública - XX/XX/2026

<span style="color: green">FEATURE</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Novo layout em cards (com efeito hover) para exibir turmas na página "Buscar Turmas"
- Novo layout em cards para exibir provas na página "Buscar Provas"

### Documentação de grade horária, reservas e solicitações - XX/XX/2026

<span style="color: #347aeb">DOCS</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Nova página de documentação sobre como salvar e gerenciar a grade horária pessoal
- Nova página de documentação sobre reservas aprovadas (por sala/período) e sobre solicitações de reserva pendentes de aprovação

### Navegação, trilha de páginas (breadcrumb) e páginas "hub" - XX/XX/2026

<span style="color: green">FEATURE</span>, <span style="color: #408080">IMPROVEMENT</span>

PR's: [#TBD](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pulls)

**Descrição:**

- Adição de trilha de navegação (breadcrumb) no topo das páginas
- Novas páginas "hub" (Ofertas, Datas, Agendamento, Área Pública) organizando os menus por categoria
- Estado do menu lateral (aberto/fechado) agora é lembrado entre páginas, e o item ativo fica destacado
- Páginas de erro 401 e 404 com ícones e mensagens mais claras
- Ajustes de responsividade mobile em "Buscar Provas" e "Minhas Solicitações"

### Adição de cursos e grade horária - XX/XX/2026 

<span style="color: green">FEATURE</span>

PR's: [#145](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/145), [#159](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/159)

**Descrição:**

- Funcionalidade de cursos e grade curriculares
- Funcionalidade de grade horária para o usuário

### Correção do Janus Crawler - XX/XX/2026 

<span style="color: orange">BUGFIX</span>

PR's: [#145](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/145), [#159](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/159)

**Descrição:**

- Agora o Janus Crawler coleta o código das turmas no formato correto de ano + semestre + turma
- Correção de erros de conflitos por código de turma

### Melhorias na página inicial - XX/XX/2026 

<span style="color: #408080">IMPROVEMENT</span>

PR's: [#145](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/145), [#159](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/159)

**Descrição:**

- Correção da home page para dispositivos mobile
- Reformulação visual da página "Sobre"
- Adição da Júlia como um dos desenvolvedores!


### Correções no cache, envio de e-mails e melhorias - 28/02/2026 

<span style="color: red">HOTFIX</span>, <span style="color: #408080">IMPROVEMENT</span>

PR's: [#145](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/145), [#159](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/159)

**Descrição:**

- Correção da falta de envio de e-mails por problemas de autenticação Google
- Correção na rota de eventos (alocações) não salvando o intervalo todo do cache
- Correção na atualização de páginas após criar uma reserva/solicitação
- Ordenação da tabela de reportes corrigida

### Adição de cache em rotas - 19/02/2026

<span style="color: #408080">IMPROVEMENT</span>

PR's: [#158](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/158)

**Descrição:**

- Adição de cache na rota de eventos (alocações) e turmas do mobile

### Login USP, gifs na docs e correções na tela de salas - 19/02/2026

<span style="color: #408080">IMPROVEMENT</span>, <span style="color: orange">BUGFIX</span>, <span style="color: #347aeb">DOCS</span>

PR's: [#143](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/143)

**Descrição:**

- Na tela de login, por padrão, apenas mostra e-mails @usp
- Adição de alguns gifs no lugar de imagens
- Correção na tela de salas que estava com conteúdo em desenvolvimento

### Gerencimento de sessões e correções no login - 15/02/2026

<span style="color: green">FEATURE</span>, <span style="color: orange">BUGFIX</span>

PR's: [#139](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/139), [#157](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/157)

**Descrição:**

- Correção das chamadas a API para turmas, que faziam um redirecionamento errado

### Hotfix Turmas - 11/02/2026

<span style="color: red">HOTFIX</span>

PR's: [#138](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/138)

**Descrição:**

- Correção das chamadas a API para turmas, que faziam um redirecionamento errado

### Modelagem de Cursos - 04/02/2026

<span style="color: green">FEATURE</span>

PR's: [#155](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/155)

**Descrição:**

- Modelagem inicial dos dados para cursos, apenas banco de dados e backend

## 2025

Aqui estão todas as principais mudanças realizadas no USPolis em 2025.

### Client ip e deploy - 20/12/2025

<span style="color: orange">BUGFIX</span>

PR's: [#136](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/136) e [#147](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/147)

**Descrição:**

- Correção do nginx + uvicorn para coletar o client ip corretamente nos logs
- Criação de um arquivo asgi.py para deploy ao invés de wsgi.py

### Rotas Health e Logs Loki - 20/12/2025

<span style="color: green">FEATURE</span>

PR's: [#136](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/136) e [#147](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/147)

**Descrição:**

- Adição de rotas health para o sistema e conexão com o banco de dados
- Adição de tracking das rotas públicas caso o usuário esteja logado

### Correção de bug - 12/12/2025

<span style="color: orange">BUGFIX</span>

PR's: [#135](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/135) e [#146](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/146)

**Descrição:**

- Correção na página de conflitos, agora mostra por padrão apenas conflitos com datas que ainda não foram
- Melhorias no desempenho da rotas de conflito, agora é um prédio por vez

### Correção de bug - 11/12/2025

<span style="color: orange">BUGFIX</span>

PR's: [#134](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/134) e [#145](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/145)

**Descrição:**

- Correção na listagem de calendários e turmas, agora mostram os dado do ano atual e seguintes
- Correção nas imagens suportadas no "Fale Conosco"

### Docs - 06/12/2025

<span style="color: #408080">IMPROVEMENT</span>

PR's: [#132](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/132)

**Descrição:**

- Adição da seção de deploy na docs de dev

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
