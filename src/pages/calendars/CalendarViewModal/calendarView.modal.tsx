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
import {
  CalendarEvent,
  CalendarViewModalProps,
} from './calendarView.modal.interface';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import CalendarViewEventContent from './calendarView.event.content';

function CalendarViewModal(props: CalendarViewModalProps) {
  function handleCloseModal() {
    props.onClose();
  }
  const events: CalendarEvent[] = [];
  if (props.calendar) {
    props.calendar.categories.forEach((category) => {
      category.holidays.forEach((holiday) => {
        events.push({
          title: category.name,
          date: holiday.date,
          extendedProps: {
            name: holiday.name,
            created_by: category.created_by,
            category_name: category.name,
          },
        });
      });
    });
  }
  const year = new Date().getFullYear(); // Obtém o ano atual

  return (
    <Modal isOpen={props.isOpen} onClose={handleCloseModal} size={'4xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`Calendário ${props.calendar?.name}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box w={'full'} h={'full'}>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView='dayGridMonth'
              locale={'pt-br'}
              views={{
                multiMonthGrid: {
                  type: 'dayGrid',
                  duration: { months: 12 }, // Exibir 12 meses
                  buttonText: 'Ano',
                  titleFormat: {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'numeric',
                    year: 'numeric',
                  },
                },
              }}
              eventColor='#f19408'
              eventContent={CalendarViewEventContent}
              displayEventTime={false}
              displayEventEnd={false}
              validRange={{
                start: `${props.calendar ? props.calendar.year : year}-01-01`,
                end: `${props.calendar ? props.calendar.year : year}-12-31`,
              }}
              events={events}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleCloseModal} colorScheme='red'>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CalendarViewModal;
