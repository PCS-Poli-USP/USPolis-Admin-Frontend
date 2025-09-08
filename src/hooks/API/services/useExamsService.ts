import { AxiosResponse } from 'axios';
import * as service from '../../../services/api/axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import {
  ExamEventResponse,
  ExamResponse,
} from '../../../models/http/responses/exam.response.models';
import { JSONResponse } from '../../../models/http/responses/common.response.models';
import {
  CreateExam,
  UpdateExam,
} from '../../../models/http/requests/exam.request.models';

const useExamsService = () => {
  const axiosCommon = service.default;
  const axios = useAxiosPrivate();
  const PREFIX = '/reservations/exams';

  const get = (
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<ExamResponse>>> => {
    if (start && end) {
      const params = new URLSearchParams();
      params.append('start', start);
      params.append('end', end);
      return axiosCommon.get(`${PREFIX}`, { params });
    }
    return axiosCommon.get(`${PREFIX}`);
  };

  const getBySubjectId = (
    subjectId: number,
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<ExamResponse>>> => {
    const params = new URLSearchParams();
    if (start && end) {
      params.append('start', start);
      params.append('end', end);
    }
    return axiosCommon.get(`${PREFIX}/subject/${subjectId}`, { params });
  };

  const getEvents = (
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<ExamEventResponse>>> => {
    if (start && end) {
      const params = new URLSearchParams();
      params.append('start', start);
      params.append('end', end);
      return axiosCommon.get(`${PREFIX}/events`, { params });
    }
    return axiosCommon.get(`${PREFIX}/events`);
  };

  const create = (data: CreateExam): Promise<AxiosResponse<JSONResponse>> => {
    return axios.post(`${PREFIX}`, data);
  };

  const update = (data: UpdateExam): Promise<AxiosResponse<JSONResponse>> => {
    return axios.put(`${PREFIX}`, data);
  };

  return { get, getBySubjectId, getEvents, create, update };
};

export default useExamsService;
