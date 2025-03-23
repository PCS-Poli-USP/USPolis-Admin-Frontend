import { ClassResponse } from 'models/http/responses/class.response.models';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import {
  getClassClassroomMap,
  getSchedulesByClassroom,
  getSchedulesFromClasses,
  getSchedulesFromReservations,
} from '../utils';
import { useRef, useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import ClassroomCalendarPage from './classroom.calendar.page';

interface ClassroomsCalendarPDFProps {
  classes: ClassResponse[];
  reservations: ReservationResponse[];
  building: string;
  disabled: boolean;
}

function ClassroomsCalendarPDF(props: ClassroomsCalendarPDFProps) {
  const [loading] = useState(false);
  const calendarRefs = useRef<(HTMLDivElement | null)[]>([]);

  const schedulesMap = getSchedulesByClassroom(
    getSchedulesFromClasses(props.classes).concat(
      getSchedulesFromReservations(props.reservations),
    ),
  );
  const classrooms = Array.from(getClassClassroomMap(props.classes).keys());

  const sendCalendarsToPrint = () => {
    if (Array.from(calendarRefs.current.keys()).length === 0) {
      alert('Nenhum calendário encontrado!');
      return;
    }

    const calendarsHtml = calendarRefs.current
      .filter((calendar) => calendar !== null)
      .map((converted) => {
        if (!converted) return '';
        return converted.outerHTML;
      });

    localStorage.setItem('calendarsToPrint', JSON.stringify(calendarsHtml));
    window.open('/print/classroom-calendar', '_blank');
  };

  return (
    <Flex direction={'column'} w={'100%'}>
      <Button
        onClick={sendCalendarsToPrint}
        disabled={loading || props.disabled}
        isLoading={loading}
        fontWeight={'bold'}
        variant={'outline'}
        colorScheme={'blue'}
        color={'uspolis.blue'}
      >
        Baixar mapa de salas (calendários)
      </Button>
      <Flex direction={'column'} w={'100%'} display={'block'}>
        {classrooms.map((classroom, index) => (
          <div
            id={`calendar-pdf-page-${index}`}
            key={index}
            ref={(ref) => {
              calendarRefs.current[index] = ref;
            }}
          >
            <ClassroomCalendarPage
              index={1}
              schedules={schedulesMap.get(classroom) || []}
              classroom={classroom}
            />
          </div>
        ))}
      </Flex>
    </Flex>
  );
}

export default ClassroomsCalendarPDF;
