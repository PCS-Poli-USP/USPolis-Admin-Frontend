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
  useMediaQuery,
} from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import {
  ClassroomEvent,
  ClassroomTimeGridProps,
} from './classroom.time.grid.interface';
import timeGridPlugin from '@fullcalendar/timegrid';
import ClassroomTimeGridEventContent from './classroom.time.grid.event.content';
import moment from 'moment';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

function ClassroomTimeGrid({
  isOpen,
  onClose,
  classroom,
  preview,
}: ClassroomTimeGridProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const [showWeekends, setShowWeekends] = useState(false);

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
          <Button
            mb={'10px'}
            onClick={() => setShowWeekends((prev) => !prev)}
            leftIcon={showWeekends ? <ViewOffIcon /> : <ViewIcon />}
          >
            {showWeekends ? 'Ocultar' : 'Exibir'} finais de semana
          </Button>
          <Box w={'full'} h={'full'}>
            {isMobile && (
              <Box mb={'10px'}>
                <HStack>
                  <Text fontWeight={'bold'}>Legenda: </Text>
                  <CircleIcon />
                  <Text>Já alocado</Text>
                  <CircleIcon color='#ff7300' />
                  <Text>Solicitado</Text>
                </HStack>
                <HStack>
                  <Text fontWeight={'bold'}>Datas: </Text>
                  <Text>
                    {preview.dates
                      .map((date) => moment(date).format('DD/MM/YYYY'))
                      .join(', ')}
                  </Text>
                </HStack>
              </Box>
            )}
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView='timeGridWeek'
              initialDate={
                preview.dates.length > 0 ? preview.dates[0] : undefined
              }
              locale={'pt-br'}
              height={'auto'}
              firstDay={1}
              slotMinTime='07:00'
              views={{
                timeGridWeek: {
                  slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
                  eventMaxStack: 1,
                  titleFormat: isMobile
                    ? { year: 'numeric', month: 'short' }
                    : { year: 'numeric', month: 'long' },
                },
              }}
              eventColor='#408080'
              eventContent={ClassroomTimeGridEventContent}
              displayEventTime={false}
              displayEventEnd={false}
              validRange={{ start: `${year}-01-01`, end: `${year}-12-31` }} // Limita ao ano atual
              events={events}
              // weekends={showWeekends}
              hiddenDays={showWeekends ? [1, 2, 3, 4, 5] : [0, 6]}
            />
            {!isMobile && (
              <>
                <HStack>
                  <Text fontWeight={'bold'}>Legenda: </Text>
                  <CircleIcon />
                  <Text>Já alocado</Text>
                  <CircleIcon color='#ff7300' />
                  <Text>Solicitado</Text>
                </HStack>
                <HStack>
                  <Text fontWeight={'bold'}>Datas: </Text>
                  <Text>
                    {preview.dates
                      .map((date) => moment(date).format('DD/MM/YYYY'))
                      .join(', ')}
                  </Text>
                </HStack>
              </>
            )}
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
