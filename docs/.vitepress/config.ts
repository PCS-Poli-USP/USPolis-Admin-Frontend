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
      { text: 'Referencia', link: './dev' },
      {
        text: 'Changelog',
        link: './changelog',
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
            { text: 'Reservar pelo Mapa de Salas', link: '/allocation/reservations' },
            { text: 'Relatórios em PDF', link: '/allocation/pdfs' },
          ],
        },
        {
          text: 'Solicitar uma Sala',
          collapsed: true,
          items: [
            { text: 'Introdução', link: '/solicitate-a-classroom' },
          ],
        },
        {
          text: 'Encontre suas provas',
          collapsed: true,
          items: [
            { text: 'Introdução', link: '/introduction' },
          ],
        },
        {
          text: 'Encontre suas aulas',
          collapsed: true,
          items: [
            { text: 'Introdução', link: '/introduction' },
          ],
        },
        {
          text: 'Minhas Solicitações',
          collapsed: true,
          items: [
            { text: 'Introdução', link: '/introduction' },
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
            { text: 'Introdução', link: '/introduction' },
          ],
        },
        {
          text: 'Calendários',
          collapsed: true,
          items: [
            { text: 'Introdução', link: './introduction' },
          ],
        },
        {
          text: 'Salas',
          collapsed: true,
          items: [
            { text: 'Introdução', link: './introduction' },
          ],
        },
        {
          text: 'Disciplinas',
          collapsed: true,
          items: [
            { text: 'Introdução', link: './introduction' },
          ],
        },
        {
          text: 'Turmas',
          collapsed: true,
          items: [
            { text: 'Introduction', link: './introduction' },
          ],
        },
        {
          text: 'Conflitos',
          collapsed: true,
          items: [
            { text: 'Introduction', link: './introduction' },
          ],
        },
        {
          text: 'Relatórios',
          collapsed: true,
          items: [
            { text: 'Introduction', link: './introduction' },
          ],
        },
      ],

      '/dev/': [
        {
          text: 'Dev Guide',
          collapsed: true,
          items: [
            { text: 'Introduction devs', link: './introduction' },
          ],
        },
      ],
    },
  },
};
