import { Button, Flex, Spacer, useDisclosure } from '@chakra-ui/react';

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
import useClassroomsSolicitations from '../../hooks/solicitations/useSolicitations';
import PageHeaderWithFilter from '../../components/common/PageHeaderWithFilter';
import usePageHeaderWithFilter from '../../components/common/PageHeaderWithFilter/usePageHeaderWithFilter';

function Reservations() {
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

  const { buildings } = useBuildings();
  const { classrooms } = useClassrooms();
  const { loading, reservations, getReservations, deleteReservation } =
    useReservations();
  const {
    loading: loadingSolicitations,
    solicitations,
    getPendingBuildingSolicitations,
  } = useClassroomsSolicitations(false);
  const { start, setStart, end, setEnd } = usePageHeaderWithFilter();

  const [selectedReservation, setSelectedReservation] =
    useState<ReservationResponse>();
  const [isUpdate, setIsUpdate] = useState(false);

  const columns = getReservationsColumns({
    handleDuplicateClick: handleDuplicateClick,
    handleEditClick: handleEditClick,
    handleDeleteClick: handleDeleteClick,
  });

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
        classrooms={classrooms}
        buildings={buildings}
        selectedReservation={selectedReservation}
        refetch={() => getReservations()}
        solicitations={solicitations}
        loadingSolicitations={loadingSolicitations}
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
    </PageContent>
  );
}

export default Reservations;
