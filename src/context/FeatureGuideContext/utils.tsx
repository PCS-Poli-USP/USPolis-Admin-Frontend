import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import createFeatureTourGuideStep from './steps';
import TravelHand from '../../components/common/Animation/TravelHand';

function createUserMenuStep() {
  return createFeatureTourGuideStep({
    target: '#navbar-user-menu-button',
    title: 'Menu do Usuário',
    description: 'Acesse suas informações ou saia do sistema.',
    placement: 'bottom',
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
  });
}

function createAllocationGridStep() {
  return createFeatureTourGuideStep({
    target: '#allocation-grid',
    title: 'Mapa de Salas',
    description: 'Visualize a alocação de salas.',
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
  OPEN_MENU: 1,
  MENU: 2,
  CONTACT: 3,
  ALLOCATION_GRID: 4,
  ALLOCATION_HEADER: 5,
  RESERVATION_BY_ALLOCATION: 6,
  ALLOCATION_DRAG_AND_DROP: 7,
  AUTOMATIC_CLASS_CREATION: 8,
};
