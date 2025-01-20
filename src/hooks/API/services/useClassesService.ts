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

  const list = (): Promise<AxiosResponse<Array<ClassResponse>>> => {
    return axios.get(PREFIX);
  };

  const listBySubject = (
    subject_id: number,
  ): Promise<AxiosResponse<Array<ClassResponse>>> => {
    return axios.get(`${PREFIX}/subject/${subject_id}`);
  };

  const listByBuildingName = (
    building_name: string,
  ): Promise<AxiosResponse<Array<ClassResponse>>> => {
    return axios.get(`${PREFIX}/building/${building_name}`);
  };

  const listFull = (): Promise<AxiosResponse<Array<ClassFullResponse>>> => {
    return axios.get(`${PREFIX}/full/`);
  };

  const listOneFull = (
    id: number,
  ): Promise<AxiosResponse<ClassFullResponse>> => {
    return axios.get(`${PREFIX}/${id}/full/`);
  };
  const getById = (id: number): Promise<AxiosResponse<ClassResponse>> => {
    return axios.get(`${PREFIX}/${id}`);
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
    list,
    listBySubject,
    listByBuildingName,
    listFull,
    listOneFull,
    getById,
    create,
    update,
    deleteById,
    deleteMany,
  };
};

export default useClassesService;
