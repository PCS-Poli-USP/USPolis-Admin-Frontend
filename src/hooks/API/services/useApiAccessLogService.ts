import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import {
  ApiAccessLogResponse,
  ApiAccessLogSummaryResponse,
} from '../../../models/http/responses/apiAccessLog.response.models';
import { PaginatedResponse } from '../../../models/http/responses/paginated.response.models';
import { ApiSecurityLevel } from '../../../utils/enums/apiSecurityLevel.enum';
import { PageSize } from '../../../utils/enums/pageSize.enum';

const PREFIX = '/admin/api-access-logs';

export interface ApiAccessLogFilters {
  status_code?: number;
  method?: string;
  security_level?: ApiSecurityLevel;
  since?: string;
  until?: string;
}

const useApiAccessLogService = () => {
  const axios = useAxiosPrivate();

  const getAllPaginated = (
    page: number = 1,
    page_size: PageSize = PageSize.SIZE_10,
    filters: ApiAccessLogFilters = {},
  ): Promise<AxiosResponse<PaginatedResponse<ApiAccessLogResponse>>> => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('page_size', String(page_size));
    if (filters.status_code)
      params.set('status_code', String(filters.status_code));
    if (filters.method) params.set('method', filters.method);
    if (filters.security_level)
      params.set('security_level', filters.security_level);
    if (filters.since) params.set('since', filters.since);
    if (filters.until) params.set('until', filters.until);
    return axios.get(PREFIX, { params });
  };

  const getSummary = (
    days: number = 7,
  ): Promise<AxiosResponse<ApiAccessLogSummaryResponse>> => {
    const params = new URLSearchParams();
    params.set('days', String(days));
    return axios.get(`${PREFIX}/summary`, { params });
  };

  const getById = (
    id: number,
  ): Promise<AxiosResponse<ApiAccessLogResponse>> => {
    return axios.get(`${PREFIX}/${id}`);
  };

  return { getAllPaginated, getSummary, getById };
};

export default useApiAccessLogService;
