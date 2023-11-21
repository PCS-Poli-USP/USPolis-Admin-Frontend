import { Button, Grid, GridItem, Skeleton, Text } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react-use-disclosure';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DatePickerModal from 'components/allocation/datePicker.modal';
import EventContent from 'components/allocation/eventContent';
import eventsByClassroomsPlugin from 'components/allocation/eventsByClassrooms.plugin';
import Navbar from 'components/common/navbar.component';
import ClassesPDF from 'components/pdf/classesPDF';
import { appContext } from 'context/AppContext';
import { useContext, useEffect, useRef, useState } from 'react';
import AllocationService from 'services/events.service';
import {
  AllocationEventsMapper,
  AllocationResourcesFromEventsMapper,
  FirstEventDate,
} from 'utils/mappers/allocation.mapper';

function Allocation() {
  const [allocation, setAllocation] = useState<any[]>([]);
  const [resources, setResources] = useState<{ id: string }[]>([]);
  const { loading, setLoading } = useContext(appContext);
  const calendarRef = useRef<FullCalendar>(null!);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const allocationService = new AllocationService();

  useEffect(() => {
    setLoading(true);
    Promise.all([allocationService.list()]).then((values) => {
      setAllocation(AllocationEventsMapper(values[0].data));
      setResources(AllocationResourcesFromEventsMapper(values[0].data));
      setCalendarDate(FirstEventDate(values[0].data).slice(0, 10));
      setLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  function setCalendarDate(ISOdate: string) {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.gotoDate(ISOdate);
  }
  return (
    <>
      <Navbar />
      <Grid
        templateAreas={`"header"
                        "main"`}
        gridTemplateRows={'1 1fr'}
        gridTemplateColumns={'1fr'}
      >
        <GridItem p={4} area={'header'} display='flex' alignItems='center'>
          <Text fontSize='4xl'>Alocações</Text>
          <Button ml={4} colorScheme='blue'>
            <PDFDownloadLink document={<ClassesPDF />} fileName='disciplinas.pdf'>
              {(params) => (params.loading ? 'Carregando PDF...' : 'Baixar alocação')}
            </PDFDownloadLink>
          </Button>
        </GridItem>
        <GridItem px='2' pb='2' area={'main'}>
          <Skeleton isLoaded={!loading} h='100vh' startColor='uspolis.blue'>
            <DatePickerModal isOpen={isOpen} onClose={onClose} onSelectDate={setCalendarDate} />
            <FullCalendar
              ref={calendarRef}
              schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
              plugins={[timeGridPlugin, resourceTimelinePlugin, eventsByClassroomsPlugin]}
              initialView='resourceTimelineWeek'
              locale='pt-br'
              height='auto'
              slotMinTime='06:00'
              firstDay={1}

              headerToolbar={{
                left: 'eventsByClassrooms resourceTimelineDay resourceTimelineWeek timeGridWeek',
                center: 'title',
                right: 'goToDate prev,next today',
              }}

              buttonText={{
                eventsByClassrooms: 'Salas',
                timeGridWeek: 'Geral',
                resourceTimelineDay: 'Sala / Dia',
                resourceTimelineWeek: 'Sala / Semana',
                today: 'Hoje',
              }}
              
              customButtons={{
                goToDate: {
                  text: 'Escolher data',
                  click: (_ev, _el) => onOpen(),
                },
              }}

              views={{
                timeGridWeek: {
                  slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
                  eventMaxStack: 1,
                  titleFormat: { year: 'numeric', month: 'long' },
                },
                resourceTimelineDay: {
                  slotDuration: '01:00',
                  slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
                  eventTimeFormat: { hour: '2-digit', minute: '2-digit' },
                  titleFormat: { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' },
                },
                resourceTimelineWeek: {
                  duration: { weeks: 1 },
                  eventMinWidth: 100,
                  slotDuration: '24:00',
                  slotLabelFormat: [
                    { weekday: 'long', day: 'numeric', month: 'numeric', omitCommas: true},
                  ],
                  slotLabelInterval: { hours: 24},
                  titleFormat: { year: 'numeric', month: 'long' },
                  eventTimeFormat: { hour: 'numeric', minute: 'numeric' },
                },
                eventsByClassrooms: {
                  duration: { weeks: 1 },
                },
              }}
              
              events={allocation}
              eventContent={EventContent}
              eventColor='#408080'
              displayEventTime
              resources={resources}
              resourceAreaWidth='10%'
              resourceGroupField='building'
              resourceAreaHeaderContent='Salas'
            />
          </Skeleton>
        </GridItem>
      </Grid>
    </>
  );
}

export default Allocation;
