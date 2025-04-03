import { Heading } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import rrulePlugin from '@fullcalendar/rrule';
import timeGridPlugin from '@fullcalendar/timegrid';
import ClassroomCalendarEventContent from './classroom.calendar.event.content';
import { MergedEvent } from 'pages/allocation/pdf/ClassroomsCalendarPDF/utils';

interface ClassroomCalendarPageProps {
  events: MergedEvent[];
  classroom: string;
  index: number;
}

function ClassroomCalendarPage(props: ClassroomCalendarPageProps) {
  const events = props.events;

  return (
    <div
      id={`calendar-pdf-${props.index}`}
      className='page-break'
      style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '100vh',
        overflow: 'hidden',
        visibility: 'visible',
        color: 'black',
      }}
    >
      <Heading size={'lg'} w={'full'} textAlign={'center'}>
        Sala {props.classroom}
      </Heading>
      <FullCalendar
        initialDate={events.length > 0 ? events[0].start : undefined}
        schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
        plugins={[timeGridPlugin, rrulePlugin]}
        stickyHeaderDates={false}
        initialView='timeGridWeek'
        dayHeaderContent={(args) =>
          args.date
            .toLocaleDateString('pt-BR', { weekday: 'short' })
            .toUpperCase()
        }
        locale={'pt-br'}
        allDaySlot={false}
        hiddenDays={[0]} // Hidden Sunday
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
            slotMinTime: '07:00:00',
            slotMaxTime: '23:00:00',
            slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
            eventMaxStack: 2,
            titleFormat: { weekday: 'long', day: 'numeric', month: 'long' },
          },
        }}
        eventColor='#000000'
        eventBackgroundColor='#ffffff'
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
