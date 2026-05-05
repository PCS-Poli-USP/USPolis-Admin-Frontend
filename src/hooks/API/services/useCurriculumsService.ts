import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import {
  CreateCurriculum,
  UpdateCurriculum,
} from '../../../models/http/requests/curriculum.request.models';
import { CurriculumResponse } from '../../../models/http/responses/curriculum.response.models';

export interface CreateCurriculumByJupiterRequest {
  course_id: number;
  description: string;
  codcur: number;
  codhab: number;
}

export interface JupiterCurriculumPreviewResponse {
  description: string;
  course_name: string;
  AAC: number;
  AEX: number;
  mandatory: { subject_code: string; subject_name: string; period: number }[];
  free: { subject_code: string; subject_name: string; period: number }[];
  elective: { subject_code: string; subject_name: string; period: number }[];
}

const useCurriculumsService = () => {
  const axios = useAxiosPrivate();

  const previewByJupiter = (
    data: CreateCurriculumByJupiterRequest,
  ): Promise<AxiosResponse<JupiterCurriculumPreviewResponse>> => {
    return axios.post('/admin/curriculums/jupiter/preview', data);
  };

  const create = (
    data: CreateCurriculum,
  ): Promise<AxiosResponse<{ message: string }>> => {
    return axios.post('/admin/curriculums', data);
  };

  const createByJupiter = (
    data: CreateCurriculumByJupiterRequest,
  ): Promise<AxiosResponse<{ message: string }>> => {
    return axios.post('/admin/curriculums/jupiter', data);
  };

  const getAll = (): Promise<AxiosResponse<Array<CurriculumResponse>>> => {
    return axios.get('/curriculums');
  };

  const update = (
    id: number,
    data: UpdateCurriculum,
  ): Promise<AxiosResponse<{ message: string }>> => {
    return axios.put(`/admin/curriculums/${id}`, data);
  };

  const deleteById = (
    id: number,
  ): Promise<AxiosResponse<{ message: string }>> => {
    return axios.delete(`/admin/curriculums/${id}`);
  };

  return {
    getAll,
    create,
    createByJupiter,
    previewByJupiter,
    update,
    deleteById,
  };
};

export default useCurriculumsService;