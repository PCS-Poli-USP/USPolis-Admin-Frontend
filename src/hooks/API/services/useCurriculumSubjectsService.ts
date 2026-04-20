import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { CreateCurriculumSubject, UpdateCurriculumSubject } from '../../../models/http/requests/curriculumSubject.request.models';
import { CurriculumSubjectResponse } from '../../../models/http/responses/curriculumSubject.response.models';

const useCurriculumSubjectsService = () => {
  const axios = useAxiosPrivate();

  const create = (
    data: CreateCurriculumSubject,
  ): Promise<AxiosResponse<{ message: string }>> => {
    return axios.post('/admin/curriculum_subjects', data);
  };    

  const getAll = (): Promise<AxiosResponse<Array<CurriculumSubjectResponse>>> => {
    return axios.get('/curriculum_subjects');
  };

  const getByCurriculumId = (
    curriculumId: number,
  ): Promise<AxiosResponse<Array<CurriculumSubjectResponse>>> => {
    return axios.get(`/curriculum_subjects/${curriculumId}/subjects`);
  };

  const update = (
    id: number,
    data: UpdateCurriculumSubject,
  ): Promise<AxiosResponse<{ message: string }>> => {
    return axios.put(`/admin/curriculum_subjects/${id}`, data);
  };

  const deleteById = (
    id: number,
  ): Promise<AxiosResponse<{ message: string }>> => {
    return axios.delete(`/admin/curriculum_subjects/${id}`);
  };

  return {
    getAll,
    getByCurriculumId,
    create,
    update,
    deleteById,
  };
};

export default useCurriculumSubjectsService;