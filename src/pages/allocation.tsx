import {
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
  useToast,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react-use-disclosure';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'models/interfaces/serverResponses';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DatePickerModal from 'components/allocation/datePicker.modal';
import EventContent from 'components/allocation/dayView/eventContent';
import eventsByClassroomsPlugin from 'components/allocation/classromView/eventsByClassrooms.plugin';
import eventsByWeekPlugin from 'components/allocation/weekView/eventsByWeek.plugin';
import Navbar from 'components/common/navbar.component';
import Loading from 'components/common/loading.component';
import ClassesPDF from 'components/pdf/classesPDF';
import { appContext } from 'context/AppContext';
import { useContext, useEffect, useRef, useState } from 'react';
import AllocationService from 'services/api/events.service';
import EventsService from 'services/api/events.service';
import {
  AllocationEventsMapper,
  AllocationResourcesFromEventsMapper,
  FirstEventDate,
} from 'utils/mappers/allocation.mapper';
import Event from 'models/common/event.model';

import { BsSearch } from 'react-icons/bs';
import Dialog from 'components/common/dialog.component';
import AutomaticAllocationModal from 'components/allocation/automaticAllocation.modal';
import AllocationOptions from 'components/allocation/allocationOptions.modal';

function Allocation() {
  const [allocation, setAllocation] = useState<any[]>([]);
  const [filteredAllocation, setFilteredAllocation] = useState<any[]>([]);
  const [resources, setResources] = useState<{ id: string }[]>([]);
  const { loading, setLoading } = useContext(appContext);
  const calendarRef = useRef<FullCalendar>(null!);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenAllocOptions,
    onOpen: onOpenAllocOptions,
    onClose: onCloseAllocOptions,
  } = useDisclosure();
  const {
    isOpen: isOpenAllocModal,
    onOpen: onOpenAllocModal,
    onClose: onCloseAllocModal,
  } = useDisclosure();

  const [subjectSearchValue, setSubjectSearchValue] = useState('');
  const [classroomSearchValue, setClassroomSearchValue] = useState('');
  const [allocatedEvents, setAllocatedEvents] = useState<Event[]>([]);
  const [unallocatedEvents, setUnallocatedEvents] = useState<Event[]>([]);
  const [hasNoAllocation, setHasNoAllocation] = useState(false);

  const allocationService = new AllocationService();
  const eventsService = new EventsService();

  const toast = useToast();
  const toastSuccess = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Sucesso!',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const toastError = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Erro!',
      description: message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  function fetchData() {
    setLoading(true);
    Promise.all([allocationService.list()]).then((values) => {
      setAllocation(AllocationEventsMapper(values[0].data));
      setResources(AllocationResourcesFromEventsMapper(values[0].data));
      setCalendarDate(FirstEventDate(values[0].data).slice(0, 10));
      setLoading(false);
    });
    if (subjectSearchValue || classroomSearchValue)
      FilterAllocation(subjectSearchValue, classroomSearchValue);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  function setCalendarDate(ISOdate: string) {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.gotoDate(ISOdate);
  }

  function FilterAllocation(subjectValue: string, classroomValue: string) {
    if (subjectValue && classroomValue) {
      setFilteredAllocation(
        allocation.filter((data) => {
          const subjectResult = data.extendedProps.subject_code
            .toLowerCase()
            .includes(subjectValue.toLowerCase());
          const classroomResult = data.extendedProps.classroom
            .toLowerCase()
            .includes(classroomValue.toLowerCase());
          return subjectResult && classroomResult;
        }),
      );
    } else if (subjectValue && !classroomValue) {
      setFilteredAllocation(
        allocation.filter((data) => {
          return data.extendedProps.subject_code
            .toLowerCase()
            .includes(subjectValue.toLowerCase());
        }),
      );
    } else if (!subjectValue && classroomValue) {
      setFilteredAllocation(
        allocation.filter((data) => {
          return data.extendedProps.classroom
            .toLowerCase()
            .includes(classroomValue.toLowerCase());
        }),
      );
    }
  }

  function handleAllocClick() {
    onOpenAllocOptions();
  }

  function handleAllocLoad() {
    setLoading(true);
    eventsService
      .loadAllocations()
      .then((it) => {
        if (
          it.data.allocated_events.length === 0 &&
          it.data.unallocated_events.length === 0
        ) {
          setHasNoAllocation(true);
          return;
        }
        setAllocatedEvents(it.data.allocated_events);
        setUnallocatedEvents(it.data.unallocated_events);
        toastSuccess('Alocação carregada com sucesso!');
        onCloseAllocOptions();
        onOpenAllocModal();
        fetchData();
      })
      .catch((error) => {
        toastError(`Erro ao carregar alocação: ${error}`);
      })
      .finally(() => setLoading(false));
  }

  function handleAllocNew() {
    setLoading(true);
    eventsService
      .allocate()
      .then((it) => {
        setAllocatedEvents(it.data.allocated);
        setUnallocatedEvents(it.data.unallocated);
        setHasNoAllocation(false);
        onCloseAllocOptions();
        onOpenAllocModal();
        fetchData();
      })
      .catch(({ response }: AxiosError<ErrorResponse>) => {
        onCloseAllocModal();
        toastError(`Erro ao alocar turmas: ${response?.data.error}`);
        console.log(response?.data.error);
      })
      .finally(() => setLoading(false));
  }

  function handleDeleteClick() {
    onOpenDelete();
  }

  function handleDelete() {
    eventsService
      .deleteAllAllocations()
      .then((value) => {
        toastSuccess(`Foram removidas ${value.data} alocações!`);
        fetchData();
      })
      .catch((error) => {
        toastError(`Erro ao remover alocações: ${error}`);
      });
    onCloseDelete();
  }

  return (
    <>
      <Navbar />
      <Loading isOpen={loading} onClose={() => setLoading(false)} />
      <Dialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onConfirm={handleDelete}
        title={'Deseja remover todas alocações feitas'}
        warningText={
          'ATENÇÃO: AO CONFIRMAR QUALQUER ALOCAÇÃO SALVA SERÁ PERDIDA'
        }
      />

      <AllocationOptions
        isOpen={isOpenAllocOptions}
        hasError={hasNoAllocation}
        onLoad={handleAllocLoad}
        onNew={handleAllocNew}
        onClose={onCloseAllocOptions}
      />

      <AutomaticAllocationModal
        isOpen={isOpenAllocModal}
        onClose={onCloseAllocModal}
        allocatedEvents={allocatedEvents}
        unallocatedEvents={unallocatedEvents}
      />

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
              document={<ClassesPDF />}
              fileName='disciplinas.pdf'
            >
              {(params) =>
                params.loading ? 'Carregando PDF...' : 'Baixar alocação'
              }
            </PDFDownloadLink>
          </Button>
          <Button ml={2} colorScheme='blue' onClick={handleAllocClick}>
            Alocação Automática
          </Button>
          <Button ml={2} colorScheme='red' onClick={handleDeleteClick}>
            Remover Alocações
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
              plugins={[
                timeGridPlugin,
                resourceTimelinePlugin,
                eventsByClassroomsPlugin,
                eventsByWeekPlugin,
              ]}
              initialView='eventsByClassrooms'
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
                  titleFormat: {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  },
                },
                eventsByClassrooms: {
                  duration: { weeks: 1 },
                },
                eventsByWeek: {
                  duration: { weeks: 1 },
                },
              }}
              events={
                subjectSearchValue || classroomSearchValue
                  ? filteredAllocation
                  : allocation
              }
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
