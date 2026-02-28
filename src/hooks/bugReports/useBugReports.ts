/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import useCustomToast from '../useCustomToast';
import useBugReportService from '../API/services/useBugReportService';
import BugReportErrorParser from './bugReportErrorParser';
import { BugReportResponse } from '../../models/http/responses/bugReport.response.models';
import { CreateBugReport } from '../../models/http/requests/bugReport.request.models';
import { BugStatus } from '../../utils/enums/bugReport.enum';
import BugReportEvidenceErrorParser from './bugReportEvidenceErrorParser';
import { sortReportsResponse } from '../../utils/reports/reports.sorter';

const useBugReports = () => {
  const service = useBugReportService();
  const [reports, setReports] = useState<Array<BugReportResponse>>([]);
  const [loading, setLoading] = useState(false);

  const errorParser = new BugReportErrorParser();
  const evidenceErrorParser = new BugReportEvidenceErrorParser();
  const showToast = useCustomToast();

  const getReports = useCallback(async () => {
    setLoading(true);
    await service
      .getAll()
      .then((response) => {
        setReports(response.data.sort(sortReportsResponse));
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getReportEvidence = useCallback(
    async (id: number): Promise<Blob | undefined> => {
      setLoading(true);
      let data: Blob | undefined = undefined;
      await service
        .getEvidence(id)
        .then((response) => {
          data = response.data;
        })
        .catch((error) => {
          showToast('Erro', evidenceErrorParser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
      return data;
    },
    [],
  );

  const createReport = useCallback(async (data: CreateBugReport) => {
    setLoading(true);
    await service
      .create(data)
      .then((response) => {
        showToast('Sucesso', 'Relato criado com sucesso', 'success');
        return response.data;
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseCreateError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const updateReportStatus = useCallback(
    async (report_id: number, status: BugStatus) => {
      setLoading(true);
      await service
        .updateStatus(report_id, status)
        .then((response) => {
          showToast('Sucesso', 'Relatório atualizado com sucesso', 'success');
          return response.data;
        })
        .catch((error) => {
          showToast('Erro', errorParser.parseCreateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [],
  );

  return {
    reports,
    loading,
    getReports,
    getReportEvidence,
    createReport,
    updateReportStatus,
  };
};

export default useBugReports;
