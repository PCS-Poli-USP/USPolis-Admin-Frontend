import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { CreateBugReport } from '../../../models/http/requests/bugReport.request.models';
import { JSONResponse } from '../../../models/http/responses/common.response.models';
import { BugReportResponse } from '../../../models/http/responses/bugReport.response.models';
import { BugStatus } from '../../../utils/enums/bugReport.enum';

const useBugReportService = () => {
  const axios = useAxiosPrivate();

  const getAll = (): Promise<AxiosResponse<Array<BugReportResponse>>> => {
    return axios.get('/admin/reports');
  };

  const create = (
    data: CreateBugReport,
  ): Promise<AxiosResponse<JSONResponse>> => {
    const formData = new FormData();
    formData.append('priority', data.priority);
    formData.append('type', data.type);
    formData.append('description', data.description);
    for (const file of data.evidences) {
      formData.append('evidences', file);
    }
    return axios.post('/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const updateStatus = (
    report_id: number,
    status: BugStatus,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.patch(`/admin/reports/${report_id}`, { status });
  };

  return { getAll, create, updateStatus };
};

export default useBugReportService;
