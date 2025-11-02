import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
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
import { classNumberFromClassCode } from '../../../utils/classes/classes.formatter';
import { Recurrence } from '../../../utils/enums/recurrence.enum';
import { WeekDay } from '../../../utils/enums/weekDays.enum';
import { MonthWeek } from '../../../utils/enums/monthWeek.enum';

function ClassroomTimeGrid({
  isOpen,
  onClose,
  classroom,
  preview,
  scheduleDetails,
  loading = false,
}: ClassroomTimeGridProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const [showWeekends, setShowWeekends] = useState(false);

  function handleCloseModal() {
    onClose();
  }
  const year = new Date().getFullYear(); // Obtém o ano atual
  const events: ClassroomEvent[] = preview.dates.map((date, idx) => ({
    title: classroom ? classroom.name : '',
    date,
    start: `${date}T${preview.start_times[idx]}`,
    end: `${date}T${preview.end_times[idx]}`,
    backgroundColor: '#ff7300',
    extendedProps: {
      name: preview.title,
      type: 'Reserva',
      start: preview.start_times[idx],
      end: preview.end_times[idx],
    },
  }));
  if (classroom) {
    classroom.schedules.forEach((schedule) => {
      if (schedule.allocated) {
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
                : schedule.subject && schedule.class_code
                  ? `Turma ${classNumberFromClassCode(schedule.class_code)}`
                  : 'Não indentificado',
              start: occurrence.start_time,
              end: occurrence.end_time,
            },
          }),
        );
      }
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

  function formatScheduleDetails() {
    const { recurrence, week_day, month_week } = scheduleDetails;
    if (recurrence && week_day && !month_week) {
      return `${Recurrence.translate(
        recurrence as Recurrence,
      )} às ${WeekDay.translate(week_day as WeekDay)}'s`;
    }
    if (recurrence && week_day && month_week) {
      return `${Recurrence.translate(
        recurrence as Recurrence,
      )}, às ${WeekDay.translate(
        week_day as WeekDay,
      )}'s no ${MonthWeek.translate(month_week as MonthWeek)} dia do mês`;
    }
    return Recurrence.translate(recurrence as Recurrence) || 'Não definido';
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} size={'5xl'}>
      <ModalOverlay />
      <ModalContent maxH={'90vh'} overflowY={'auto'}>
        <ModalHeader>{`Sala ${classroom ? classroom.name : ''} - ${
          classroom ? classroom.capacity : ''
        } capacidade`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box w={'full'} h={'full'}>
            <Flex
              direction={'row'}
              w={'100%'}
              gap={'20px'}
              justify={'space-between'}
            >
              <Box mb={'10px'}>
                <HStack>
                  <Text fontWeight={'bold'}>Legenda</Text>
                  <CircleIcon />
                  <Text>Já alocado</Text>
                  <CircleIcon color='#ff7300' />
                  <Text>Solicitado</Text>
                </HStack>
                <Text>
                  <b>Agenda:</b> {formatScheduleDetails()}
                </Text>
                <Text>
                  <b>Horário da Agenda:</b>{' '}
                  {preview.start_time ? preview.start_time : 'Não informado'}{' '}
                  até {preview.end_time ? preview.end_time : 'Não informado'}
                </Text>
                <Text fontWeight={'bold'}>
                  Datas e horários solicitados no rodapé do calendário
                </Text>
              </Box>
              <Button
                mb={'10px'}
                onClick={() => setShowWeekends((prev) => !prev)}
                leftIcon={showWeekends ? <ViewOffIcon /> : <ViewIcon />}
              >
                {showWeekends ? 'Ocultar' : 'Exibir'} finais de semana
              </Button>
            </Flex>
            <Skeleton isLoaded={!loading} w={'full'} h={'full'}>
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
                allDaySlot={false}
                validRange={{ start: `${year}-01-01`, end: `${year}-12-31` }} // Limita ao ano atual
                events={events}
                hiddenDays={showWeekends ? [1, 2, 3, 4, 5] : [0, 6]}
              />
            </Skeleton>
            <HStack>
              <Text fontWeight={'bold'}>Datas: </Text>
              <Text>
                {preview.dates.length > 0
                  ? preview.dates
                      .map(
                        (date, idx) =>
                          `${moment(date).format('DD/MM/YYYY')} (${preview.start_times[idx] || preview.start_time} - ${preview.end_times[idx] || preview.end_time})`,
                      )
                      .join(', ')
                  : 'Nenhuma data, verifique a agenda'}
              </Text>
            </HStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ClassroomTimeGrid;
