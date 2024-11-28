import { Box, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

import FullCalendar from '@fullcalendar/react'; // must go before plugins
import { EventApi, DatesSetArg } from '@fullcalendar/core';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import DatePickerModal from 'components/allocation/datePicker.modal';
import ViewPickerModal from './ViewPickerModal/view.picker.modal';
import EventContent from './EventContent/eventContent';
import { Resource, Event } from '../interfaces/allocation.interfaces';
import EventModal from './EventModal/event.modal';
import moment from 'moment';

interface CustomCalendarProps {
  events: Event[];
  resources: Resource[];
  hasFilter: boolean;
  update: (start: string, end: string) => Promise<void>;
  date: string;
  setDate: (date: string) => void;
}

type ViewOption = {
  value: string;
  label: string;
};

const options: ViewOption[] = [
  { value: 'resourceTimelineDay', label: 'Sala / Dia' },
  { value: 'timeGridDay', label: 'Dia' },
  { value: 'timeGridWeek', label: 'Geral' },
];

function CustomCalendar({
  events,
  resources,
  hasFilter,
  update,
  date,
  setDate,
}: CustomCalendarProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const calendarRef = useRef<FullCalendar>(null!);
  const [currentView, setCurrentView] = useState<ViewOption>(options[0]);
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
    setDate(ISOdate);
    calendarRef.current.getApi().gotoDate(ISOdate);
  }

  function setCalendarView(view: string) {
    const calendarAPI = calendarRef.current.getApi();
    calendarAPI.changeView(view);
  }

  useEffect(() => {
    if (isMobile) {
      setCurrentView(options[1]);
      setCalendarView(options[1].value);
    } else {
      setCurrentView(options[0]);
      setCalendarView(options[0].value);
    }
  }, [isMobile]);

  const handleDatesSet = async (info: DatesSetArg) => {
    const actual = moment(info.startStr).format('YYYY-MM-DD');
    if (date !== actual) {
      setDate(actual);
      update(actual, actual);
    }
  };

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
        options={options}
        view={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          setCalendarView(view.value);
        }}
      />
      <EventModal
        isOpen={isOpenModal}
        onClose={onCloseModal}
        event={selectedEvent}
      />
      <FullCalendar
        initialDate={date}
        ref={calendarRef}
        schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
        plugins={[timeGridPlugin, resourceTimelinePlugin, rrulePlugin]}
        initialView={isMobile ? 'timeGridDay' : 'resourceTimelineDay'}
        locale='pt-br'
        height='auto'
        slotMinTime='07:00'
        firstDay={1}
        headerToolbar={
          isMobile
            ? {
                left: 'goToView goToDate',
                center: 'title',
                right: 'prev,next',
              }
            : {
                left: 'resourceTimelineDay timeGridDay timeGridWeek',
                center: 'title',
                right: 'goToDate prev,next today',
              }
        }
        buttonText={{
          resourceTimelineDay: 'Sala / Dia',
          timeGridDay: 'Dia',
          timeGridWeek: 'Geral',
          today: 'Hoje',
        }}
        customButtons={{
          goToView: {
            text: currentView.label,
            click: (_ev, _el) => onOpenViewPicker(),
          },
          goToDate: {
            text: isMobile ? 'Data' : 'Escolher data',
            click: (_ev, _el) => onOpen(),
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
        resources={resources}
        filterResourcesWithEvents={hasFilter}
        resourceAreaWidth='10%'
        resourceGroupField='building'
        resourceAreaHeaderContent='Salas'
        datesSet={handleDatesSet}
      />
    </Box>
  );
}

export default CustomCalendar;
