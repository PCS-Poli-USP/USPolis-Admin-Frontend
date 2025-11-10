/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import useCustomToast from '../useCustomToast';
import useBugReportService from '../API/services/useBugReportService';
import BugReportErrorParser from './bugReportErrorParser';
import { BugReportResponse } from '../../models/http/responses/bugReport.response.models';
import { CreateBugReport } from '../../models/http/requests/bugReport.request.models';
import { BugPriority, BugStatus } from '../../utils/enums/bugReport.enum';

const useBugReports = () => {
  const service = useBugReportService();
  const [reports, setReports] = useState<Array<BugReportResponse>>([]);
  const [loading, setLoading] = useState(false);

  const errorParser = new BugReportErrorParser();
  const showToast = useCustomToast();

  const getReports = useCallback(async () => {
    setLoading(true);
    await service
      .getAll()
      .then((response) => {
        setReports(
          response.data.sort(
            (a, b) =>
              BugPriority.toInt(b.priority) - BugPriority.toInt(a.priority),
          ),
        );
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
    createReport,
    updateReportStatus,
  };
};

export default useBugReports;
