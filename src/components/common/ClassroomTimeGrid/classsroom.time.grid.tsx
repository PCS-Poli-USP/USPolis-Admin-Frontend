import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import {
  ClassroomEvent,
  ClassroomTimeGridProps,
} from './classroom.time.grid.interface';
import timeGridPlugin from '@fullcalendar/timegrid';
import ClassroomTimeGridEventContent from './classroom.time.grid.event.content';

function ClassroomTimeGrid({
  isOpen,
  onClose,
  clasroom,
}: ClassroomTimeGridProps) {
  function handleCloseModal() {
    onClose();
  }
  console.log(clasroom);
  const year = new Date().getFullYear(); // Obtém o ano atual
  const events: ClassroomEvent[] = [];
  if (clasroom) {
    clasroom.schedules.forEach((schedule) => {
      schedule.occurrences.forEach((occurrence) =>
        events.push({
          title: clasroom.name,
          date: occurrence.date,
          start: `${occurrence.date}T${occurrence.start_time}`,
          end: `${occurrence.date}T${occurrence.end_time}`,
          extendedProps: {
            name: schedule.reservation || schedule.subject || '',
            type: schedule.reservation
              ? 'Reserva'
              : schedule.subject
              ? 'Turma'
              : 'Não indentificado',
          },
        }),
      );
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} size={'4xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`Sala ${clasroom ? clasroom.name : ''}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box w={'full'} h={'full'}>
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView='timeGridWeek'
              locale={'pt-br'}
              slotMinTime='06:00'
              views={{
                timeGridWeek: {
                  slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
                  eventMaxStack: 1,
                  titleFormat: { year: 'numeric', month: 'long' },
                },
              }}
              eventColor='#408080'
              eventContent={ClassroomTimeGridEventContent}
              displayEventTime={false}
              displayEventEnd={false}
              validRange={{ start: `${year}-01-01`, end: `${year}-12-31` }} // Limita ao ano atual
              events={events}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleCloseModal}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ClassroomTimeGrid;
