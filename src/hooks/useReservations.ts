import useCustomToast from 'hooks/useCustomToast';
import {
  CreateReservation,
  UpdateReservation,
} from 'models/http/requests/reservation.request.models';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import { useCallback, useEffect, useState } from 'react';
import { sortReservationsResponse } from 'utils/reservations/reservations.sorter';
import useReservationsService from './API/services/useReservationsService';

const useReservations = () => {
  const service = useReservationsService();
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);

  const showToast = useCustomToast();

  const getAllReservations = useCallback(async () => {
    setLoading(true);
    await service
      .get()
      .then((response) => {
        setReservations(response.data.sort(sortReservationsResponse));
      })
      .catch((error) => {
        showToast(
          'Erro',
          `Erro ao carregar todas reservas: ${error.response.detail}`,
          'error',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const getReservations = useCallback(async () => {
    setLoading(true);
    await service
      .getMine()
      .then((response) => {
        setReservations(response.data.sort(sortReservationsResponse));
      })
      .catch((error) => {
        showToast(
          'Erro',
          `Erro ao carregar suas reservas: ${error.response.detail}`,
          'error',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const createReservation = useCallback(
    async (data: CreateReservation) => {
      setLoading(true);
      await service
        .create(data)
        .then((response) => {
          showToast(
            'Sucesso',
            `Reserva ${data.title} criado com sucesso!`,
            'success',
          );
          getReservations();
        })
        .catch((error) => {
          console.log(error);
          showToast('Erro', `Erro ao criar reserva: ${error}`, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getReservations, showToast, service],
  );

  const updateReservation = useCallback(
    async (id: number, data: UpdateReservation) => {
      setLoading(true);
      await service
        .update(id, data)
        .then((response) => {
          showToast('Sucesso', `Reserva atualizado com sucesso!`, 'success');
          getReservations();
        })
        .catch((error) => {
          showToast(
            'Erro',
            `Erro ao atualizar o reserva ${data.title}: ${error}`,
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getReservations, showToast, service],
  );

  const deleteReservation = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
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
    [getReservations, showToast, service],
  );

  useEffect(() => {
    getReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    reservations,
    getAllReservations,
    getReservations,
    createReservation,
    updateReservation,
    deleteReservation,
  };
};

export default useReservations;
