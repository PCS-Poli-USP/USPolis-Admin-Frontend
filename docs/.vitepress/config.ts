export default {
  lang: 'pt-BR',
  base: '/docs/',
  title: 'USPolis - Documentação',
  description: 'Docs dentro do app React',

  markdown: {
    mermaid: true,
  },

  themeConfig: {
    lastUpdated: {
      text: 'Atualizado em',
      formatOptions: {
        locale: 'pt-BR',
        dateStyle: 'long',
        timeStyle: 'medium',
        hour12: false,
      },
    },
    editLink: {
      pattern:
        'https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/tree/main/docs/:path',
      text: 'Edite essa página',
    },
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
      { text: 'Referência', link: '/dev' },
      {
        text: 'Changelog',
        link: '/changelog',
      },
    ],

    lightModeSwitchTitle: 'Mudar para tema claro',
    darkModeSwitchTitle: 'Mudar para tema escuro',

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-USPolis',
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
          text: 'Público',
          collapsed: false,
          items: [
            {
              text: 'Mapa de Salas',
              link: '/allocations',
              items: [
                { text: 'Visualizações', link: '/allocations/views' },
                { text: 'Relatórios em PDF', link: '/allocations/pdfs' },
                {
                  text: 'Gerenciar a alocação pelo Mapa de Salas',
                  link: '/allocations/management',
                },
                {
                  text: 'Solicitar uma Sala',
                  link: '/allocations/solicitate-a-classroom',
                },
              ],
            },
            { text: 'Encontre suas provas', link: '/find-exams' },
            { text: 'Encontre suas aulas', link: '/find-classes' },
          ],
        },
        {
          text: 'Agendamento',
          collapsed: true,
          items: [
            { text: 'Reservas', link: '/scheduling/reservations' },
            { text: 'Solicitações', link: '/scheduling/solicitations' },
          ],
        },
        {
          text: 'Oferecimentos',
          collapsed: true,
          items: [
            { text: 'Salas', link: '/oferings/classrooms' },
            { text: 'Disciplinas', link: '/oferings/subjects' },
            { text: 'Turmas', link: '/oferings/classes' },
            { text: 'Calendários', link: '/oferings/calendars' },
            { text: 'Conflitos', link: '/oferings/conflicts' },
            { text: 'Relatórios e Métricas', link: '/oferings/reports' },
          ],
        },
        {
          text: 'Conta',
          collapsed: true,
          items: [
            { text: 'Minha Conta', link: '/profile' },
            { text: 'Minhas Solicitações', link: '/profile/solicitations' },
            { text: 'Grade Horária', link: '/profile/timetable' },
          ],
        },
        {
          text: 'Administração',
          collapsed: true,
          items: [{ text: 'Visão Geral', link: '/admin' }],
        },
      ],

      '/dev/': [
        {
          text: 'Guia para Desenvolvedores',
          collapsed: false,
          items: [
            { text: 'Introdução', link: '/dev' },
            { text: 'Tecnologias Utilizadas', link: '/dev/stack' },
            { text: 'Arquitetura', link: '/dev/architecture' },
          ],
        },
        {
          text: 'Configurando seu Ambiente',
          collapsed: false,
          items: [{ text: 'Introdução', link: '/dev/enviroment' }],
        },
        {
          text: 'Backend',
          collapsed: false,
          items: [{ text: 'Introdução', link: '/dev/backend' }],
        },
        {
          text: 'Frontend',
          collapsed: false,
          items: [{ text: 'Introdução', link: '/dev/frontend' }],
        },
        {
          text: 'Banco de Dados',
          collapsed: false,
          items: [
            { text: 'Introdução', link: '/dev/database' },
            {
              text: 'Tabelas, Modelos e Relacionamentos',
              link: '/dev/database/models',
            },
            { text: 'Migrações', link: '/dev/database/migrations' },
            { text: 'Backup', link: '/dev/database/backup' },
          ],
        },
        {
          text: 'Servidor',
          collapsed: false,
          items: [
            { text: 'Introdução', link: '/dev/server' },
            { text: 'Arquivos principais', link: '/dev/server/files' },
            { text: 'Deploy', link: '/dev/server/deploy' },
          ],
        },
      ],
    },
  },
};
