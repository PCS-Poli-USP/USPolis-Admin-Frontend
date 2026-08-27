import { SubjectCrawlResponse } from '../models/http/responses/subject.response.models';
import { useCallback, useMemo, useState } from 'react';
import useSubjectsService from './API/services/useSubjectsService';
import {
  CrawlSubject,
  UpdateCrawlSubject,
} from '../models/http/requests/subject.request.models';
import useCustomToast from './useCustomToast';
import SubjectErrorParser from './subjectErrorParser';

const useCrawler = () => {
  const service = useSubjectsService();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubjectCrawlResponse>();
  const showToast = useCustomToast();
  const parser = useMemo(() => new SubjectErrorParser(), []);

  const create = useCallback(
    async (building_id: number, data: CrawlSubject) => {
      setLoading(true);
      await service
        .crawl(building_id, data)
        .then((response) => {
          setResult(response.data);
        })
        .catch((error) => {
          showToast('Erro', parser.parseCrawlError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [service, showToast, parser],
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
          showToast('Erro', parser.parseUpdateCrawlError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [service, showToast, parser],
  );

  return {
    result,
    loading,
    create,
    update,
  };
};

export default useCrawler;
