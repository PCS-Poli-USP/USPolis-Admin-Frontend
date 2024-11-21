import {
  Grid,
  GridItem,
  Skeleton,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import Loading from 'components/common/Loading/loading.component';
import { appContext } from 'context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { Event } from './interfaces/allocation.interfaces';
import useAllocation from 'pages/allocation/hooks/useAllocation';
import PageContent from 'components/common/PageContent';
import SolicitationModal from './SolicitationModal/solicitation.modal';
import CustomCalendar from './CustomCalendar';
import AllocationHeader from './AllocationHeader';
import moment from 'moment';

function Allocation() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const { loading, setLoading, loggedUser } = useContext(appContext);

  const {
    isOpen: isOpenSolicitation,
    onOpen: onOpenSolicitation,
    onClose: onCloseSolicitation,
  } = useDisclosure();

  const [buildingSearchValue, setBuildingSearchValue] = useState('');
  const [classroomSearchValue, setClassroomSearchValue] = useState('');
  const [nameSearchValue, setNameSearchValue] = useState('');
  const [classSearchValue, setClassSearchValue] = useState('');

  const [currentDate, setCurrentDate] = useState<string>(
    moment().format('YYYY-MM-DD'),
  );

  const {
    loading: loadingAllocation,
    events,
    resources,
    getEvents,
  } = useAllocation();
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
    if (
      buildingSearchValue ||
      classroomSearchValue ||
      nameSearchValue ||
      classSearchValue
    ) {
      filterEvents(
        buildingSearchValue,
        classroomSearchValue,
        nameSearchValue,
        classSearchValue,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    buildingSearchValue,
    classroomSearchValue,
    nameSearchValue,
    classSearchValue,
  ]);

  return (
    <PageContent>
      <Loading
        isOpen={loading || loadingAllocation}
        onClose={() => setLoading(false)}
      />

      <Grid
        templateAreas={`"header"
                        "main"`}
        gridTemplateRows={'1 1fr'}
        gridTemplateColumns={'1fr'}
      >
        <GridItem
          p={2}
          area={'header'}
          display='flex'
          alignItems='center'
          zIndex={100}
        >
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
            // filterEvents={filterEvents}
            events={events}
            resources={resources}
          />
        </GridItem>
        <GridItem
          px='2'
          pb='2'
          area={'main'}
          justifyContent='flex-end'
          zIndex={1}
        >
          <Skeleton
            isLoaded={!loading && !loadingAllocation}
            h='100vh'
            // startColor='uspolis.blue'
          >
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
              resources={resources}
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
