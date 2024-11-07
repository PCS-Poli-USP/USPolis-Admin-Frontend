import useCustomToast from 'hooks/useCustomToast';
import { OccurrenceResponse } from 'models/http/responses/occurrence.response.models';
import { useCallback, useState } from 'react';
import OccurrencesService, {
  AllocateManySchedulesData,
} from 'services/api/occurrences.service';
import { sortOccurrenceResponse } from 'utils/occurrences/occurrences.sorter';

const service = new OccurrencesService();

const useOccurrences = () => {
  const [loading, setLoading] = useState(false);
  const [occurrences, setOccurrences] = useState<OccurrenceResponse[]>([]);

  const showToast = useCustomToast();

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
  }, [showToast]);

  const allocateManySchedules = useCallback(
    async (data: AllocateManySchedulesData[]) => {
      setLoading(true);
      await service
        .allocate_many_schedules(data)
        .then((response) => {
          showToast('Sucesso!', `${data.length} horário(s) alocado(s)`, 'success');
        })
        .catch((error) => {
          showToast('Erro', 'Erro ao alocar horários', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast],
  );

  return {
    loading,
    occurrences,
    getOccurrences,
    allocateManySchedules,
  };
};

export default useOccurrences;
