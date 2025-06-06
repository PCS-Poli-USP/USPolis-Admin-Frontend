import { Grid, GridItem, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import Loading from '../../components/common/Loading/loading.component';
import { appContext } from '../../context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { Event } from './interfaces/allocation.interfaces';
import useAllocation from '../../pages/allocation/hooks/useAllocation';
import PageContent from '../../components/common/PageContent';
import SolicitationModal from './SolicitationModal/solicitation.modal';
import CustomCalendar from './CustomCalendar';
import AllocationHeader from './AllocationHeader';
import moment from 'moment';
import { Resource } from '../../models/http/responses/allocation.response.models';
import { DateClickArg, EventResizeDoneArg } from '@fullcalendar/interaction';
import useBuildings from '../../hooks/useBuildings';
import useClassrooms from '../../hooks/classrooms/useClassrooms';
import ReservationModal from '../../pages/reservations/ReservationModal/reservation.modal';
import { ReservationResponse } from '../../models/http/responses/reservation.response.models';
import { loadReservationForDataClick } from './utils/allocation.utils';
import useClassroomsSolicitations from '../../hooks/useClassroomSolicitations';
import { EventDropArg } from '@fullcalendar/core';
import EventDragModal from './EventDragModal';
import { EventDef } from '@fullcalendar/core/internal';

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

  const {
    isOpen: isOpenEventModal,
    onOpen: onOpenEventModal,
    onClose: onCloseEventModal,
  } = useDisclosure();

  const [reservation, setReservation] = useState<ReservationResponse>();
  const [buildingSearchValue, setBuildingSearchValue] = useState('');
  const [classroomSearchValue, setClassroomSearchValue] = useState('');
  const [nameSearchValue, setNameSearchValue] = useState('');
  const [classSearchValue, setClassSearchValue] = useState('');

  const [currentStartDate, setCurrentStartDate] = useState<string>(
    moment().startOf('isoWeek').format('YYYY-MM-DD'),
  );
  const [currentEndDate, setCurrentEndDate] = useState<string>(
    moment().endOf('isoWeek').format('YYYY-MM-DD'),
  );

  const [currentView, setCurrentView] = useState<ViewOption>(viewOptions[3]);

  const [clickedDate, setClickedDate] = useState<string>();
  const [dragEvent, setDragEvent] = useState<EventDropArg>();

  const {
    loading: loadingAllocation,
    loadingE,
    loadingR,
    events,
    resources,
    getEvents,
  } = useAllocation(true, true, currentStartDate, currentEndDate);
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
  const {
    loading: loadingSolicitations,
    solicitations,
    getPendingBuildingSolicitations,
  } = useClassroomsSolicitations(false);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [filteredResources, setFilteredResources] =
    useState<Resource[]>(resources);

  function filterEvents(
    building: string,
    classroom: string,
    name: string,
    class_: string,
  ) {
    let newEvents = [...events];
    const buildingValue = building.toLowerCase();
    const classroomValue = classroom.toLowerCase();
    const nameValue = name.toLowerCase();
    const classValue = class_.toLowerCase();

    if (building) {
      newEvents = newEvents.filter((event) => {
        const data =
          event.extendedProps.class_data ||
          event.extendedProps.reservation_data;
        return data && data.building.toLowerCase() === buildingValue;
      });
    }
    if (classroom) {
      newEvents = newEvents.filter((event) => {
        const data =
          event.extendedProps.class_data ||
          event.extendedProps.reservation_data;
        return data && data.classroom.toLowerCase() === classroomValue;
      });
    }
    if (name) {
      newEvents = newEvents.filter((event) => {
        const nameFilterResult =
          event.title.toLowerCase() === nameValue ||
          event.extendedProps.class_data?.code.toLowerCase() === nameValue;
        return nameFilterResult;
      });
    }
    if (classValue) {
      newEvents = newEvents.filter((event) => {
        const classFilterResult =
          event.extendedProps.class_data &&
          event.extendedProps.class_data?.code.toLowerCase() === classValue;
        return classFilterResult;
      });
    }
    setFilteredEvents(newEvents);
  }

  function handleDateClick(info: DateClickArg) {
    if (!loggedUser) return;
    if (!loggedUser.buildings) return;
    const date = info.dateStr;
    setClickedDate(moment(date).format('YYYY-MM-DD'));
    const building = info.resource?._resource.parentId;
    const classroom = info.resource?._resource.title;
    if (building) {
      if (
        !loggedUser.is_admin &&
        !loggedUser.buildings.map((value) => value.name).includes(building)
      )
        return;
      if (classroom) {
        setReservation(
          loadReservationForDataClick(
            classroom,
            building,
            date,
            classrooms,
            buildings,
          ),
        );
        onOpenReservation();
      }
    }
  }

  function checkUserAuthorization(event: EventDef) {
    if (!loggedUser) return false;
    if (!loggedUser.buildings && !loggedUser.is_admin) return false;
    if (!event.resourceIds) return false;
    const values = event.resourceIds;
    if (values.length === 0) return false;
    const splited = values[0].split('-');
    if (splited.length === 1) return false;
    const building = splited[0];
    if (!loggedUser.is_admin) {
      if (
        loggedUser.buildings &&
        !loggedUser.buildings.find((val) => val.name === building)
      )
        return false;
    }
    return true;
  }

  function handleEventDrop(arg: EventDropArg) {
    if (
      currentView.value !== 'resourceTimelineDay' &&
      currentView.value !== 'resourceTimelineWeek'
    ) {
      arg.revert();
      return;
    }
    if (!checkUserAuthorization(arg.event._def)) {
      arg.revert();
      return;
    }
    setDragEvent(arg);
    onOpenEventModal();
  }

  function handleEventResize(arg: EventResizeDoneArg) {
    arg.revert();
  }

  useEffect(() => {
    let filtered = [...resources];
    if (buildingSearchValue) {
      filtered = filtered.filter(
        (resource) =>
          resource.title
            .toLowerCase()
            .includes(buildingSearchValue.toLowerCase()) ||
          (resource.parentId &&
            resource.parentId
              .toLowerCase()
              .includes(buildingSearchValue.toLowerCase())),
      );
    }
    if (classroomSearchValue) {
      filtered = filtered.filter(
        (resource) =>
          resource.title
            .toLowerCase()
            .includes(classroomSearchValue.toLowerCase()) || !resource.parentId,
      );
    }
    setFilteredResources(filtered);
  }, [buildingSearchValue, classroomSearchValue, resources]);

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
    if (loggedUser) {
      getAllBuildings();
      getAllClassrooms();
      if (loggedUser.is_admin || loggedUser.buildings) {
        getPendingBuildingSolicitations();
      }
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
        w={'calc(100% - 0rem)'}
        id='allocation-grid'
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
              refetch={async () => {
                if (loggedUser.is_admin || loggedUser.buildings) {
                  await getPendingBuildingSolicitations();
                }
              }}
            />
          )}
          {loggedUser && (
            <EventDragModal
              isOpen={isOpenEventModal}
              onClose={onCloseEventModal}
              dragEvent={dragEvent}
              handleCancel={() => {
                if (dragEvent) {
                  dragEvent.revert();
                  setDragEvent(undefined);
                }
              }}
              refetch={async () => {
                await getEvents(currentStartDate, currentEndDate);
              }}
            />
          )}

          {loggedUser && (
            <ReservationModal
              isUpdate={false}
              classrooms={classrooms}
              buildings={buildings}
              refetch={() => {
                getEvents(currentStartDate, currentEndDate);
              }}
              isOpen={isOpenReservation}
              onClose={onCloseReservation}
              selectedReservation={reservation}
              initialDate={clickedDate}
              solicitations={solicitations}
              loadingSolicitations={loadingSolicitations}
            />
          )}

          <CustomCalendar
            events={
              !!buildingSearchValue ||
              !!classroomSearchValue ||
              !!nameSearchValue ||
              !!classSearchValue
                ? filteredEvents
                : events
            }
            resources={
              !!buildingSearchValue || !!classroomSearchValue
                ? filteredResources
                : resources
            }
            handleDateClick={handleDateClick}
            handleEventDrop={handleEventDrop}
            handleEventResize={handleEventResize}
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
            loading={loadingAllocation || loading || loadingE || loadingR}
          />
        </GridItem>
      </Grid>
    </PageContent>
  );
}
export default Allocation;
