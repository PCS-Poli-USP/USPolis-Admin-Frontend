import { Grid, GridItem, useDisclosure, useMediaQuery } from '@chakra-ui/react';
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
import { Resource } from 'models/http/responses/allocation.response.models';
import { DateClickArg } from '@fullcalendar/interaction';
import useBuildings from 'hooks/useBuildings';
import useClassrooms from 'hooks/useClassrooms';
import ReservationModal from 'pages/reservations/ReservationModal/reservation.modal';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { ReservationType } from 'utils/enums/reservations.enum';

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

function Allocation() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const { loading, setLoading, loggedUser } = useContext(appContext);

  const {
    isOpen: isOpenSolicitation,
    onOpen: onOpenSolicitation,
    onClose: onCloseSolicitation,
  } = useDisclosure();

  const {
    isOpen: isOpenReservation,
    onOpen: onOpenReservation,
    onClose: onCloseReservation,
  } = useDisclosure();
  const [reservation, setReservation] = useState<ReservationResponse>();

  const [buildingSearchValue, setBuildingSearchValue] = useState('');
  const [classroomSearchValue, setClassroomSearchValue] = useState('');
  const [nameSearchValue, setNameSearchValue] = useState('');
  const [classSearchValue, setClassSearchValue] = useState('');

  const [currentStartDate, setCurrentStartDate] = useState<string>(
    moment().format('YYYY-MM-DD'),
  );
  const [currentEndDate, setCurrentEndDate] = useState<string>(
    moment().format('YYYY-MM-DD'),
  );

  const [currentView, setCurrentView] = useState<ViewOption>(viewOptions[0]);

  const [clickedDate, setClickedDate] = useState<string>();

  const {
    loading: loadingAllocation,
    events,
    resources,
    getEvents,
  } = useAllocation();
  const {
    loading: loadingBuildings,
    buildings,
    getAllBuildings,
  } = useBuildings(false);
  const {
    loading: loadingClassrooms,
    classrooms,
    getAllClassrooms,
  } = useClassrooms(false);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [filteredResources, setFilteredResources] =
    useState<Resource[]>(resources);

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
          event.extendedProps.class_data?.code
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

  function handleDateClick(info: DateClickArg) {
    if (!loggedUser) return;
    const date = info.dateStr;
    setClickedDate(moment(date).format('YYYY-MM-DD'));
    const building = info.resource?._resource.parentId;
    const classroom = info.resource?._resource.title;
    if (building && classroom) {
      setReservation({
        id: 0,
        title: '',
        type: ReservationType.OTHER,
        updated_at: '',
        building_id:
          buildings.find((building_) => building_.name === building)?.id || 0,
        building_name: building,
        classroom_id:
          classrooms.find((classroom_) => classroom_.name === classroom)?.id ||
          0,
        classroom_name: classroom,
        schedule_id: 0,
        created_by_id: 0,
        created_by: '',
        has_solicitation: false,
        solicitation_id: undefined,
        schedule: {
          id: 0,
          week_day: undefined,
          month_week: undefined,
          start_date: moment(date).format('YYYY-MM-DD'),
          end_date: moment(date).format('YYYY-MM-DD'),
          start_time: moment(date).format('HH:mm'),
          end_time: moment(date).add(1, 'hour').format('HH:mm'),
          allocated: true,
          all_day: false,
          recurrence: Recurrence.CUSTOM,
          occurrences: [
            {
              id: 0,
              date: moment(date).format('YYYY-MM-DD'),
              start_time: moment(date).format('HH:mm'),
              end_time: moment(date).add(1, 'hour').format('HH:mm'),
              classroom_id: 0,
              classroom: classroom,
            },
          ],
          logs: [],
        },
      });
      onOpenReservation();
    }
  }

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

  useEffect(() => {
    if (isMobile) setCurrentView(viewOptions[2]);
  }, [isMobile]);

  useEffect(() => {
    if (loggedUser) {
      getAllBuildings();
      getAllClassrooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser]);

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
            events={
              buildingSearchValue ||
              classroomSearchValue ||
              nameSearchValue ||
              classSearchValue
                ? filteredEvents
                : events
            }
            buildingResources={resources
              .filter((resource) => !resource.parentId)
              .sort((a, b) => a.title.localeCompare(b.title))}
            classroomResources={resources.filter(
              (resource) => !!resource.parentId,
            )}
          />
        </GridItem>
        <GridItem px='2' pb='2' area={'main'} justifyContent='flex-end'>
          {loggedUser && (
            <SolicitationModal
              isMobile={isMobile}
              isOpen={isOpenSolicitation}
              onClose={onCloseSolicitation}
              buildings={buildings}
              classrooms={classrooms}
              loadingBuildings={loadingBuildings}
              loadingClassrooms={loadingClassrooms}
            />
          )}

          {loggedUser && (
            <ReservationModal
              isUpdate={false}
              classrooms={classrooms}
              buildings={buildings}
              refetch={() => {}}
              isOpen={isOpenReservation}
              onClose={onCloseReservation}
              selectedReservation={reservation}
              initialDate={clickedDate}
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
            handleDateClick={handleDateClick}
            hasFilter={!!classroomSearchValue}
            hasBuildingFilter={!!buildingSearchValue}
            update={async (start, end) => {
              if (loadingAllocation) return;
              await getEvents(start, end);
            }}
            start={currentStartDate}
            setStart={setCurrentStartDate}
            end={currentEndDate}
            setEnd={setCurrentEndDate}
            view={currentView}
            setView={setCurrentView}
            isMobile={isMobile}
            loading={loadingAllocation || loading}
          />
        </GridItem>
      </Grid>
    </PageContent>
  );
}
export default Allocation;
