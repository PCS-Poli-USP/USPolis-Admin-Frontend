import {
  Box,
  Button,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
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
  classroom,
  preview,
}: ClassroomTimeGridProps) {
  function handleCloseModal() {
    onClose();
  }
  const year = new Date().getFullYear(); // Obtém o ano atual
  const events: ClassroomEvent[] = preview.dates.map((date) => ({
    title: classroom ? classroom.name : '',
    date,
    start: `${date}T${preview.start_time}`,
    end: `${date}T${preview.end_time}`,
    backgroundColor: '#ff7300',
    extendedProps: {
      name: preview.title,
      type: 'Reserva',
      start: preview.start_time,
      end: preview.end_time,
    },
  }));
  if (classroom) {
    classroom.schedules.forEach((schedule) => {
      schedule.occurrences.forEach((occurrence) =>
        events.push({
          title: classroom.name,
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
            start: occurrence.start_time,
            end: occurrence.end_time,
          },
        }),
      );
    });
  }

  interface CircleIconProps {
    color?: string;
  }

  const CircleIcon = ({ color = '#408080' }: CircleIconProps) => (
    <Icon viewBox='0 0 200 200' color={color}>
      <path
        fill='currentColor'
        d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
      />
    </Icon>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} size={'4xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`Sala ${classroom ? classroom.name : ''} - ${
          classroom ? classroom.capacity : ''
        } capacidade`}</ModalHeader>
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
            <HStack>
              <Text fontWeight={'bold'}>Legenda: </Text>
              <CircleIcon />
              <Text>Já alocado</Text>
              <CircleIcon color='#ff7300' />
              <Text>Solicitado</Text>
            </HStack>
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
