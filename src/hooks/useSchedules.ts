import useCustomToast from '../hooks/useCustomToast';
import { ScheduleUpdateOccurences } from '../models/http/requests/schedule.request.models';
import { ScheduleFullResponse } from '../models/http/responses/schedule.response.models';
import { useCallback, useState } from 'react';
import useScheduleService from './API/services/useSchedulesService';

const useSchedules = () => {
  const service = useScheduleService();
  const [loading, setLoading] = useState(false);

  const showToast = useCustomToast();

  const updateOccurrences = useCallback(
    async (id: number, data: ScheduleUpdateOccurences) => {
      setLoading(true);
      let schedule: ScheduleFullResponse | undefined = undefined;
      try {
        const response = await service.updateOccurences(id, data);
        schedule = response.data;
        showToast('Sucesso', 'Sucesso ao editar ocorrências', 'success');
      } catch (error) {
        showToast('Erro', 'Erro ao editar ocorrências', 'error');
        console.log(error);
      }
      setLoading(false);
      return schedule;
    },
    [showToast, service],
  );

  return {
    loading,
    updateOccurrences,
  };
};

export default useSchedules;
