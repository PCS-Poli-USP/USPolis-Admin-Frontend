import {
  Button,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  OrderedList,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import AutomaticAllocationAccordion from './automaticAllocation.accordion';
import { useNavigate } from 'react-router-dom';
import Event, { EventByClassrooms } from 'models/event.model';
import EditEventModal from 'components/allocation/editEvent.modal';
import { useEffect, useState } from 'react';
import { EventToEventByClassroom } from 'utils/classes/classes.formatter';
import EventsService from 'services/events.service';

interface AutomaticAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  allocatedEvents: Event[];
  unallocatedEvents: Event[];
}

export default function AutomaticAllocationModal({
  isOpen,
  onClose,
  allocatedEvents,
  unallocatedEvents,
}: AutomaticAllocationModalProps) {
  const {
    isOpen: isOpenEditEventModal,
    onOpen: onOpenEditEventModal,
    onClose: onCloseEditEventModal,
  } = useDisclosure();

  const initialEvent: EventByClassrooms = {
    subject_code: '',
    classroom: '',
    building: '',
    has_to_be_allocated: true,
    class_code: '',
    professors: [],
    start_time: '',
    end_time: '',
    week_day: '',
    class_code_text: '',
    subscribers: 0,
  };
  const [selectedEvent, setSelectedEvent] =
    useState<EventByClassrooms>(initialEvent);
  const [allocatedEventsList, setAllocatedEvents] = useState<Event[]>([]);
  const [unallocatedEventsList, setUnallocatedEvents] = useState<Event[]>([]);

  const eventsService = new EventsService();
  const navigate = useNavigate();

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
    if (allocatedEvents.length > 0) setAllocatedEvents(allocatedEvents);
    if (unallocatedEvents.length > 0) setUnallocatedEvents(unallocatedEvents);
  }, [allocatedEvents, unallocatedEvents]);

  function handleAllocNavClick() {
    navigate('/allocation');
  }

  function handleEditEventClick(event: Event) {
    setSelectedEvent(EventToEventByClassroom(event));
    onOpenEditEventModal();
  }

  function handleEditEvent(
    subjectCode: string,
    classCode: string,
    weekDays: string[],
    newClassroom: string,
    building: string,
  ) {
    if (subjectCode !== '' && selectedEvent.week_day !== '') {
      eventsService
        .edit(subjectCode, classCode, weekDays, newClassroom, building)
        .then((it) => {
          toastSuccess('Alocação editada com sucesso!');
          onCloseEditEventModal();
        })
        .catch((error) => {
          toastError(`Erro ao editar alocação: ${error}`);
          onCloseEditEventModal();
        });

      let index = allocatedEventsList.findIndex(
        (value) => (
          value.subject_code === subjectCode,
          value.class_code === classCode,
          value.week_day === selectedEvent.week_day,
          value.start_time === selectedEvent.start_time
        ),
      );

      const newAllocatedEvents = [...allocatedEventsList];
      const newUnallocatedEvents = [...unallocatedEventsList];
      if (index >= 0) {
        newAllocatedEvents[index].classroom = newClassroom;
      } else {
        index = unallocatedEventsList.findIndex(
          (value) => (
            value.subject_code === subjectCode,
            value.class_code === classCode,
            value.week_day === selectedEvent.week_day,
            value.start_time === selectedEvent.start_time
          ),
        );
        const event = newUnallocatedEvents.splice(index, 1);
        newAllocatedEvents.push(event[0]);
        setUnallocatedEvents(newUnallocatedEvents);
      }
      setAllocatedEvents(newAllocatedEvents);
      eventsService
        .editAllocations(newAllocatedEvents, newUnallocatedEvents)
        .then((it) => {
          console.log('Editei a alocação!');
        })
        .catch((error) => {
          toastError(`Erro ao salvar alocação: ${error}`);
        });
    }
  }

  function handleDeleteEvent(subjectCode: string, classCode: string) {
    if (subjectCode !== '' && selectedEvent.week_day !== '') {
      eventsService
        .deleteOneAllocation(
          subjectCode,
          classCode,
          selectedEvent.week_day,
          selectedEvent.start_time,
        )
        .then((it) => {
          toastSuccess('Alocação removida com sucesso!');
          onCloseEditEventModal();
          // refetch data
          // TODO: create AllocationContext
        })
        .catch((error) => {
          toastError(`Erro ao remover alocação: ${error}`);
          onCloseEditEventModal();
        });

      const newAllocatedEvents = [...allocatedEventsList];
      const newUnallocatedEvents = [...unallocatedEventsList];
      const index = allocatedEventsList.findIndex(
        (value) => (
          value.subject_code === subjectCode,
          value.class_code === classCode,
          value.week_day === selectedEvent.week_day,
          value.start_time === selectedEvent.start_time
        ),
      );
      if (index >= 0) {
        const event = newAllocatedEvents.splice(index, 1);
        newUnallocatedEvents.push(event[0]);
      }
      setAllocatedEvents(newAllocatedEvents);
      setUnallocatedEvents(newUnallocatedEvents);

      eventsService
        .editAllocations(newAllocatedEvents, newUnallocatedEvents)
        .then((it) => {
          console.log('Editei a alocação!');
        })
        .catch((error) => {
          toastError(`Erro ao salvar alocação: ${error}`);
        });
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      motionPreset='slideInBottom'
      size='4xl'
      scrollBehavior='outside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Alocação Automática</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditEventModal
            isOpen={isOpenEditEventModal}
            onClose={onCloseEditEventModal}
            onSave={handleEditEvent}
            onDelete={handleDeleteEvent}
            classEvents={[selectedEvent]}
          />
          {unallocatedEventsList.length > 0 ? (
            <Text fontSize='md' fontWeight='normal' mb={4}>
              Não foi possível alocar todas as turmas, isso pode ter ocorrido
              por 3 principais motivos:
              <OrderedList>
                <ListItem>
                  Salas insuficientes para as preferências das turmas
                </ListItem>
                <ListItem>
                  Salas insuficientes para a quantidade de alunos das turmas
                </ListItem>
                <ListItem>
                  Salas insuficientes para os horários das turmas
                </ListItem>
              </OrderedList>
            </Text>
          ) : (
            <Text fontSize='md' fontWeight='bold' mb={4}>
              Todas turmas foram alocadas com sucesso
            </Text>
          )}
          <AutomaticAllocationAccordion
            onEdit={handleEditEventClick}
            allocated={allocatedEventsList}
            unallocated={unallocatedEventsList}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleAllocNavClick}>
            Ir para Alocações
          </Button>
          <Button colorScheme='blue' mr={0} onClick={onClose}>
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
