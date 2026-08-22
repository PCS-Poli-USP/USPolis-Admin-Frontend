import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ReservationFullResponse, ReservationResponse } from '../../../models/http/responses/reservation.response.models';
import { ModalProps } from '../../../models/interfaces';
import { useEffect, useState } from 'react';
import useReservations from '../../../hooks/reservations/useReservations';
import ReservationScheduleAccordion from './reservations.occurence.editor';

interface ReservationOccurrencesModalProps extends ModalProps {
  selectedReservation: ReservationResponse;
  refetch: () => void;
}

export default function ReservationOccurrencesModal({
  selectedReservation,
  isOpen,
  onClose,
  refetch,
}: ReservationOccurrencesModalProps) {
  const [reservationFull, setReservationFull] = useState<ReservationFullResponse | undefined>(
    undefined,
  );
  const { loading, getReservationFull } = useReservations(false);

  useEffect(() => {
    if (!loading) {
      const getOccurrences = async () => {
        const full = await getReservationFull(selectedReservation.id);
        setReservationFull(full);
      }
      getOccurrences();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReservation]);

  return (
    <Modal size={'xl'} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`Editar Ocorrências - ${selectedReservation.title}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ReservationScheduleAccordion 
            reservation={reservationFull} 
            onSave={() => {
              refetch();
              onClose();
            }}/>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
