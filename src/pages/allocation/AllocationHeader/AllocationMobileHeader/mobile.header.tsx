import {
  Box,
  Button,
  Collapse,
  Flex,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, LockIcon } from '@chakra-ui/icons';

import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { appContext } from '../../../../context/AppContext';
import { AllocationHeaderProps } from '../index';
import HeaderFilter from '../HeaderFilter/header.filter';
import { Share } from '@capacitor/share';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Calendar } from '@capacitor/calendar';
import ClassesPDFModal from '../ClassesPDFModal';
import ClassroomPDFModal from '../ClassroomCalendarPDF';
import SubjectReportModal from '../SubjectReportModal';
import EmptyClassroomsReportModal from '../EmptyClassroomsrReportModal';

function AllocationMobileHeader({
  isOpen,
  onOpen,
  onClose,
  buildingSearchValue,
  setBuildingSearchValue,
  classroomSearchValue,
  setClassroomSearchValue,
  nameSearchValue,
  setNameSearchValue,
  classSearchValue,
  setClassSearchValue,
  events,
  buildingResources,
  classroomResources,
  buildings,
  subjects,
  loadingSubjects,
  loadingBuildings,
  loadingSolicitation,
}: AllocationHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedUser } = useContext(appContext);

  const { isOpen: isOpenOptions, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });

  const {
    isOpen: isOpenClassesPDF,
    onClose: onCloseClassesPDF,
    onOpen: onOpenClassesPDF,
  } = useDisclosure();

  const {
    isOpen: isOpenClassroomsPDF,
    onClose: onCloseClassroomsPDF,
    onOpen: onOpenClassroomsPDF,
  } = useDisclosure();

  const {
    isOpen: isOpenSubjectReport,
    onClose: onCloseSubjectReport,
    onOpen: onOpenSubjectReport,
  } = useDisclosure();

  const {
    isOpen: isOpenEmptyClassroomsReport,
    onClose: onCloseEmptyClassroomsReport,
    onOpen: onOpenEmptyClassroomsReport,
  } = useDisclosure();

  const handleShare = async () => {
    await Share.share({
      title: 'Mapa de Salas - USPolis',
      text: 'Confira o Mapa de Salas do USPolis.',
    });
  };

  const testCalendar = async () => {
  try {
    const permission = await Calendar.requestPermissions({
      permissions: ['readCalendar', 'writeCalendar'],
    });

    console.log('Permissão:', permission);

    if (
      permission.readCalendar !== 'granted' ||
      permission.writeCalendar !== 'granted'
    ) {
      console.log('Permissão de calendário não concedida');
      return;
    }

    const result = await Calendar.listCalendars();

    console.log(
      'Calendários disponíveis:',
      JSON.stringify(result, null, 2),
    );

    const calendarId = '5';
    const startDate = Date.now() + 30 * 1000;
    const endDate = startDate + 60 * 60 * 1000;

    const event = await Calendar.createEvent({
      calendarId,
      title: 'Teste USPolis',
      location: 'Sala de Teste',
      notes: 'Evento criado pelo aplicativo USPolis.',
      startDate,
      endDate,
    });

    console.log('Evento criado:', event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
  }
};

  
const testNotification = async () => {
  const permission = await LocalNotifications.requestPermissions();

  if (permission.display !== 'granted') {
    console.log('Permissão de notificação não concedida');
    return;
  }

  const notificationTime = new Date(Date.now() +  30 * 1000);

  await LocalNotifications.schedule({
    notifications: [
      {
        id: 2,
        title: 'Aula em 5 minutos',
        body: 'Sua aula de começa em 5 minutos',
        schedule: {
          at: notificationTime,
        },
      },
    ],
  });

  console.log(
    'Notificação agendada para:',
    notificationTime.toLocaleString(),
  );
};

  return (
    <Flex direction={'column'} alignItems={'flex-start'} gap={5} w={'100%'}>
      <Flex direction={'row'} gap={0} w={'100%'}>
        <Text fontSize={'2xl'}>Mapa de Salas</Text>
        <Button
          ml={'60px'}
          rightIcon={isOpenOptions ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={() => onToggle()}
        >
          {isOpenOptions ? 'Fechar' : 'Opções'}
        </Button>
      </Flex>
      <Collapse in={isOpenOptions} animateOpacity={true}>
        <Box rounded='md' w={'calc(100vw - 48px)'}>
          <Flex mb={4} gap={2} direction={'column'} w={'100%'}>
            <Flex direction={'row'} gap={5} w={'full'}>
              <Tooltip
                label={loggedUser ? '' : 'Entre para poder fazer essa ação.'}
              >
                <Button
                  colorScheme='blue'
                  onClick={() => {
                    if (!loggedUser) {
                      navigate('/auth', {
                        replace: true,
                        state: { from: location },
                      });
                    }
                    onOpen();
                  }}
                  leftIcon={loggedUser ? undefined : <LockIcon />}
                >
                  Solicitar Sala
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleShare}
                >
                  Compartilhar
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={onOpenClassroomsPDF}
                >
                  Baixar mapa de salas
                </Button>
                <Button onClick={testNotification}>
                  Testar notificação
                </Button>
                <Button onClick={testCalendar}>
                  Testar calendário
                </Button>
              </Tooltip>
            </Flex>

            <HeaderFilter
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              buildingSearchValue={buildingSearchValue}
              setBuildingSearchValue={setBuildingSearchValue}
              classroomSearchValue={classroomSearchValue}
              setClassroomSearchValue={setClassroomSearchValue}
              nameSearchValue={nameSearchValue}
              setNameSearchValue={setNameSearchValue}
              classSearchValue={classSearchValue}
              setClassSearchValue={setClassSearchValue}
              events={events}
              buildingResources={buildingResources}
              classroomResources={classroomResources}
              subjects={subjects}
              loadingSubjects={loadingSubjects}
              buildings={buildings}
              loadingBuildings={loadingBuildings}
              loadingSolicitation={loadingSolicitation}
            />
          </Flex>
        </Box>
      </Collapse>
      <ClassesPDFModal
        isOpen={isOpenClassesPDF}
        onClose={onCloseClassesPDF}
        buildings={buildings}
      />

      <ClassroomPDFModal
        isOpen={isOpenClassroomsPDF}
        onClose={onCloseClassroomsPDF}
        buildings={buildings}
      />

      <SubjectReportModal
        isOpen={isOpenSubjectReport}
        onClose={onCloseSubjectReport}
        loading={loadingSubjects || loadingBuildings}
        subjects={subjects}
        buildings={buildings}
      />

      <EmptyClassroomsReportModal
        isOpen={isOpenEmptyClassroomsReport}
        onClose={onCloseEmptyClassroomsReport}
        buildings={buildings}
      />
    </Flex>
  );
}
export default AllocationMobileHeader;
