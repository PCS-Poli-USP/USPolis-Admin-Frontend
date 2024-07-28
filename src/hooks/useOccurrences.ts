import useCustomToast from 'hooks/useCustomToast';
import { OccurrenceResponse } from 'models/http/responses/occurrence.response.models';
import { useCallback, useEffect, useState } from 'react';
import OccurrencesService from 'services/api/occurrences.service';
import { sortOccurrencesResponse } from 'utils/occurrences/occurrences.sorter';

const service = new OccurrencesService();

const useOccurrences = () => {
  const [loading, setLoading] = useState(false);
  const [occurrences, setOccurrences] = useState<OccurrenceResponse[]>([]);

  const showToast = useCustomToast();

  const getOccurrences = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setOccurrences(response.data.sort(sortOccurrencesResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar reservas', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast]);

 

  useEffect(() => {
    getOccurrences();
  }, [getOccurrences]);

  return {
    loading,
    occurrences,
    getOccurrences,
  };
};

export default useOccurrences;
