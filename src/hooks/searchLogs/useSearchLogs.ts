import { useCallback, useMemo, useState } from 'react';
import useCustomToast from '../useCustomToast';
import useSearchLogService from '../API/services/useSearchLogService';
import SearchLogErrorParser from './searchLogErrorParser';
import {
  SearchDocumentSummaryParams,
  SearchLogSummaryParams,
} from '../../models/http/requests/search.request.models';
import {
  SearchDocumentSummaryResponse,
  SearchLogSummaryResponse,
} from '../../models/http/responses/search.response.models';

const useSearchLogs = () => {
  const service = useSearchLogService();
  const [summary, setSummary] = useState<SearchLogSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] =
    useState<SearchDocumentSummaryResponse | null>(null);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const showToast = useCustomToast();
  const parser = useMemo(() => new SearchLogErrorParser(), []);

  const getSummary = useCallback(
    async (params: SearchLogSummaryParams = {}) => {
      setLoading(true);
      await service
        .getSummary(params)
        .then((response) => {
          setSummary(response.data);
        })
        .catch((error) => {
          showToast('Erro', parser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [service, showToast, parser],
  );

  const getDocuments = useCallback(
    async (params: SearchDocumentSummaryParams = {}) => {
      setLoadingDocuments(true);
      await service
        .getDocuments(params)
        .then((response) => {
          setDocuments(response.data);
        })
        .catch((error) => {
          showToast('Erro', parser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoadingDocuments(false);
        });
    },
    [service, showToast, parser],
  );

  return {
    summary,
    loading,
    getSummary,
    documents,
    loadingDocuments,
    getDocuments,
  };
};

export default useSearchLogs;
