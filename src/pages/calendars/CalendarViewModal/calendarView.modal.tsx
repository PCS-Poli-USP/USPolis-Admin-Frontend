import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { CalendarViewModalProps } from './calendarView.modal.interface';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import CalendarViewEventContent from './calendarView.event.content';

interface EventType {
  title: string;
  date: string;
  created_by: string;
}

function CalendarViewModal(props: CalendarViewModalProps) {
  function handleCloseModal() {
    props.onClose();
  }
  let events: EventType[] = [];
  if (props.calendar) {
    props.calendar.categories.forEach((category) => {
      category.holidays.forEach((holiday) => {
        events.push({
          title: category.name,
          date: holiday.date,
          created_by: category.created_by,
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

export default CalendarViewModal;
