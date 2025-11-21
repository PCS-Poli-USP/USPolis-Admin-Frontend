export default {
  lang: 'pt-BR',
  base: '/docs/',
  title: 'USPolis - Documentação',
  description: 'Docs dentro do app React',

  themeConfig: {
    logo: '/favicon.ico',
    search: {
      provider: 'local', // ou 'algolia', se você usa algolia
      options: {
        translations: {
          button: {
            buttonText: 'Buscar',
            buttonAriaLabel: 'Buscar',
          },
          modal: {
            searchBox: {
              resetButtonTitle: 'Limpar',
              resetButtonAriaLabel: 'Limpar',
              cancelButtonText: 'Cancelar',
              cancelButtonAriaLabel: 'Cancelar',
            },
            startScreen: {
              recentSearchesTitle: 'Buscas recentes',
              noRecentSearchesText: 'Sem buscas recentes',
              saveRecentSearchButtonTitle: 'Salvar nos recentes',
              removeRecentSearchButtonTitle: 'Remover dos recentes',
              favoriteSearchesTitle: 'Favoritos',
              removeFavoriteSearchButtonTitle: 'Remover dos favoritos',
            },
            errorScreen: {
              titleText: 'Não foi possível obter resultados',
              helpText: 'Tente novamente.',
            },
            footer: {
              selectText: 'Selecionar',
              selectKeyAriaLabel: 'Enter',
              navigateText: 'Navegar',
              navigateUpKeyAriaLabel: 'Seta para cima',
              navigateDownKeyAriaLabel: 'Seta para baixo',
              closeText: 'Fechar',
              closeKeyAriaLabel: 'Esc',
            },
            noResultsScreen: {
              noResultsText: 'Nenhum resultado encontrado',
              suggestedQueryText: 'Consulta sugerida:',
              openIssueText: 'Gostaria de fazer uma sugestão?',
              openIssueLinkText: 'Abrir issue',
            },
          },
        },
      },
    },

    socialLinks: [
      // You can add any icon from simple-icons (https://simpleicons.org/):
      { icon: 'github', link: 'https://github.com/PCS-Poli-USP/USPolis-Admin' },
    ],

    nav: [
      { text: 'Guias', link: '/' },
      { text: 'Referencia', link: '/dev' },
      {
        text: 'Changelog',
        link: '/changelog',
      },
    ],

    lightModeSwitchTitle: 'Mudar para tema claro',
    darkModeSwitchTitle: 'Mudar para tema escuro',

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You',
    },

    sidebar: {
      '/': [
        {
          text: 'Introdução',
          collapsed: false,
          items: [
            {
              text: 'O que é o USPolis?',
              link: '/what-is-uspolis',
            },
            { text: 'Como usar?', link: '/getting-started' },
          ],
        },
        {
          text: 'Mapa de Salas',
          collapsed: true,
          items: [
            { text: 'Introdução', link: '/allocation' },
            { text: 'Visualizações', link: '/allocation/views' },
            { text: 'Relatórios em PDF', link: '/allocation/pdfs' },
            { text: 'Gerenciar a alocação pelo Mapa de Salas', link: '/allocation/management' },
          ],
        },
        {
          text: 'Solicitar uma Sala',
          collapsed: true,
          items: [
            { text: 'Como solicitar uma sala?', link: '/solicitate-a-classroom' },
          ],
        },
        {
          text: 'Encontre suas provas',
          collapsed: true,
          items: [
            { text: 'Como achar uma prova?', link: '/find-exams' },
          ],
        },
        {
          text: 'Encontre suas aulas',
          collapsed: true,
          items: [
            { text: 'Como achar suas aulas?', link: '/find-classes' },
          ],
        },
        {
          text: 'Minhas Solicitações',
          collapsed: true,
          items: [
            { text: 'Introdução', link: '/my-solicitations' },
          ],
        },
        {
          text: 'Minha Conta',
          collapsed: true,
          items: [
            { text: 'Introdução', link: '/profile' },
          ],
        },
        {
          text: 'Reservas',
          collapsed: true,
          items: [
            { text: 'Introdução', link: '/introduction' },
          ],
        },
        {
          text: 'Solicitações',
          collapsed: true,
          items: [
            { text: 'Como aprovar uma solicitação?', link: '/solicitations' },
          ],
        },
        {
          text: 'Calendários',
          collapsed: true,
          items: [
            { text: 'Como criar um calendário?', link: '/calendars' },
          ],
        },
        {
          text: 'Salas',
          collapsed: true,
          items: [
            { text: 'Introdução', link: '/classrooms' },
          ],
        },
        {
          text: 'Disciplinas',
          collapsed: true,
          items: [
            { text: 'Introdução', link: '/subjects' },
          ],
        },
        {
          text: 'Turmas',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/classes' },
          ],
        },
        {
          text: 'Conflitos',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/conflicts' },
          ],
        },
        {
          text: 'Relatórios e Métricas',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/reports' },
          ],
        },
      ],

      '/dev/': [
        {
          text: 'Guia para Desenvolvedores',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '' },
          ],
        },
        {
          text: 'Backend',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '' },
          ],
        },
        {
          text: 'Frontend',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '' },
          ],
        },
        {
          text: 'Banco de Dados',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '' },
          ],
        },
      ],
    },
  },
};
