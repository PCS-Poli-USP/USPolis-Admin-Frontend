import { Box, Progress, useDisclosure } from '@chakra-ui/react';
import { useRef, useState } from 'react';

import FullCalendar from '@fullcalendar/react'; // must go before plugins
import { EventApi, DatesSetArg, EventDropArg } from '@fullcalendar/core';
import interactionPlugin, {
  DateClickArg,
  EventResizeDoneArg,
} from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import DatePickerModal from 'components/allocation/datePicker.modal';
import ViewPickerModal from './ViewPickerModal/view.picker.modal';
import EventContent from './EventContent/eventContent';
import { Resource, Event } from '../interfaces/allocation.interfaces';
import EventModal from './EventModal/event.modal';
import moment from 'moment';

type ViewOption = {
  value: string;
  label: string;
};

const viewOptions: ViewOption[] = [
  { value: 'resourceTimelineDay', label: 'Sala / Dia' },
  { value: 'resourceTimelineWeek', label: 'Sala / Semana' },
  { value: 'timeGridDay', label: 'Dia' },
  { value: 'timeGridWeek', label: 'Geral' },
];
interface CustomCalendarProps {
  events: Event[];
  resources: Resource[];
  hasBuildingFilter: boolean;
  handleDateClick: (info: DateClickArg) => void;
  handleEventDrop: (arg: EventDropArg) => void;
  handleEventResize: (arg: EventResizeDoneArg) => void;
  update: (start: string, end: string) => Promise<void>;
  start: string;
  setStart: (start: string) => void;
  end: string;
  setEnd: (end: string) => void;
  view: ViewOption;
  setView: (view: ViewOption) => void;
  isMobile: boolean;
  loading?: boolean;
}

function CustomCalendar({
  events,
  resources,
  hasBuildingFilter,
  handleDateClick,
  handleEventDrop,
  handleEventResize,
  update,
  start,
  setStart,
  end,
  setEnd,
  isMobile,
  view,
  setView,
  loading = false,
}: CustomCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null!);
  const [selectedEvent, setSelectedEvent] = useState<EventApi>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenViewPicker,
    onOpen: onOpenViewPicker,
    onClose: onCloseViewPicker,
  } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();

  function setCalendarDate(ISOdate: string) {
    setStart(ISOdate);
    setEnd(ISOdate);
    calendarRef.current.getApi().gotoDate(ISOdate);
  }

  function setCalendarView(view: string) {
    if (view === 'resourceTimelineDay' || view === 'timeGridDay') {
      setCalendarDate(new Date().toISOString());
    }
    const calendarAPI = calendarRef.current.getApi();
    calendarAPI.changeView(view);
  }

  const handleDatesSet = async (info: DatesSetArg) => {
    const newStart = moment(info.startStr).format('YYYY-MM-DD');
    const newEnd = moment(info.endStr).subtract(1, 'days').format('YYYY-MM-DD');
    if (start !== newStart || end !== newEnd) {
      setStart(newStart);
      setEnd(newEnd);
      await update(newStart, newEnd);
    }
  };

  const goNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
    }
  };

  const goPrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
    }
  };

  const formatedResources = resources.map((res) => {
    if (res.parentId === null) {
      const { parentId, ...rest } = res;
      return rest;
    }
    return res;
  });

  console.log(events.length);
  return (
    <Box paddingBottom={4} zIndex={-1}>
      <DatePickerModal
        isOpen={isOpen}
        onClose={onClose}
        onSelectDate={setCalendarDate}
      />
      <ViewPickerModal
        isOpen={isOpenViewPicker}
        onClose={onCloseViewPicker}
        options={viewOptions}
        view={view}
        onSelectView={(view) => {
          setCalendarView(view.value);
          setView(view);
        }}
      />
      <EventModal
        isOpen={isOpenModal}
        onClose={onCloseModal}
        event={selectedEvent}
      />
      {loading && <Progress size='sm' mb={'10px'} isIndeterminate />}

      <FullCalendar
        initialDate={start}
        ref={calendarRef}
        schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
        plugins={[
          interactionPlugin,
          timeGridPlugin,
          resourceTimelinePlugin,
          rrulePlugin,
        ]}
        selectable={true}
        editable={true}
        droppable={true}
        eventOverlap={true}
        nowIndicator={true}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        initialView={view.value}
        locale='pt-br'
        height='auto'
        slotMinTime='07:00'
        firstDay={1}
        headerToolbar={
          isMobile
            ? {
                left: 'goToView goToDate',
                center: 'title',
                right: 'customPrev,customNext',
              }
            : {
                left: 'resourceTLDayView resourceTLWeekView timeGridDayView timeGridWeekView',
                center: 'title',
                right: 'goToView goToDate customPrev,customNext today',
              }
        }
        customButtons={{
          goToView: {
            text: isMobile ? view.label : 'Escolher visualização',
            click: (_ev, _el) => {
              onOpenViewPicker();
            },
          },
          resourceTLDayView: {
            text: 'Sala / Dia',
            click: (_ev, _el) => {
              setCalendarView(viewOptions[0].value);
              setView(viewOptions[0]);
            },
          },
          resourceTLWeekView: {
            text: 'Sala / Semana',
            click: (_ev, _el) => {
              setCalendarView(viewOptions[1].value);
              setView(viewOptions[1]);
            },
          },
          timeGridDayView: {
            text: 'Dia',
            click: (_ev, _el) => {
              setCalendarView(viewOptions[2].value);
              setView(viewOptions[2]);
            },
          },
          timeGridWeekView: {
            text: 'Geral',
            click: (_ev, _el) => {
              setCalendarView(viewOptions[3].value);
              setView(viewOptions[3]);
            },
          },
          goToDate: {
            text: isMobile ? 'Data' : 'Escolher data',
            click: (_ev, _el) => onOpen(),
          },
          customPrev: {
            text: '<',
            click: goPrev, // Usa a função customizada
          },
          customNext: {
            text: '>',
            click: goNext, // Usa a função customizada
          },
        }}
        views={{
          timeGridWeek: {
            slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
            eventMaxStack: 1,
            titleFormat: isMobile
              ? {
                  year: 'numeric',
                  month: 'short',
                }
              : { year: 'numeric', month: 'long' },
          },
          timeGridDay: {
            slotDuration: '00:30',
            slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
            eventTimeFormat: { hour: '2-digit', minute: '2-digit' },
            titleFormat: isMobile
              ? {
                  day: '2-digit',
                  month: 'short',
                }
              : {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                },
          },
          resouceTimeLineWeek: {
            slotDuration: '01:00',
            duration: { days: 5 },
            slotLabelFormat: { hour: 'numeric', minute: 'numeric' },
            eventTimeFormat: { hour: '2-digit', minute: '2-digit' },
            titleFormat: isMobile
              ? {
                  day: '2-digit',
                  month: 'short',
                }
              : {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                },
          },
          resourceTimelineDay: {
            slotDuration: '01:00',
            slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
            eventTimeFormat: { hour: '2-digit', minute: '2-digit' },
            titleFormat: isMobile
              ? {
                  day: '2-digit',
                  month: 'short',
                }
              : {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                },
          },
        }}
        events={events}
        eventContent={EventContent}
        eventClick={(info) => {
          setSelectedEvent(info.event);
          onOpenModal();
        }}
        eventColor='#408080'
        displayEventTime
        resources={formatedResources}
        resourcesInitiallyExpanded={hasBuildingFilter}
        resourceAreaWidth='150px'
        resourceAreaHeaderContent='Prédios / Salas'
        datesSet={handleDatesSet}
      />
    </Box>
  );
}

export default CustomCalendar;
