import { AxiosResponse } from 'axios';
import { useMemo } from 'react';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { SearchLogSummaryParams } from '../../../models/http/requests/search.request.models';
import { SearchLogSummaryResponse } from '../../../models/http/responses/search.response.models';

const PREFIX = '/admin/search-logs';

// Admin only: summary of the anonymous public search log.
const useSearchLogService = () => {
  const axios = useAxiosPrivate();

  // Memoized so callers can list the service in effect/callback deps.
  return useMemo(() => {
    const getSummary = (
      params: SearchLogSummaryParams = {},
    ): Promise<AxiosResponse<SearchLogSummaryResponse>> => {
      return axios.get(`${PREFIX}/summary`, { params });
    };

    return { getSummary };
  }, [axios]);
};

export default useSearchLogService;
