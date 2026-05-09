import { Flex, Heading, Text } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import HubPageGrid, {
  HubPageGridItem,
} from '../../components/common/HubPageGrid';
import { FaBook, FaRegCalendarTimes } from 'react-icons/fa';
import { GiBookCover, GiTeacher } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { PiChair } from 'react-icons/pi';
import { CalendarIcon } from '@chakra-ui/icons';

function OferingsHub() {
  const navigate = useNavigate();

  const items: HubPageGridItem[] = [
    {
      icon: <PiChair size={'64px'} />,
      title: 'Salas',
      description: 'Gerencie as salas do USPolis',
      onClick: () => {
        navigate('/oferings/classrooms');
      },
    },
    {
      icon: <GiBookCover size={'64px'} />,
      title: 'Disciplinas',
      description: 'Gerencie as disciplinas do USPolis',
      onClick: () => {
        navigate('/oferings/subjects');
      },
    },
    {
      icon: <GiTeacher size={'64px'} />,
      title: 'Turmas',
      description: 'Gerencie as turmas do USPolis',
      onClick: () => {
        navigate('/oferings/classes');
      },
    },
    {
      icon: <CalendarIcon boxSize={'64px'} />,
      title: 'Calendários',
      description:
        'Defina os calendários acadêmicos do USPolis, os feriados e dias letivos',
      onClick: () => {
        navigate('/oferings/calendars');
      },
    },
    {
      icon: <FaRegCalendarTimes size={'64px'} />,
      title: 'Conflitos',
      description: 'Visualize e resolva os conflitos de horário do USPolis',
      onClick: () => {
        navigate('/oferings/conflicts');
      },
    },
    {
      icon: <FaBook size={'64px'} />,
      title: 'Relatórios',
      description: 'Visualize relatórios criados pelo USPolis',
      onClick: () => {
        navigate('/oferings/reports');
      },
    },
  ];
  return (
    <PageContent>
      <Flex direction={'column'} alignItems='center' padding={'0rem 10rem'}>
        <Heading>Portal de Oferecimentos</Heading>
        <Text size='lg' mb={'20px'}>
          Selecione uma das opções para começar a gerenciar os oferecimentos
          disponíveis no USPolis
        </Text>
        <HubPageGrid items={items} />
      </Flex>
    </PageContent>
  );
}

export default OferingsHub;
