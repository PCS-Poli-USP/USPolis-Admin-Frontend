import { Flex, Heading, Text } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import HubPageGrid, {
  HubPageGridItem,
} from '../../components/common/HubPageGrid';
import { useNavigate } from 'react-router-dom';
import { PiExamLight } from 'react-icons/pi';
import { BsCalendar3 } from 'react-icons/bs';
import { Search2Icon } from '@chakra-ui/icons';

function PublicHub() {
  const navigate = useNavigate();

  const items: HubPageGridItem[] = [
    {
      icon: <PiExamLight size={'64px'} />,
      title: 'Encontre suas provas',
      description: 'Busque as provas disponíveis para consulta e impressão',
      onClick: () => {
        navigate('/public/find-exams');
      },
    },
    {
      icon: <Search2Icon boxSize={'64px'} />,
      title: 'Encontre suas aulas',
      description: 'Busque as disciplinas disponíveis no USPolis',
      onClick: () => {
        navigate('/public/find-classes');
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
        <HubPageGrid items={items} columns={3} />
      </Flex>
    </PageContent>
  );
}

export default PublicHub;
