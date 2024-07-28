import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react-use-disclosure';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DatePickerModal from 'components/allocation/datePicker.modal';
import EventContent from 'pages/allocation/EventContent/eventContent';
// import eventsByClassroomsPlugin from 'pages/allocation/plugins/EventsByClassrooms/eventsByClassrooms.plugin';
// import eventsByWeekPlugin from 'pages/allocation/plugins/EventsByWeek/eventsByWeek.plugin';
import Navbar from 'components/common/NavBar/navbar.component';
import Loading from 'components/common/Loading/loading.component';
import { appContext } from 'context/AppContext';
import { useContext, useRef, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { Event } from './interfaces/allocation.interfaces';
import useAllocation from 'pages/allocation/hooks/useAllocation';
import ClassesPDF from './pdf/ClassesPDF/classesPDF';
import ClassroomsPDF from './pdf/ClassroomsPDF/classroomsPDF';

function Allocation() {
  const { loading, setLoading } = useContext(appContext);
  const calendarRef = useRef<FullCalendar>(null!);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [nameSearchValue, setNameSearchValue] = useState('');
  const [classroomSearchValue, setClassroomSearchValue] = useState('');
  const {
    events,
    resources,
    classes,
    reservations,
  } = useAllocation();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);

  function setCalendarDate(ISOdate: string) {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.gotoDate(ISOdate);
  }

  function FilterEvents(name: string, classroom: string) {
    const nameValue = name.toLowerCase();
    const classroomValue = classroom.toLowerCase();
    if (name && classroom) {
      setFilteredEvents(
        events.filter((event) => {
          const nameFilterResult = event.title
            .toLowerCase()
            .includes(nameValue);
          const data =
            event.extendedProps.class_data ||
            event.extendedProps.reservation_data;
          const classroomFilterResult =
            data && data.classroom.toLowerCase().includes(classroomValue);
          return nameFilterResult && classroomFilterResult;
        }),
      );
    } else if (name && !classroom) {
      setFilteredEvents(
        events.filter((event) => event.title.toLowerCase().includes(nameValue)),
      );
    } else if (!name && classroom) {
      setFilteredEvents(
        events.filter((event) => {
          const data =
            event.extendedProps.class_data ||
            event.extendedProps.reservation_data;
          return data && data.classroom.toLowerCase().includes(classroomValue);
        }),
      );
    }
  }

  return (
    <>
      <Navbar />
      <Loading isOpen={loading} onClose={() => setLoading(false)} />

      <Grid
        templateAreas={`"header"
                        "main"`}
        gridTemplateRows={'1 1fr'}
        gridTemplateColumns={'1fr'}
      >
        <GridItem p={4} area={'header'} display='flex' alignItems='center'>
          <Text fontSize='4xl'>Alocações</Text>
          <Button ml={4} colorScheme='blue'>
            <PDFDownloadLink
              document={<ClassesPDF classes={classes} />}
              fileName='disciplinas.pdf'
            >
              {(params) =>
                params.loading ? 'Carregando PDF...' : 'Baixar alocação das disciplinas'
              }
            </PDFDownloadLink>
          </Button>
          <Button ml={4} colorScheme='blue'>
            <PDFDownloadLink
              document={
                <ClassroomsPDF
                  classes={classes}
                  reservations={reservations}
                />
              }
              fileName='salas.pdf'
            >
              {(params) =>
                params.loading ? 'Carregando PDF...' : 'Baixar alocação das salas'
              }
            </PDFDownloadLink>
          </Button>
        </GridItem>
        <GridItem px='2' pb='2' area={'main'} justifyContent='flex-end'>
          <Skeleton isLoaded={!loading} h='100vh' startColor='uspolis.blue'>
            <DatePickerModal
              isOpen={isOpen}
              onClose={onClose}
              onSelectDate={setCalendarDate}
            />

            <HStack mb={4} divider={<StackDivider />} justifyContent='flex-end'>
              <InputGroup w='fit-content'>
                <InputLeftElement pointerEvents='none'>
                  <BsSearch color='gray.300' />
                </InputLeftElement>
                <Input
                  type='text'
                  placeholder='Filtrar por nome'
                  value={nameSearchValue}
                  onChange={(event) => {
                    setNameSearchValue(event.target.value);
                    FilterEvents(event.target.value, classroomSearchValue);
                  }}
                />
              </InputGroup>

              <InputGroup w='fit-content'>
                <InputLeftElement pointerEvents='none'>
                  <BsSearch color='gray.300' />
                </InputLeftElement>
                <Input
                  type='text'
                  placeholder='Filtrar salas'
                  value={classroomSearchValue}
                  onChange={(event) => {
                    setClassroomSearchValue(event.target.value);
                    FilterEvents(nameSearchValue, event.target.value);
                  }}
                />
              </InputGroup>
            </HStack>
            <Box paddingBottom={4}>
              <FullCalendar
                ref={calendarRef}
                schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
                plugins={[
                  timeGridPlugin,
                  resourceTimelinePlugin,
                  rrulePlugin,
                  // eventsByClassroomsPlugin,
                  // eventsByWeekPlugin,
                ]}
                initialView='resourceTimelineDay'
                locale='pt-br'
                height='auto'
                slotMinTime='06:00'
                firstDay={1}
                headerToolbar={{
                  left: 'resourceTimelineDay timeGridWeek',
                  center: 'title',
                  right: 'goToDate prev,next today',
                }}
                buttonText={{
                  // eventsByClassrooms: 'Salas',
                  resourceTimelineDay: 'Sala / Dia',
                  // eventsByWeek: 'Sala / Semana',
                  timeGridWeek: 'Geral',
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
                    titleFormat: {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    },
                  },
                  // eventsByClassrooms: {
                  //   duration: { weeks: 1 },
                  // },
                  // eventsByWeek: {
                  //   duration: { weeks: 1 },
                  // },
                }}
                events={
                  nameSearchValue || classroomSearchValue
                    ? filteredEvents
                    : events
                }
                eventContent={EventContent}
                eventColor='#408080'
                displayEventTime
                resources={resources}
                resourceAreaWidth='10%'
                resourceGroupField='building'
                resourceAreaHeaderContent='Salas'
              />
            </Box>
          </Skeleton>
        </GridItem>
      </Grid>
    </>
  );
}

export default Allocation;