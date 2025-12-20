import { AxiosResponse } from 'axios';
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
      return axios.get(`${PREFIX}`, { params });
    }
    return axios.get(`${PREFIX}`);
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
    return axios.get(`${PREFIX}/subject/${subjectId}`, { params });
  };

  const getEvents = (
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<ExamEventResponse>>> => {
    if (start && end) {
      const params = new URLSearchParams();
      params.append('start', start);
      params.append('end', end);
      return axios.get(`${PREFIX}/events`, { params });
    }
    return axios.get(`${PREFIX}/events`);
  };

  const create = (data: CreateExam): Promise<AxiosResponse<JSONResponse>> => {
    return axios.post(`${PREFIX}`, data);
  };

  const update = (
    exam_id: number,
    data: UpdateExam,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.put(`${PREFIX}/${exam_id}`, data);
  };

  return { get, getBySubjectId, getEvents, create, update };
};

export default useExamsService;
