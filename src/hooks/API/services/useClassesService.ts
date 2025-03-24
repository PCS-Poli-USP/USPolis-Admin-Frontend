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

import axios from 'services/api/axios';

const useClassesService = () => {
  const PREFIX = '/classes';
  const axiosPrivate = useAxiosPrivate();

  const get = (): Promise<AxiosResponse<Array<ClassResponse>>> => {
    return axiosPrivate.get(PREFIX);
  };

  const getBySubject = (
    subject_id: number,
  ): Promise<AxiosResponse<Array<ClassResponse>>> => {
    return axiosPrivate.get(`${PREFIX}/subject/${subject_id}`);
  };

  const getByBuildingName = (
    building_name: string,
  ): Promise<AxiosResponse<Array<ClassResponse>>> => {
    return axios.get(`${PREFIX}/building/${building_name}`);
  };

  const getFull = (): Promise<AxiosResponse<Array<ClassFullResponse>>> => {
    return axiosPrivate.get(`${PREFIX}/full/`);
  };

  const getOneFull = (
    id: number,
  ): Promise<AxiosResponse<ClassFullResponse>> => {
    return axiosPrivate.get(`${PREFIX}/${id}/full/`);
  };

  const getById = (id: number): Promise<AxiosResponse<ClassResponse>> => {
    return axiosPrivate.get(`${PREFIX}/${id}`);
  };

  const getMine = (): Promise<AxiosResponse<Array<ClassResponse>>> => {
    return axiosPrivate.get(`/users/my-classes`);
  };

  const create = (data: CreateClass): Promise<AxiosResponse<ClassResponse>> => {
    return axiosPrivate.post(PREFIX, data);
  };

  // createMany(data: string[]): Promise<AxiosResponse<any>> {
  //   return axios.post('many', data);
  // }

  const update = (id: number, data: UpdateClass) => {
    return axiosPrivate.put(`${PREFIX}/${id}`, data);
  };

  const deleteById = (id: number) => {
    return axiosPrivate.delete(`${PREFIX}/${id}`);
  };

  const deleteMany = (ids: number[]) => {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append('ids', id.toString()));

    return axiosPrivate.delete(`${PREFIX}/many/`, {
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
