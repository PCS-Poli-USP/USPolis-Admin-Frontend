import createFeatureTourGuideStep from './steps';

function createUserMenuStep() {
  return createFeatureTourGuideStep({
    target: '#navbar-user-menu-button',
    title: 'Menu do Usuário',
    description:
      'Esse é o menu do usuário, onde você pode acessar suas informações e sair do sistema.',
    placement: 'bottom',
  });
}

function createOpenMenuStep() {
  return createFeatureTourGuideStep({
    target: '#navbar-menu-button',
    title: 'Abrir Menu',
    description: 'Clique aqui para abrir o menu.',
  });
}

function createMenuStep() {
  return createFeatureTourGuideStep({
    target: '#menu-drawer',
    title: 'Menu',
    description:
      'Esse é o menu do sistema, onde você pode acessar todas as funcionalidades.',
    placement: 'right',
  });
}

function createContactStep() {
  return createFeatureTourGuideStep({
    target: '#menu-drawer-contact',
    title: 'Contato',
    description:
      'Caso tenha alguma dúvida, sugestão ou deseja reportar um erro, nos contate por esse email.',
    placement: 'top',
  });
}

function createAllocationGridStep() {
  return createFeatureTourGuideStep({
    target: '#allocation-grid',
    title: 'Mapa de Salas',
    description:
      'Esse é o mapa de salas, onde você pode visualizar a alocação de salas.',
  });
}

function createAllocationHeaderStep() {
  return createFeatureTourGuideStep({
    target: '.fc-toolbar-chunk',
    title: 'Visualização de Alocação',
    description:
      'Aqui você pode escolher a visualização do mapa de salas, existem quatro opções, cada uma com uma visão diferente.',
  });
}

function createReservationByAllocationStep() {
  return createFeatureTourGuideStep({
    target: '.fc-scrollgrid-section-body',
    title: 'Reservas pelo Mapa de Salas',
    description:
      'Você pode criar reservas clicando no mapa de salas diretamente, isso vale APENAS nas visualizações Sala/Dia ou Sala/Semana. Além disso, você pode editar alocações clicando segurado e arrastando para a nova sala/hora',
    placement: 'top',
    data: {
      next: '/classes',
    },
    isFixed: true,
    width: '600px',
  });
}

function createAutomaticClassCreationStep() {
  return createFeatureTourGuideStep({
    target: '#crawler-buttons',
    title: 'Cadastro de Turmas Automático',
    description:
      'Você pode cadastrar turmas automaticamente, basta selecionar se vai ser pelo Júpiter ou pelo Janus, inserir os códigos das disciplinas e pronto!',
    placement: 'bottom',
    data: {
      previous: '/allocation',
    },
    isFixed: true,
    width: '600px',
  });
}

export function createSteps() {
  return [
    createUserMenuStep(),
    createOpenMenuStep(),
    createMenuStep(),
    createContactStep(),
    createAllocationGridStep(),
    createAllocationHeaderStep(),
    createReservationByAllocationStep(),
    createAutomaticClassCreationStep(),
  ];
}

export const FG_STEP_INDEXES = {
  USER_MENU: 0,
  OPEN_MENU: 1,
  MENU: 2,
  CONTACT: 3,
  ALLOCATION_GRID: 4,
  ALLOCATION_HEADER: 5,
  RESERVATION_BY_ALLOCATION: 6,
  AUTOMATIC_CLASS_CREATION: 7,
}
