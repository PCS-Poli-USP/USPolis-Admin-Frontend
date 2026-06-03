import { Flex, Heading, Text } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import HubPageGrid, {
  HubPageGridItem,
} from '../../components/common/HubPageGrid';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon } from '@chakra-ui/icons';

function DateHub() {
  const navigate = useNavigate();

  const items: HubPageGridItem[] = [
    {
      icon: <CalendarIcon boxSize={'64px'} />,
      title: 'Calendários',
      description:
        'Defina os calendários acadêmicos do USPolis, os feriados e dias letivos',
      onClick: () => {
        navigate('/date/calendars');
      },
    },
  ];
  return (
    <PageContent>
      <Flex direction={'column'} alignItems='center'>
        <Heading>Portal de Datas</Heading>
        <Text size='lg' mb={'20px'}>
          Selecione um dos módulos abaixo para acessar as funcionalidades de
          datas e feriados.
        </Text>
        <HubPageGrid items={items} columns={1} />
      </Flex>
    </PageContent>
  );
}

export default DateHub;
