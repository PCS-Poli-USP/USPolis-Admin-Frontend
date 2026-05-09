import { Flex, Heading, Text } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import HubPageGrid, {
  HubPageGridItem,
} from '../../components/common/HubPageGrid';
import { useNavigate } from 'react-router-dom';
import { MdEvent } from 'react-icons/md';
import { BsEnvelopeCheck } from 'react-icons/bs';

function SchedulingHub() {
  const navigate = useNavigate();

  const items: HubPageGridItem[] = [
    {
      icon: <MdEvent size={'64px'} />,
      title: 'Reservas',
      description: 'Visualize e gerencie as reservas de salas do USPolis',
      onClick: () => {
        navigate('/scheduling/reservations');
      },
    },
    {
      icon: <BsEnvelopeCheck size={'64px'} />,
      title: 'Solicitações',
      description: 'Verifique solicitações de reservas e aprove ou rejeite',
      onClick: () => {
        navigate('/scheduling/solicitations');
      },
    },
  ];
  return (
    <PageContent>
      <Flex direction={'column'} alignItems='center'>
        <Heading>Portal de Agendamento</Heading>
        <Text size='lg' mb={'20px'} textAlign={'center'}>
          Selecione um dos módulos abaixo para acessar as funcionalidades
          disponíveis para o agendamento.
        </Text>
        <HubPageGrid items={items} columns={2} />
      </Flex>
    </PageContent>
  );
}

export default SchedulingHub;
