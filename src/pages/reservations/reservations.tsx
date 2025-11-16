import {
  Button,
  Flex,
  Spacer,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';

import DataTable from '../../components/common/DataTable/dataTable.component';
import Loading from '../../components/common/Loading/loading.component';
import { getReservationsColumns } from './Tables/reservation.table';
import { ReservationResponse } from '../../models/http/responses/reservation.response.models';
import { useEffect, useState } from 'react';
import useClassrooms from '../../hooks/classrooms/useClassrooms';
import useBuildings from '../../hooks/useBuildings';
import useReservations from '../../hooks/reservations/useReservations';
import ReservationModal from './ReservationModal/reservation.modal';
import Dialog from '../../components/common/Dialog/dialog.component';
import PageContent from '../../components/common/PageContent';
import useSolicitations from '../../hooks/solicitations/useSolicitations';
import PageHeaderWithFilter from '../../components/common/PageHeaderWithFilter';
import usePageHeaderWithFilter from '../../components/common/PageHeaderWithFilter/usePageHeaderWithFilter';
import useSubjects from '../../hooks/useSubjetcts';
import { ClassroomFullResponse } from '../../models/http/responses/classroom.response.models';
import ClassroomTimeGrid from '../../components/common/ClassroomTimeGrid/classroom.time.grid';

function Reservations() {
  const { colorMode } = useColorMode();

  const {
    onClose: onCloseModal,
    onOpen: onOpenModal,
    isOpen: isOpenModal,
  } = useDisclosure();
  const {
    onClose: onCloseDialog,
    onOpen: onOpenDialog,
    isOpen: isOpenDialog,
  } = useDisclosure();
  const {
    onClose: onCloseGrid,
    onOpen: onOpenGrid,
    isOpen: isOpenGrid,
  } = useDisclosure();

  const { buildings } = useBuildings();
  const {
    loading: loadingClassrooms,
    classrooms,
    listOneFull,
  } = useClassrooms();
  const { subjects, loading: loadingSubjects } = useSubjects();
  const { loading, reservations, getReservations, deleteReservation } =
    useReservations();
  const { getPendingBuildingSolicitations } = useSolicitations(false);
  const { start, setStart, end, setEnd } = usePageHeaderWithFilter();

  const [selectedReservation, setSelectedReservation] =
    useState<ReservationResponse>();
  const [classroom, setClassroom] = useState<ClassroomFullResponse>();
  const [isUpdate, setIsUpdate] = useState(false);
  const header = usePageHeaderWithFilter();

  const columns = getReservationsColumns({
    handleViewClick: handleViewClick,
    handleDuplicateClick: handleDuplicateClick,
    handleEditClick: handleEditClick,
    handleDeleteClick: handleDeleteClick,
    darkMode: colorMode === 'dark',
  });

  async function handleViewClick(data: ReservationResponse) {
    if (!data.classroom_id) return;
    setSelectedReservation(data);
    onOpenGrid();
    const cls = await listOneFull(data.classroom_id);
    setClassroom(cls);
  }

  function handleDuplicateClick(data: ReservationResponse) {
    setSelectedReservation(data);
    setIsUpdate(false);
    onOpenModal();
  }

  function handleEditClick(data: ReservationResponse) {
    setSelectedReservation(data);
    setIsUpdate(true);
    onOpenModal();
  }

  function handleDeleteClick(data: ReservationResponse) {
    setSelectedReservation(data);
    onOpenDialog();
  }

  function handleRegisterClick() {
    onOpenModal();
  }

  function handleDeleteConfirm() {
    if (selectedReservation) {
      deleteReservation(selectedReservation.id);
    }
    onCloseDialog();
    setSelectedReservation(undefined);
  }

  useEffect(() => {
    getPendingBuildingSolicitations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContent>
      <Loading
        isOpen={false}
        onClose={() => {
          return;
        }}
      />
      <Flex align='center' direction={'row'}>
        <PageHeaderWithFilter
          {...header}
          title='Reservas'
          start={start}
          end={end}
          setStart={setStart}
          setEnd={setEnd}
          onConfirm={(start, end) => {
            getReservations(start, end);
          }}
        />
        <Spacer />
        <Button
          mr={2}
          colorScheme={'blue'}
          onClick={handleRegisterClick}
          borderRadius={'10px'}
        >
          Adicionar Reserva
        </Button>
      </Flex>
      <ReservationModal
        onClose={() => {
          onCloseModal();
          setIsUpdate(false);
          setSelectedReservation(undefined);
        }}
        isOpen={isOpenModal}
        isUpdate={isUpdate}
        isSolicitation={false}
        classrooms={classrooms}
        buildings={buildings}
        selectedReservation={selectedReservation}
        refetch={() => getReservations()}
        subjects={subjects}
        loading={loadingSubjects}
      />
      <DataTable
        loading={loading}
        data={reservations}
        columns={columns}
        columnPinning={{
          left: [],
          right: ['options'],
        }}
      />
      <Dialog
        isOpen={isOpenDialog}
        onClose={() => {
          onCloseDialog();
          setSelectedReservation(undefined);
        }}
        title={`Excluir reserva ${selectedReservation?.title}`}
        onConfirm={handleDeleteConfirm}
        warningText={'Essa ação é irreversível!'}
      />
      <ClassroomTimeGrid
        isOpen={isOpenGrid}
        onClose={() => {
          setSelectedReservation(undefined);
          setClassroom(undefined);
          onCloseGrid();
        }}
        classroom={classroom}
        loading={loadingClassrooms}
        scheduleDetails={
          selectedReservation
            ? {
                recurrence: selectedReservation.schedule.recurrence,

                week_day: selectedReservation.schedule.week_day,

                month_week: selectedReservation.schedule.month_week,
              }
            : {
                recurrence: undefined,

                week_day: undefined,

                month_week: undefined,
              }
        }
        preview={{
          title: '',
          start_time: '',
          end_time: '',
          start_times: [],
          end_times: [],
          dates: [],
        }}
      />
    </PageContent>
  );
}

export default Reservations;
