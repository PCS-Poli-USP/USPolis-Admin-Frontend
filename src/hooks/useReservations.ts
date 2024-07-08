import useCustomToast from 'hooks/useCustomToast';
import {
  CreateReservation,
  UpdateReservation,
} from 'models/http/requests/reservation.request.models';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import { useCallback, useEffect, useState } from 'react';
import ReservationsService from 'services/api/reservations.service';
import { sortReservationsResponse } from 'utils/reservations/reservations.sorter';

const service = new ReservationsService();

const useReservations = () => {
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);

  const showToast = useCustomToast();

  const getReservations = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setReservations(response.data.sort(sortReservationsResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar reservas', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast]);

  const createReservation = useCallback(
    async (data: CreateReservation) => {
      setLoading(true);
      await service
        .create(data)
        .then((response) => {
          showToast(
            'Sucesso',
            `Prédio ${data.name} criado com sucesso!`,
            'success',
          );
          getReservations();
        })
        .catch((error) => {
          showToast('Erro', `Erro ao criar prédio: ${error}`, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getReservations, showToast],
  );

  const updateReservation = useCallback(
    async (id: number, data: UpdateReservation) => {
      setLoading(true);
      await service
        .update(id, data)
        .then((response) => {
          showToast('Sucesso', `Prédio atualizado com sucesso!`, 'success');
          getReservations();
        })
        .catch((error) => {
          showToast(
            'Erro',
            `Erro ao atualizar o prédio ${data.name}: ${error}`,
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getReservations, showToast],
  );

  const deleteReservation = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .delete(id)
        .then((response) => {
          showToast('Sucesso!', 'Sucesso ao remover reserva', 'success');

          getReservations();
        })
        .catch((error) => {
          showToast('Erro!', 'Erro ao remover reserva', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getReservations, showToast],
  );

  useEffect(() => {
    getReservations();
  }, [getReservations]);

  return {
    loading,
    reservations,
    getReservations,
    createReservation,
    updateReservation,
    deleteReservation,
  };
};

export default useReservations;
