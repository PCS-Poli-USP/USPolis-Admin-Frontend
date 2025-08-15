import { AxiosResponse } from 'axios';
import {
  ClassResponse,
  ClassFullResponse,
} from '../../../models/http/responses/class.response.models';
import {
  CreateClass,
  UpdateClass,
} from '../../../models/http/requests/class.request.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

import axios from '../../../services/api/axios';

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

  const getBySubjects = (
    subject_ids: number[],
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<ClassResponse>>> => {
    const params = new URLSearchParams();
    subject_ids.forEach((id) => params.append('subject_ids', id.toString()));

    if (start && end) {
      params.append('start', start);
      params.append('end', end);
    }
    return axios.get(`${PREFIX}/subjects`, { params });
  };

  const getByBuildingName = (
    building_name: string,
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<ClassResponse>>> => {
    if (start && end) {
      const params = new URLSearchParams();
      params.append('start', start);
      params.append('end', end);
      return axios.get(`${PREFIX}/building/${building_name}`, { params });
    }
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

  const getMine = (
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<ClassResponse>>> => {
    if (start && end) {
      const params = new URLSearchParams();
      params.append('start', start);
      params.append('end', end);
      return axiosPrivate.get(`/users/my-classes`, { params });
    }
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
    getBySubjects,
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
