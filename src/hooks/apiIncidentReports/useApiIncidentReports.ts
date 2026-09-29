import { useCallback, useMemo, useState } from 'react';
import useCustomToast from '../useCustomToast';
import useApiIncidentReportService, {
  ApiIncidentReportFilters,
} from '../API/services/useApiIncidentReportService';
import ApiIncidentReportErrorParser from './apiIncidentReportErrorParser';
import { ApiIncidentReportResponse } from '../../models/http/responses/apiIncidentReport.response.models';
import { CreateApiIncidentReport } from '../../models/http/requests/apiIncidentReport.request.models';
import { usePaginatedResponse } from '../API/usePaginatedResponse';
import { PageSize } from '../../utils/enums/pageSize.enum';
import { IncidentReportStatus } from '../../utils/enums/incidentReportStatus.enum';

const useApiIncidentReports = () => {
  const service = useApiIncidentReportService();
  const { pageResponse, setPageResponse } =
    usePaginatedResponse<ApiIncidentReportResponse>();
  const [loading, setLoading] = useState(false);

  const showToast = useCustomToast();
  const parser = useMemo(() => new ApiIncidentReportErrorParser(), []);

  const getIncidents = useCallback(
    async (
      page: number = 1,
      pageSize: PageSize = PageSize.SIZE_10,
      filters: ApiIncidentReportFilters = {},
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

  const findIncidentByAccessLogId = useCallback(
    async (accessLogId: number) => {
      try {
        const response = await service.getAllPaginated(1, PageSize.SIZE_5, {
          access_log_id: accessLogId,
        });
        return response.data.data[0];
      } catch (error) {
        showToast('Erro', parser.parseGetError(error), 'error');
        return undefined;
      }
    },
    [service, showToast, parser],
  );

  const createIncident = useCallback(
    async (data: CreateApiIncidentReport) => {
      setLoading(true);
      try {
        const response = await service.create(data);
        showToast('Sucesso', 'Incidente aberto com sucesso', 'success');
        return response.data;
      } catch (error) {
        showToast('Erro', parser.parseCreateError(error), 'error');
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [service, showToast, parser],
  );

  const updateIncidentStatus = useCallback(
    async (id: number, status: IncidentReportStatus) => {
      setLoading(true);
      try {
        const response = await service.updateStatus(id, { status });
        showToast('Sucesso', 'Status do incidente atualizado', 'success');
        return response.data;
      } catch (error) {
        showToast('Erro', parser.parseUpdateError(error), 'error');
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [service, showToast, parser],
  );

  return {
    pageResponse,
    loading,
    getIncidents,
    findIncidentByAccessLogId,
    createIncident,
    updateIncidentStatus,
  };
};

export default useApiIncidentReports;
