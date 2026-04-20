import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { CreateCurriculum, UpdateCurriculum } from '../../../models/http/requests/curriculum.request.models';
import { CurriculumResponse } from '../../../models/http/responses/curriculum.response.models';

const useCurriculumsService = () => {
    const axios = useAxiosPrivate();

    const create = (
        data: CreateCurriculum,
    ): Promise<AxiosResponse<{ message: string }>> => {
        return axios.post('/admin/curriculums', data);
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

    const deleteById = (id: number): Promise<AxiosResponse<{ message: string }>> => {
      return axios.delete(`/admin/curriculums/${id}`);
    };


  return {
    getAll,
    create,
    update,
    deleteById,
  };
};

export default useCurriculumsService;