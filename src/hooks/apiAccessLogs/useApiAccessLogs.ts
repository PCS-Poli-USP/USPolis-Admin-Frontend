import { useCallback, useMemo, useState } from 'react';
import useCustomToast from '../useCustomToast';
import useApiAccessLogService, {
  ApiAccessLogFilters,
} from '../API/services/useApiAccessLogService';
import ApiAccessLogErrorParser from './apiAccessLogErrorParser';
import {
  ApiAccessLogResponse,
  ApiAccessLogSummaryResponse,
} from '../../models/http/responses/apiAccessLog.response.models';
import { usePaginatedResponse } from '../API/usePaginatedResponse';
import { PageSize } from '../../utils/enums/pageSize.enum';

const useApiAccessLogs = () => {
  const service = useApiAccessLogService();
  const { pageResponse, setPageResponse } =
    usePaginatedResponse<ApiAccessLogResponse>();
  const [summary, setSummary] = useState<ApiAccessLogSummaryResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const showToast = useCustomToast();
  const parser = useMemo(() => new ApiAccessLogErrorParser(), []);

  const getAccessLogs = useCallback(
    async (
      page: number = 1,
      pageSize: PageSize = PageSize.SIZE_10,
      filters: ApiAccessLogFilters = {},
    ) => {
      setLoading(true);
      await service
        .getAllPaginated(page, pageSize, filters)
        .then((response) => {
          setPageResponse(response.data);
        })
        .catch((error) => {
          showToast('Erro', parser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [service, showToast, parser, setPageResponse],
  );

  const getSummary = useCallback(
    async (days: number = 7) => {
      setLoadingSummary(true);
      await service
        .getSummary(days)
        .then((response) => {
          setSummary(response.data);
        })
        .catch((error) => {
          showToast('Erro', parser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoadingSummary(false);
        });
    },
    [service, showToast, parser],
  );

  const getAccessLogById = useCallback(
    async (id: number) => {
      try {
        const response = await service.getById(id);
        return response.data;
      } catch (error) {
        showToast('Erro', parser.parseGetError(error), 'error');
        return undefined;
      }
    },
    [service, showToast, parser],
  );

  return {
    pageResponse,
    summary,
    loading,
    loadingSummary,
    getAccessLogs,
    getSummary,
    getAccessLogById,
  };
};

export default useApiAccessLogs;
