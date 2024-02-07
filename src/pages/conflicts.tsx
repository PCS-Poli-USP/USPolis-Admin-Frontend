import { useEffect, useState } from 'react';
import ConflictsService from '../services/conflicts.service';
import Navbar from 'components/common/navbar.component';
import * as C from '@chakra-ui/react';
import Conflict from 'models/conflict.model';
import { useDisclosure, useToast } from '@chakra-ui/react';
import EditEventModal from 'components/allocation/editEvent.modal';
import EventsService from 'services/events.service';
import Event from 'models/event.model';
import { weekDaysFormatter } from 'utils/classes/classes.formatter';

const ConflictsPage = () => {
  const eventsService = new EventsService();
  const conflictsService = new ConflictsService();

  const [conflicts, setConflicts] = useState<Conflict | null>(null);
  const [buildingNames, setBuildingNames] = useState<string[] | null>(null);
  const [selectedBuildingName, setSelectedBuildingName] = useState<string>('');
  const [classroomNames, setClassroomNames] = useState<string[] | null>(null);
  const [selectedClassroomName, setSelectedClassroomName] =
    useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event>({
    class_code: '',
    subject_code: '',
    start_period: '',
    end_period: '',
    start_time: '',
    end_time: '',
    week_day: '',
    subject_name: '',
    professors: [],
    classroom: '',
    building: '',
    subscribers: 0,
    id: '0',
  });

  const {
    isOpen: isOpenAllocEdit,
    onOpen: onOpenAllocEdit,
    onClose: onCloseAllocEdit,
  } = useDisclosure();

  const toast = useToast();
  const toastSuccess = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Sucesso!',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const toastError = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Erro!',
      description: message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setBuildingNames(
      conflicts?.buildings.map((building) => building.name) || [],
    );
  }, [conflicts]);

  useEffect(() => {
    if (selectedBuildingName) {
      setClassroomNames(
        conflicts?.buildings
          .find((building) => building.name === selectedBuildingName)
          ?.classrooms.map((classroom) => classroom.name) || [],
      );
    } else setClassroomNames(null);
  }, [selectedBuildingName, conflicts]);

  function fetchData() {
    conflictsService
      .list()
      .then((res) => {
        console.log(res.data);
        setConflicts(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert('Erro ao carregar conflitos');
      });
  }

  function handleAllocationEdit(
    subjectCode: string,
    classCode: string,
    weekDays: string[],
    newClassroom: string,
    building: string,
  ) {
    eventsService
      .edit(subjectCode, classCode, weekDays, newClassroom, building)
      .then(() => {
        toastSuccess('Alocação editada com sucesso!');
        fetchData();
      })
      .catch((error) => {
        toastError(`Erro ao editar alocação: ${error}`);
      });
  }

  function handleEditClick(event: Event) {
    setSelectedEvent(event);
    onOpenAllocEdit();
  }

  return (
    <>
      <Navbar />
      <C.Flex paddingX={4} direction={'column'}>
        <C.Text fontSize='4xl' mb={4}>
          Conflitos
        </C.Text>
        <C.Flex direction={'row'} gap={4} mb={4}>
          <C.Flex direction={'column'} flex={1}>
            <C.Text fontSize={'md'}>Prédio:</C.Text>
            <C.Select
              placeholder='Selecione o prédio'
              onChange={(e) => setSelectedBuildingName(e.target.value)}
            >
              {buildingNames?.map((buildingName) => (
                <option key={buildingName} value={buildingName}>
                  {buildingName}
                </option>
              ))}
            </C.Select>
          </C.Flex>
          <C.Flex direction={'column'} flex={1}>
            <C.Text fontSize={'md'}>Sala:</C.Text>
            <C.Select
              placeholder='Selecione a sala'
              onChange={(e) => setSelectedClassroomName(e.target.value)}
              disabled={!selectedBuildingName}
            >
              {classroomNames?.map((classroomName) => (
                <option key={classroomName} value={classroomName}>
                  {classroomName}
                </option>
              ))}
            </C.Select>
          </C.Flex>
        </C.Flex>
        <C.Flex direction={'column'}>
          {selectedBuildingName && selectedClassroomName ? (
            conflicts?.buildings
              .find((building) => building.name === selectedBuildingName)
              ?.classrooms.find(
                (classroom) => classroom.name === selectedClassroomName,
              )
              ?.week_days.map((week_day) => (
                <C.Flex
                  direction={'column'}
                  justifyContent={'space-between'}
                  padding={4}
                  border={'1px solid'}
                  borderColor={'gray.200'}
                  boxShadow={'md'}
                  borderRadius={4}
                  mb={4}
                  gap={2}
                >
                  <C.Text fontSize={'lg'} fontWeight={'bold'}>
                    {weekDaysFormatter(week_day.name)}
                  </C.Text>
                  {week_day.events.map((event_group, index) => (
                    <C.Flex
                      key={index}
                      direction={'column'}
                      justifyContent={'space-between'}
                      gap={4}
                      border={'1px solid'}
                      boxShadow={'md'}
                      borderColor={'gray.200'}
                      borderRadius={4}
                      padding={4}
                    >
                      {event_group.map((event, index) => (
                        <C.Flex
                          key={event.id}
                          direction={'row'}
                          justifyContent={'space-between'}
                          border={'1px solid'}
                          borderColor={'gray.200'}
                          borderRadius={4}
                          padding={4}
                        >
                          <C.Flex direction={'column'} flex={1}>
                            <C.Text fontSize={'md'}>
                              <strong>Início: {event.start_time}</strong>
                            </C.Text>
                            <C.Text fontSize={'md'}>
                              <strong>Fim: {event.end_time}</strong>
                            </C.Text>
                          </C.Flex>
                          <C.Flex direction={'column'} flex={1}>
                            <C.Text fontSize={'md'}>
                              Disciplina: {event.subject_name}
                            </C.Text>
                            <C.Text fontSize={'md'}>
                              Professores:{' '}
                              {event.professors?.map((professor, index) => (
                                <>
                                  {professor}
                                  {event &&
                                  event.professors &&
                                  index !== event.professors.length - 1
                                    ? ', '
                                    : ''}
                                </>
                              ))}
                            </C.Text>
                          </C.Flex>
                          <C.Flex direction={'column'} flex={1}>
                            <C.Text fontSize={'md'}>
                              Código de turma: {event.class_code}
                            </C.Text>
                            <C.Text fontSize={'md'}>
                              Código de disciplina: {event.subject_code}
                            </C.Text>
                          </C.Flex>
                          <C.Button onClick={() => handleEditClick(event)}>
                            Editar Alocação
                          </C.Button>
                        </C.Flex>
                      ))}
                    </C.Flex>
                  ))}
                </C.Flex>
              ))
          ) : (
            <></>
          )}
        </C.Flex>
      </C.Flex>
      <EditEventModal
        isOpen={isOpenAllocEdit}
        onClose={onCloseAllocEdit}
        onSave={handleAllocationEdit}
        classEvents={[
          {
            subjectCode: selectedEvent.subject_code,
            classroom: selectedEvent.classroom || '',
            building: selectedEvent.building || '',
            classCode: selectedEvent.class_code,
            professors: selectedEvent.professors || [''],
            subscribers: selectedEvent.subscribers,
            weekday: selectedEvent.week_day,
            startTime: selectedEvent.start_time,
            endTime: selectedEvent.end_time,
            classCodeText: selectedEvent.class_code,
          },
        ]}
      />
    </>
  );
};

export default ConflictsPage;