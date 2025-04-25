import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import createFeatureTourGuideStep from './steps';
import TravelHand from '../../components/common/Animation/TravelHand';

function createUserMenuStep() {
  return createFeatureTourGuideStep({
    target: '#navbar-user-menu-button',
    title: 'Menu do Usuário',
    description: 'Acesse seu perfil ou saia do sistema.',
    placement: 'bottom',
    data: {
      next: '/profile',
    },
  });
}

function createUserProfileStep() {
  return createFeatureTourGuideStep({
    target: '#profile-info-grid',
    title: 'Perfil do Usuário',
    description: 'Aqui você pode ver suas informações.',
    placement: 'right',
    data: {
      previous: '/allocation',
    },
  });
}

function createUserBuildingsStep() {
  return createFeatureTourGuideStep({
    target: '#profile-buildings-grid',
    title: 'Prédios do Usuário',
    description: 'Prédios que você tem acesso.',
    placement: 'right',
  });
}

function createUserGroupsStep() {
  return createFeatureTourGuideStep({
    target: '#profile-groups-grid',
    title: 'Grupos e Salas do Usuário',
    description: 'Grupos com as salas que você tem acesso.',
    placement: 'right',
  });
}

function createOpenMenuStep() {
  return createFeatureTourGuideStep({
    target: '#navbar-menu-button',
    title: 'Abrir Menu',
    description: 'Clique aqui.',
  });
}

function createMenuStep() {
  return createFeatureTourGuideStep({
    target: '#menu-drawer',
    title: 'Menu',
    description: 'Aqui você acessa todas as funcionalidades.',
    placement: 'right',
  });
}

function createContactStep() {
  return createFeatureTourGuideStep({
    target: '#menu-drawer-contact',
    title: 'Contato',
    description: 'Nos mande um email.',
    placement: 'top',
    data: {
      next: '/allocation',
    },
  });
}

function createAllocationGridStep() {
  return createFeatureTourGuideStep({
    target: '#allocation-grid',
    title: 'Mapa de Salas',
    description: 'Visualize a alocação de salas.',
    data: {
      previous: '/profile',
    },
  });
}

function createAllocationHeaderStep() {
  return createFeatureTourGuideStep({
    target: '.fc-toolbar-chunk',
    title: 'Visualização de Alocação',
    description: 'Existem quatro opções, escolha uma!',
  });
}

function createReservationByAllocationStep() {
  return createFeatureTourGuideStep({
    target: '.fc-scrollgrid-section-body',
    title: 'Reservas pelo Mapa de Salas',
    description: (
      <Text>
        Crie reservas clicando no mapa de salas. <b>APENAS</b> em{' '}
        <b>Sala/Dia</b> ou <b>Sala/Semana</b>.
      </Text>
    ),
    placement: 'top',
    isFixed: true,
  });
}

function createAllocationDragAndDropStep() {
  return createFeatureTourGuideStep({
    target: '.chakra-heading.css-11f1tvj',
    title: 'Editar alocações pelo Mapa de Salas',
    description:
      'Clique com o botão esquerdo segurado e arraste para a nova sala/hora.',
    placement: 'top',
    data: {
      next: '/classes',
    },
    content: (
      <Flex
        align={'center'}
        direction='column'
        gap={'10px'}
        p={'5px'}
        zIndex={1000000}
      >
        <Heading fontWeight={'bold'} size={'mb'}>
          Editar alocações pelo Mapa de Salas
        </Heading>
        <Text size={'md'}>
          Clique segurado e arraste para a nova sala/hora.
        </Text>
        <Box mt={'20px'}>
          <TravelHand />
        </Box>
      </Flex>
    ),
    isFixed: true,
  });
}

function createAutomaticClassCreationStep() {
  return createFeatureTourGuideStep({
    target: '#crawler-buttons',
    title: 'Cadastro de Turmas Automático',
    description:
      'Escolha Júpiter ou Janus, insira os códigos das disciplinas e pronto!',
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
    createUserProfileStep(),
    createUserBuildingsStep(),
    createUserGroupsStep(),
    createOpenMenuStep(),
    createMenuStep(),
    createContactStep(),
    createAllocationGridStep(),
    createAllocationHeaderStep(),
    createReservationByAllocationStep(),
    createAllocationDragAndDropStep(),
    createAutomaticClassCreationStep(),
  ];
}

export const FG_STEP_INDEXES = {
  USER_MENU: 0,
  USER_PROFILE: 1,
  USER_BUILDINGS: 2,
  USER_GROUPS: 3,
  OPEN_PAGE_MENU: 4,
  PAGE_MENU: 5,
  CONTACT: 6,
  ALLOCATION_GRID: 7,
  ALLOCATION_HEADER: 8,
  RESERVATION_BY_ALLOCATION: 9,
  ALLOCATION_DRAG_AND_DROP: 10,
  AUTOMATIC_CLASS_CREATION: 11,
};
