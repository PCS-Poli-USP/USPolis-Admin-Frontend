import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { ApiIncidentReportResponse } from '../../../models/http/responses/apiIncidentReport.response.models';
import {
  CreateApiIncidentReport,
  UpdateApiIncidentReportStatus,
} from '../../../models/http/requests/apiIncidentReport.request.models';
import { PaginatedResponse } from '../../../models/http/responses/paginated.response.models';
import { IncidentReportLevel } from '../../../utils/enums/incidentReportLevel.enum';
import { IncidentReportStatus } from '../../../utils/enums/incidentReportStatus.enum';
import { PageSize } from '../../../utils/enums/pageSize.enum';

const PREFIX = '/admin/api-incident-reports';

export interface ApiIncidentReportFilters {
  status?: IncidentReportStatus;
  level?: IncidentReportLevel;
  access_log_id?: number;
}

const useApiIncidentReportService = () => {
  const axios = useAxiosPrivate();

  const getAllPaginated = (
    page: number = 1,
    page_size: PageSize = PageSize.SIZE_10,
    filters: ApiIncidentReportFilters = {},
  ): Promise<AxiosResponse<PaginatedResponse<ApiIncidentReportResponse>>> => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('page_size', String(page_size));
    if (filters.status) params.set('status', filters.status);
    if (filters.level) params.set('level', filters.level);
    if (filters.access_log_id)
      params.set('access_log_id', String(filters.access_log_id));
    return axios.get(PREFIX, { params });
  };

  const create = (
    data: CreateApiIncidentReport,
  ): Promise<AxiosResponse<ApiIncidentReportResponse>> => {
    return axios.post(PREFIX, data);
  };

  const updateStatus = (
    id: number,
    data: UpdateApiIncidentReportStatus,
  ): Promise<AxiosResponse<ApiIncidentReportResponse>> => {
    return axios.patch(`${PREFIX}/${id}/status`, data);
  };

  return { getAllPaginated, create, updateStatus };
};

export default useApiIncidentReportService;
