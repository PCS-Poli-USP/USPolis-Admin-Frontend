import { ClassResponse } from '../../../../models/http/responses/class.response.models';
import { ReservationResponse } from '../../../../models/http/responses/reservation.response.models';
import {
  getSchedulesByClassroom,
  getSchedulesFromClasses,
  getSchedulesFromReservations,
} from '../utils';
import { Button, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  ClassroomCalendarEventsFromSchedules,
  MergedEvent,
} from './classroom.calendar.utils';
import { Recurrence } from '../../../../utils/enums/recurrence.enum';
import { DownloadIcon } from '@chakra-ui/icons';

export interface SavedClassroomCalendarPage {
  classroom: string;
  events: MergedEvent[];
  index: number;
  startDate: string;
  endDate: string;
}

interface ClassroomsCalendarPDFProps {
  classes: ClassResponse[];
  reservations: ReservationResponse[];
  building: string;
  disabled: boolean;
  loading: boolean;
  startDate: string;
  endDate: string;
}

function ClassroomsCalendarPDF(props: ClassroomsCalendarPDFProps) {
  const navigate = useNavigate();

  const schedules = getSchedulesFromClasses(props.classes).concat(
    getSchedulesFromReservations(
      props.reservations.filter(
        (val) => val.schedule.recurrence === Recurrence.WEEKLY,
      ),
    ),
  );
  const schedulesMap = getSchedulesByClassroom(schedules);
  const sorted = new Map(
    [...schedulesMap.entries()].sort((a, b) => a[0].localeCompare(b[0])),
  );
  const sendCalendarsToPrint = () => {
    if (Array.from(schedulesMap.keys()).length === 0) {
      alert('Nenhum calendário encontrado!');
      return;
    }

    const savedCalendars: SavedClassroomCalendarPage[] = [];
    let index = 1;
    sorted.forEach((schedules, classroom) => {
      const events = ClassroomCalendarEventsFromSchedules(schedules);
      savedCalendars.push({
        classroom,
        events,
        index,
        startDate: props.startDate,
        endDate: props.endDate,
      });
      index++;
    });

    localStorage.setItem('savedCalendars', JSON.stringify(savedCalendars));
    navigate('/print/classroom-calendar');
  };

  return (
    <Flex direction={'column'} w={'100%'}>
      <Button
        onClick={sendCalendarsToPrint}
        disabled={props.loading || props.disabled}
        isLoading={props.loading}
        fontWeight={'bold'}
        variant={'outline'}
        colorScheme={'blue'}
        color={'uspolis.text'}
        leftIcon={<DownloadIcon />}
      >
        Mapa de salas
      </Button>
    </Flex>
  );
}

export default ClassroomsCalendarPDF;
