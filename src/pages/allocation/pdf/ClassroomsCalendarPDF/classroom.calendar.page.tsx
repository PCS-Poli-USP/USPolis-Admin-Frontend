import { Heading } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import rrulePlugin from '@fullcalendar/rrule';
import adaptivePlugin from '@fullcalendar/adaptive';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ScheduleResponse } from 'models/http/responses/schedule.response.models';
import { useRef } from 'react';
import { ClassroomCalendarEventsFromSchedules } from './utils';
import ClassroomCalendarEventContent from './classroom.calendar.event.content';

interface ClassroomCalendarPageProps {
  schedules: ScheduleResponse[];
  classroom: string;
  index: number;
}

function ClassroomCalendarPage(props: ClassroomCalendarPageProps) {
  const calendarRef = useRef<FullCalendar>(null!);
  const events = ClassroomCalendarEventsFromSchedules(props.schedules);

  return (
    <div
      id={`calendar-pdf-${props.index}`}
      className='page-break'
      style={{
        width: '100%',
        maxHeight: '95vh',
        overflow: 'hidden',
        visibility: 'hidden',
        position: 'absolute',
        color: 'black',
      }}
    >
      <Heading size={'lg'} w={'full'} textAlign={'center'}>
        Sala {props.classroom}
      </Heading>
      <FullCalendar
        ref={calendarRef}
        schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
        plugins={[timeGridPlugin, rrulePlugin, adaptivePlugin]}
        stickyHeaderDates={false}
        initialView='timeGridWeek'
        dayHeaderContent={(args) =>
          args.date
            .toLocaleDateString('pt-BR', { weekday: 'short' })
            .toUpperCase()
        }
        locale={'pt-br'}
        height={'auto'}
        nowIndicator={false}
        headerToolbar={{
          left: '',
          center: '',
          right: '',
        }}
        firstDay={1}
        slotMinTime='07:00'
        views={{
          timeGridWeek: {
            slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
            eventMaxStack: 2,
            titleFormat: { weekday: 'long', day: 'numeric', month: 'long' },
          },
        }}
        eventColor='#000000'
        eventBackgroundColor='#000000'
        eventBorderColor='#000000'
        eventTextColor='#000000'
        eventContent={ClassroomCalendarEventContent}
        displayEventTime={true}
        displayEventEnd={true}
        events={events}
      />
    </div>
  );
}

export default ClassroomCalendarPage;
