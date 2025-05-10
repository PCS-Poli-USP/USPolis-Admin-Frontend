/* eslint-disable react-hooks/exhaustive-deps */

import useCustomToast from '../hooks/useCustomToast';
import { OccurrenceResponse } from '../models/http/responses/occurrence.response.models';
import { useCallback, useState } from 'react';

import { sortOccurrenceResponse } from '../utils/occurrences/occurrences.sorter';
import useOcurrencesService, {
  AllocateManySchedulesData,
} from './API/services/useOccurrencesService';
import { ScheduleErrorParser } from './schedules/scheduleErrorParser';

const useOccurrences = () => {
  const service = useOcurrencesService();
  const [loading, setLoading] = useState(false);
  const [occurrences, setOccurrences] = useState<OccurrenceResponse[]>([]);

  const showToast = useCustomToast();
  const scheduleParser = new ScheduleErrorParser();

  const getOccurrences = useCallback(async () => {
    setLoading(true);
    let newOccurrences: OccurrenceResponse[] = [];
    await service
      .list()
      .then((response) => {
        newOccurrences = response.data.sort(sortOccurrenceResponse);
        setOccurrences(newOccurrences);
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar ocorrencias', 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
    return newOccurrences;
  }, [showToast, service]);

  const allocateManySchedules = useCallback(
    async (data: AllocateManySchedulesData[]) => {
      setLoading(true);
      await service
        .allocate_many_schedules(data)
        .then(() => {
          showToast(
            'Sucesso!',
            `${data.length} horário(s) alocado(s)`,
            'success',
          );
        })
        .catch((error) => {
          showToast('Erro', scheduleParser.parseAllocateError(error), 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service],
  );

  return {
    loading,
    occurrences,
    getOccurrences,
    allocateManySchedules,
  };
};

export default useOccurrences;
