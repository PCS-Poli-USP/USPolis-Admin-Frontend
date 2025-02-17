import useCustomToast from 'hooks/useCustomToast';
import { SubjectCrawlResponse } from 'models/http/responses/subject.response.models';
import { useCallback, useState } from 'react';
import useSubjectsService from './API/services/useSubjectsService';
import {
  CrawlSubject,
  UpdateCrawlSubject,
} from 'models/http/requests/subject.request.models';

const useCrawler = () => {
  const service = useSubjectsService();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubjectCrawlResponse>();

  const showToast = useCustomToast();

  const create = useCallback(
    async (building_id: number, data: CrawlSubject) => {
      setLoading(true);
      await service
        .crawl(building_id, data)
        .then((response) => {
          setResult(response.data);
        })
        .catch((error) => {
          console.error(error);
          showToast(
            'Erro',
            'Erro ao carregar disciplinas pelo JupiterWeb',
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service],
  );

  const update = useCallback(
    async (data: UpdateCrawlSubject) => {
      setLoading(true);
      await service
        .updateCrawl(data)
        .then((response) => {
          setResult(response.data);
        })
        .catch((error) => {
          console.error(error);
          showToast(
            'Erro',
            'Erro ao atualizar disciplinas pelo JupiterWeb',
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service],
  );

  return {
    result,
    loading,
    create,
    update,
  };
};

export default useCrawler;
