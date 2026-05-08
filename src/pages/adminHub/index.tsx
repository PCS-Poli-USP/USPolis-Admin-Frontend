import { Flex, Heading, Text } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import HubPageGrid, {
  HubPageGridItem,
} from '../../components/common/HubPageGrid';
import { LiaBuilding } from 'react-icons/lia';
import { FaRegUser } from 'react-icons/fa';
import { MdDevices, MdEvent } from 'react-icons/md';
import { HiUserGroup } from 'react-icons/hi';
import { GiGraduateCap } from 'react-icons/gi';
import { VscFeedback, VscReport } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

function AdminHub() {
  const navigate = useNavigate();

  const items: HubPageGridItem[] = [
    {
      icon: <LiaBuilding size={'64px'} />,
      title: 'Prédios',
      description: 'Gerencie os prédios do USPolis',
      onClick: () => {
        navigate('/admin/buildings');
      },
    },
    {
      icon: <FaRegUser size={'64px'} />,
      title: 'Usuários',
      description: 'Gerencie os usuários do USPolis',
      onClick: () => {
        navigate('/admin/users');
      },
    },
    {
      icon: <MdDevices size={'64px'} />,
      title: 'Sessões de Usuários',
      description: 'Gerencie as sessões de usuários do USPolis',
      onClick: () => {
        navigate('/admin/sessions');
      },
    },
    {
      icon: <HiUserGroup size={'64px'} />,
      title: 'Grupos de Usuários',
      description: 'Gerencie os grupos de usuários do USPolis',
      onClick: () => {
        navigate('/admin/groups');
      },
    },
    {
      icon: <MdEvent size={'64px'} />,
      title: 'Eventos',
      description: 'Gerencie os eventos do USPolis',
      onClick: () => {
        navigate('/admin/institutional-events');
      },
    },
    {
      icon: <GiGraduateCap size={'64px'} />,
      title: 'Cursos',
      description: 'Gerencie os cursos do USPolis',
      onClick: () => {
        navigate('/admin/courses');
      },
    },
    {
      icon: <VscReport size={'64px'} />,
      title: 'Reportes',
      description: 'Acesse os relatórios do USPolis',
      onClick: () => {
        navigate('/admin/bug-reports');
      },
    },
    {
      icon: <VscFeedback size={'64px'} />,
      title: 'Feedback',
      description: 'Acesse o feedback dos usuários do USPolis',
      onClick: () => {
        navigate('/admin/feedbacks', { replace: true });
      },
    },
  ];
  return (
    <PageContent>
      <Flex direction={'column'} alignItems='center'>
        <Heading>Portal Admin</Heading>
        <Text size='lg' mb={'20px'}>
          Selecione uma das opções para começar a administrar o USPolis
        </Text>
        <HubPageGrid items={items} />
      </Flex>
    </PageContent>
  );
}

export default AdminHub;
