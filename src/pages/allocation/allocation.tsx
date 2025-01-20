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
import Loading from 'components/common/Loading/loading.component';
import { appContext } from 'context/AppContext';
import { useContext, useRef, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { Event } from './interfaces/allocation.interfaces';
import useAllocation from 'pages/allocation/hooks/useAllocation';
import ClassesPDF from './pdf/ClassesPDF/classesPDF';
import ClassroomsPDF from './pdf/ClassroomsPDF/classroomsPDF';
import PageContent from 'components/common/PageContent';
import SolicitationModal from './SolicitationModal/solicitation.modal';
import CustomCalendar from './CustomCalendar';
import AllocationHeader from './AllocationHeader';
import moment from 'moment';
import { Resource } from 'models/http/responses/allocation.response.models';

function Allocation() {
  const { loading, setLoading } = useContext(appContext);
  const calendarRef = useRef<FullCalendar>(null!);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [nameSearchValue, setNameSearchValue] = useState('');
  const [classroomSearchValue, setClassroomSearchValue] = useState('');
  const { events, resources, classes, reservations } = useAllocation();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);

  function filterEvents(
    building: string,
    classroom: string,
    name: string,
    class_: string,
  ) {
    let newEvents = events;
    const buildingValue = building.toLowerCase();
    const classroomValue = classroom.toLowerCase();
    const nameValue = name.toLowerCase();
    const classValue = class_.toLowerCase();

    if (building) {
      newEvents = newEvents.filter((event) => {
        const data =
          event.extendedProps.class_data ||
          event.extendedProps.reservation_data;
        return data && data.building.toLowerCase().includes(buildingValue);
      });
    }
    if (classroom) {
      newEvents = newEvents.filter((event) => {
        const data =
          event.extendedProps.class_data ||
          event.extendedProps.reservation_data;
        return data && data.classroom.toLowerCase().includes(classroomValue);
      });
    }
    if (name) {
      newEvents = newEvents.filter((event) => {
        const nameFilterResult =
          event.title.toLowerCase().includes(nameValue) ||
          event.extendedProps.class_data?.subject_name
            .toLowerCase()
            .includes(nameValue);
        return nameFilterResult;
      });
    }
    if (classValue) {
      newEvents = newEvents.filter((event) => {
        const classFilterResult =
          event.extendedProps.class_data &&
          event.extendedProps.class_data?.code
            .toLowerCase()
            .includes(classValue);
        return classFilterResult;
      });
    }
    setFilteredEvents(newEvents);
  }

  useEffect(() => {
    if (!hasInitialFilter && resources.length > 0) {
      setBuildingSearchValue(resources[0].title);
      setHasInitialFilter(true);
    }
  }, [hasInitialFilter, resources]);

  useEffect(() => {
    if (buildingSearchValue) {
      const filtered = resources.filter(
        (resource) =>
          resource.title
            .toLowerCase()
            .includes(buildingSearchValue.toLowerCase()) ||
          (resource.parentId &&
            resource.parentId
              .toLowerCase()
              .includes(buildingSearchValue.toLowerCase())),
      );
      setFilteredResources(filtered);
    }
  }, [buildingSearchValue, resources]);

  useEffect(() => {
    filterEvents(
      buildingSearchValue,
      classroomSearchValue,
      nameSearchValue,
      classSearchValue,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    events,
    buildingSearchValue,
    classroomSearchValue,
    nameSearchValue,
    classSearchValue,
  ]);

  return (
    <PageContent>
      <Loading isOpen={loading} onClose={() => setLoading(false)} />

      <Grid
        templateAreas={`"header"
                        "main"`}
        gridTemplateRows={'1 1fr'}
        gridTemplateColumns={'1fr'}
      >
        <GridItem p={2} area={'header'} display='flex' alignItems='center'>
          <AllocationHeader
            isOpen={isOpenSolicitation}
            onOpen={onOpenSolicitation}
            onClose={onCloseSolicitation}
            buildingSearchValue={buildingSearchValue}
            setBuildingSearchValue={setBuildingSearchValue}
            classroomSearchValue={classroomSearchValue}
            setClassroomSearchValue={setClassroomSearchValue}
            nameSearchValue={nameSearchValue}
            setNameSearchValue={setNameSearchValue}
            classSearchValue={classSearchValue}
            setClassSearchValue={setClassSearchValue}
            events={events}
            buildingResources={resources.filter(
              (resource) => !resource.parentId,
            )}
            classroomResources={resources.filter(
              (resource) => !!resource.parentId,
            )}
          />
        </GridItem>
        <GridItem px='2' pb='2' area={'main'} justifyContent='flex-end'>
          <Skeleton isLoaded={!loading && !loadingAllocation} h='100vh'>
            {loggedUser && (
              <SolicitationModal
                isMobile={isMobile}
                isOpen={isOpenSolicitation}
                onClose={onCloseSolicitation}
              />
            )}

            <CustomCalendar
              events={
                buildingSearchValue ||
                classroomSearchValue ||
                nameSearchValue ||
                classSearchValue
                  ? filteredEvents
                  : events
              }
              resources={buildingSearchValue ? filteredResources : resources}
              hasFilter={!!classroomSearchValue}
              update={async (start, end) => {
                if (loadingAllocation) return;
                await getEvents(start, end);
              }}
              date={currentDate}
              setDate={setCurrentDate}
            />
          </Skeleton>
        </GridItem>
      </Grid>
    </PageContent>
  );
}

export default Allocation;
