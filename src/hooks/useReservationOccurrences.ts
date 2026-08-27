import useCustomToast from '../hooks/useCustomToast';
import { ScheduleUpdateOccurences } from '../models/http/requests/schedule.request.models';
import { ReservationFullResponse } from '../models/http/responses/reservation.response.models';
import { useCallback, useMemo, useState } from 'react';
import useReservationsService from './API/services/useReservationsService';
import ReservationErrorParser from './reservations/reservationErrorParser';

const useReservationOccurrences = () => {
  const service = useReservationsService();
  const [loading, setLoading] = useState(false);

  const showToast = useCustomToast();
  const parser = useMemo(() => new ReservationErrorParser(), []);

  const updateOccurrences = useCallback(
    async (id: number, data: ScheduleUpdateOccurences) => {
      setLoading(true);
      let reservation: ReservationFullResponse | undefined = undefined;
      try {
        const response = await service.updateOccurrences(id, data);
        reservation = response.data;
        showToast('Sucesso', 'Sucesso ao editar ocorrências', 'success');
      } catch (error) {
        showToast('Erro', parser.parseUpdateOccurrencesError(error), 'error');
      }
      setLoading(false);
      return reservation;
    },
    [showToast, service, parser],
  );

  return {
    loading,
    updateOccurrences,
  };
};

export default useReservationOccurrences;
