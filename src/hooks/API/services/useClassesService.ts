import { AxiosResponse } from 'axios';
import {
  ClassResponse,
  ClassFullResponse,
} from 'models/http/responses/class.response.models';
import {
  CreateClass,
  UpdateClass,
} from 'models/http/requests/class.request.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useClassesService = () => {
  const PREFIX = '/classes';
  const axios = useAxiosPrivate();

  const get = (): Promise<AxiosResponse<Array<ClassResponse>>> => {
    return axios.get(PREFIX);
  };

  const getBySubject = (
    subject_id: number,
  ): Promise<AxiosResponse<Array<ClassResponse>>> => {
    return axios.get(`${PREFIX}/subject/${subject_id}`);
  };

  const getByBuildingName = (
    building_name: string,
  ): Promise<AxiosResponse<Array<ClassResponse>>> => {
    return axios.get(`${PREFIX}/building/${building_name}`);
  };

  const getFull = (): Promise<AxiosResponse<Array<ClassFullResponse>>> => {
    return axios.get(`${PREFIX}/full/`);
  };

  const getOneFull = (
    id: number,
  ): Promise<AxiosResponse<ClassFullResponse>> => {
    return axios.get(`${PREFIX}/${id}/full/`);
  };

  const getById = (id: number): Promise<AxiosResponse<ClassResponse>> => {
    return axios.get(`${PREFIX}/${id}`);
  };

  const getMine = (): Promise<AxiosResponse<Array<ClassResponse>>> => {
    return axios.get(`/users/my-classes`);
  };

  const create = (data: CreateClass): Promise<AxiosResponse<ClassResponse>> => {
    return axios.post(PREFIX, data);
  };

  // createMany(data: string[]): Promise<AxiosResponse<any>> {
  //   return axios.post('many', data);
  // }

  const update = (id: number, data: UpdateClass) => {
    return axios.put(`${PREFIX}/${id}`, data);
  };

  const deleteById = (id: number) => {
    return axios.delete(`${PREFIX}/${id}`);
  };

  const deleteMany = (ids: number[]) => {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append('ids', id.toString()));

    return axios.delete(`${PREFIX}/many/`, {
      params: params,
    });
  };

  return {
    get,
    getBySubject,
    getByBuildingName,
    getFull,
    getOneFull,
    getById,
    getMine,
    create,
    update,
    deleteById,
    deleteMany,
  };
};

export default useClassesService;
