import {
  Box,
  Button,
  Center,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import DataTable from 'components/common/DataTable/dataTable.component';
import Loading from 'components/common/Loading/loading.component';
import Navbar from 'components/common/NavBar/navbar.component';
import { getReservationsColumns } from './Tables/reservation.table';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import ReservationModal from './ReservationModal/reservation.modal';
import { useState } from 'react';
import useClassrooms from 'hooks/useClassrooms';
import useBuildings from 'hooks/useBuildings';
import useReservations from 'hooks/useReservations';

function Reservations() {
  const {
    onClose: onCloseModal,
    onOpen: onOpenModal,
    isOpen: isOpenModal,
  } = useDisclosure();

  const { buildings } = useBuildings();
  const { classrooms } = useClassrooms();
  const { reservations, getReservations } = useReservations();

  const [selectedReservation, setSelectedReservation] =
    useState<ReservationResponse>();

  const columns = getReservationsColumns({
    handleEditClick: handleEditClick,
    handleDeleteClick: handleDeleteClick,
  });

  function handleEditClick(data: ReservationResponse) {
    setSelectedReservation(data);
  }

  function handleDeleteClick(data: ReservationResponse) {
    setSelectedReservation(data);
  }

  function handleRegisterClick() {
    onOpenModal();
  }

  return (
    <>
      <Navbar />
      <Loading
        isOpen={false}
        onClose={() => {
          return;
        }}
      />
      <Center>
        <Box p={4} w={'100%'} overflow='auto'>
          <Flex align='center'>
            <Text fontSize='4xl' mb={4}>
              Reservas
            </Text>
            <Spacer />
            <Button mr={2} colorScheme={'blue'} onClick={handleRegisterClick}>
              Adicionar Reserva
            </Button>
          </Flex>
          <ReservationModal
            onClose={onCloseModal}
            isOpen={isOpenModal}
            isUpdate={false}
            classrooms={classrooms}
            buildings={buildings}
            selectedReservation={selectedReservation}
            refetch={getReservations}
          />
          <DataTable data={reservations} columns={columns} />
        </Box>
      </Center>
    </>
  );
}

export default Reservations;
