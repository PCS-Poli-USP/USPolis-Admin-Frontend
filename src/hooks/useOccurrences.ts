/* eslint-disable react-hooks/exhaustive-deps */

import useCustomToast from '../hooks/useCustomToast';
import { OccurrenceResponse } from '../models/http/responses/occurrence.response.models';
import { ScheduleFullResponse } from '../models/http/responses/schedule.response.models';
import { useCallback, useState } from 'react';

import { sortOccurrenceResponse } from '../utils/occurrences/occurrences.sorter';
import useOcurrencesService, {
  AllocateManySchedulesData,
} from './API/services/useOccurrencesService';
import { ScheduleErrorParser } from './schedules/scheduleErrorParser';
import { OccurrenceErrorParser } from './occurrences/occurrenceErrorParser';

const useOccurrences = () => {
  const service = useOcurrencesService();
  const [loading, setLoading] = useState(false);
  const [occurrences, setOccurrences] = useState<OccurrenceResponse[]>([]);

  const showToast = useCustomToast();
  const scheduleParser = new ScheduleErrorParser();
  const occurrenceParser = new OccurrenceErrorParser();

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
        showToast('Erro', occurrenceParser.parseGetError(error), 'error');
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

  const getScheduleFull = useCallback(
    async (schedule_id: number) => {
      let schedule: ScheduleFullResponse | undefined = undefined;
      try {
        const response = await service.getFullBySchedule(schedule_id);
        schedule = response.data;
      } catch (error) {
        console.log(error);
      }
      return schedule;
    },
    [service],
  );

  return {
    loading,
    occurrences,
    getOccurrences,
    allocateManySchedules,
    getScheduleFull,
  };
};

export default useOccurrences;
