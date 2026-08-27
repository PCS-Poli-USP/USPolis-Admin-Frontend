import useCustomToast from '../../hooks/useCustomToast';
import {
  CreateReservation,
  UpdateReservation,
} from '../../models/http/requests/reservation.request.models';
import {
  ReservationResponse,
  ReservationFullResponse,
} from '../../models/http/responses/reservation.response.models';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { sortReservationsResponse } from '../../utils/reservations/reservations.sorter';
import useReservationsService from './../API/services/useReservationsService';
import ReservationErrorParser from './reservationErrorParser';

const useReservations = (initialFetch = true) => {
  const service = useReservationsService();
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);

  const showToast = useCustomToast();
  const parser = useMemo(() => new ReservationErrorParser(), []);

  const getAllReservations = useCallback(async () => {
    setLoading(true);
    await service
      .get()
      .then((response) => {
        setReservations(response.data.sort(sortReservationsResponse));
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

  const getReservations = useCallback(
    async (start?: string, end?: string) => {
      setLoading(true);
      await service
        .getMine(start, end)
        .then((response) => {
          setReservations(response.data.sort(sortReservationsResponse));
        })
        .catch((error) => {
          showToast('Erro', parser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service, parser],
  );

  const getReservation = useCallback(
    async (id: number): Promise<ReservationResponse | undefined> => {
      setLoading(true);

      try {
        const response = await service.getById(id);
        return response.data;
      } catch (error) {
        showToast('Erro', parser.parseGetError(error), 'error');
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [service, showToast, parser],
  );

  const getReservationFull = useCallback(
    async (id: number): Promise<ReservationFullResponse | undefined> => {
      setLoading(true);

      try {
        const response = await service.getFullById(id);
        return response.data;
      } catch (error) {
        showToast('Erro', parser.parseGetError(error), 'error');
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [service, showToast, parser],
  );

  const getReservationsByBuildingName = useCallback(
    async (building_name: string, start?: string, end?: string) => {
      setLoading(true);
      await service
        .getByBuildingName(building_name, start, end)
        .then((response) => {
          setReservations(response.data.sort(sortReservationsResponse));
        })
        .catch((error) => {
          showToast('Erro', parser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service, parser],
  );

  const createReservation = useCallback(
    async (data: CreateReservation) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast(
            'Sucesso',
            `Reserva ${data.title} criado com sucesso!`,
            'success',
          );
          getReservations();
        })
        .catch((error) => {
          showToast('Erro', parser.parseCreateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getReservations, showToast, service, parser],
  );

  const updateReservation = useCallback(
    async (id: number, data: UpdateReservation) => {
      setLoading(true);
      await service
        .update(id, data)
        .then(() => {
          showToast('Sucesso', `Reserva atualizado com sucesso!`, 'success');
          getReservations();
        })
        .catch((error) => {
          showToast('Erro', parser.parseUpdateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getReservations, showToast, service, parser],
  );

  const deleteReservation = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then(() => {
          showToast('Sucesso!', 'Sucesso ao remover reserva', 'success');

          getReservations();
        })
        .catch((error) => {
          showToast('Erro!', parser.parseDeleteError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getReservations, showToast, service, parser],
  );

  useEffect(() => {
    if (initialFetch) getReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch]);

  return {
    loading,
    reservations,
    getAllReservations,
    getReservations,
    getReservation,
    getReservationFull,
    getReservationsByBuildingName,
    createReservation,
    updateReservation,
    deleteReservation,
  };
};

export default useReservations;
