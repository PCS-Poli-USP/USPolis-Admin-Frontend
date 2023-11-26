import { Button, Checkbox, Flex, Grid, GridItem, HStack, Input, InputGroup, InputLeftElement, Skeleton, StackDivider, Text, extendTheme } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react-use-disclosure';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DatePickerModal from 'components/allocation/datePicker.modal';
import EventContent from 'components/allocation/eventContent';
import eventsByClassroomsPlugin from 'components/allocation/classromView/eventsByClassrooms.plugin';
import eventsByWeekPlugin from 'components/allocation/weekView/eventsByWeek.plugin';
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

import { BsSearch } from "react-icons/bs";

function Allocation() {
  const [allocation, setAllocation] = useState<any[]>([]);
  const [filteredAllocation, setFilteredAllocation] = useState<any[]>([]);
  const [resources, setResources] = useState<{ id: string }[]>([]);
  const { loading, setLoading } = useContext(appContext);
  const calendarRef = useRef<FullCalendar>(null!);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [subjectSearchValue, setSubjectSearchValue] = useState('');
  const [classroomSearchValue, setClassroomSearchValue] = useState('');

  const allocationService = new AllocationService();

  useEffect(() => {
    setLoading(true);
    Promise.all([allocationService.list()]).then((values) => {
      setAllocation(AllocationEventsMapper(values[0].data));
      setResources(AllocationResourcesFromEventsMapper(values[0].data));
      setCalendarDate(FirstEventDate(values[0].data).slice(0, 10));
      setLoading(false);
    });
    if (subjectSearchValue || classroomSearchValue) FilterAllocation(subjectSearchValue, classroomSearchValue);
    // eslint-disable-next-line
  }, []);

  function setCalendarDate(ISOdate: string) {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.gotoDate(ISOdate);
  }

  function FilterAllocation(subjectValue: string, classroomValue: string) {
    if (subjectValue && classroomValue) {
      setFilteredAllocation(allocation.filter((data) => {
        const subjectResult = data.extendedProps.subjectCode.toLowerCase().includes(subjectValue.toLowerCase());
        const classroomResult = data.extendedProps.classroom.toLowerCase().includes(classroomValue.toLowerCase())
        return subjectResult && classroomResult;
      }));
    }

    else if (subjectValue && !classroomValue) {
      setFilteredAllocation(allocation.filter((data) => {
        return data.extendedProps.subjectCode.toLowerCase().includes(subjectValue.toLowerCase());
      }));
    }

    else if (!subjectValue && classroomValue) {
      setFilteredAllocation(allocation.filter((data) => {
        return data.extendedProps.classroom.toLowerCase().includes(classroomValue.toLowerCase());
      }));
    }
  }

  function handleSubjectInputChange(value: string) {
    setSubjectSearchValue(value);
  }

  function handleClassroomInputChange(value: string) {
    setClassroomSearchValue(value);
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
        <GridItem px='2' pb='2' area={'main'} justifyContent='flex-end'>
          <Skeleton isLoaded={!loading} h='100vh' startColor='uspolis.blue'>
            <DatePickerModal isOpen={isOpen} onClose={onClose} onSelectDate={setCalendarDate} />
  
            <HStack mb={4} divider={<StackDivider />} justifyContent='flex-end' >
              <InputGroup w='fit-content'>
                <InputLeftElement pointerEvents='none'>
                  <BsSearch color='gray.300' />
                </InputLeftElement>
                <Input 
                  type='text' 
                  placeholder='Filtrar disciplinas' 
                  value={subjectSearchValue} 
                  onChange={(event) => {
                    setSubjectSearchValue(event.target.value);
                    FilterAllocation(event.target.value, classroomSearchValue);
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
                    FilterAllocation(subjectSearchValue, event.target.value);
                  }}
                />
              </InputGroup>

              {/* <Button colorScheme='red' onClick={() => {
                setSubjectSearchValue('');
                setClassroomSearchValue('');
              }}>
                  Limpar filtro
              </Button> */}
            </HStack>
            
            <FullCalendar
              ref={calendarRef}
              schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
              plugins={[timeGridPlugin, resourceTimelinePlugin, eventsByClassroomsPlugin, eventsByWeekPlugin]}
              initialView='eventsByWeek'
              locale='pt-br'
              height='auto'
              slotMinTime='06:00'
              firstDay={1}

              headerToolbar={{
                left: 'eventsByClassrooms resourceTimelineDay eventsByWeek timeGridWeek',
                center: 'title',
                right: 'goToDate prev,next today',
              }}

              buttonText={{
                eventsByClassrooms: 'Salas',
                resourceTimelineDay: 'Sala / Dia',
                eventsByWeek: 'Sala / Semana',
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
                  titleFormat: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' },
                },
                eventsByClassrooms: {
                  duration: { weeks: 1 },
                },
                eventsByWeek: {
                  duration: { weeks: 1},
                },
              }}
              
              events={subjectSearchValue || classroomSearchValue ? filteredAllocation : allocation}
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
