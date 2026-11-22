import { Flex, Heading, Text } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import HubPageGrid, {
  HubPageGridItem,
} from '../../components/common/HubPageGrid';
import { useNavigate } from 'react-router-dom';
import { BsCalendar3 } from 'react-icons/bs';
import { Search2Icon } from '@chakra-ui/icons';

function PublicHub() {
  const navigate = useNavigate();

  const items: HubPageGridItem[] = [
    {
      icon: <Search2Icon boxSize={'64px'} />,
      title: 'Busque no USPolis',
      description:
        'Encontre disciplinas, turmas, salas, professores, provas e monitorias',
      onClick: () => {
        navigate('/public/search');
      },
    },
    {
      icon: <BsCalendar3 size={'64px'} />,
      title: 'Mapa de Salas',
      description: 'Visualize a distribuição das salas no campus',
      onClick: () => {
        navigate('/public/allocations');
      },
    },
  ];
  return (
    <PageContent>
      <Flex direction={'column'} alignItems='center'>
        <Heading>Portal Público</Heading>
        <Text size='lg' mb={'20px'} textAlign={'center'}>
          Selecione um dos módulos abaixo para acessar as funcionalidades
          disponíveis para o público geral.
        </Text>
        <HubPageGrid items={items} columns={2} />
      </Flex>
    </PageContent>
  );
}

export default PublicHub;
