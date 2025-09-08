import { AxiosResponse } from 'axios';
import {
  ClassroomFullResponse,
  ClassroomResponse,
  ClassroomWithConflictCount,
} from '../../../models/http/responses/classroom.response.models';
import {
  ClassroomConflictParams,
  CreateClassroom,
  UpdateClassroom,
} from '../../../models/http/requests/classroom.request.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import * as service from '../../../services/api/axios';

const useClassroomsService = () => {
  const axiosCommon = service.default;
  const axios = useAxiosPrivate();

  const get = (): Promise<AxiosResponse<Array<ClassroomResponse>>> => {
    return axiosCommon.get('/classrooms');
  };

  const getMine = (): Promise<AxiosResponse<Array<ClassroomResponse>>> => {
    return axios.get('/users/my-classrooms');
  };

  const getOneFull = (
    id: number,
  ): Promise<AxiosResponse<ClassroomFullResponse>> => {
    return axios.get(`/classrooms/full/${id}`);
  };

  const create = (
    data: CreateClassroom,
  ): Promise<AxiosResponse<ClassroomResponse>> => {
    return axios.post('/classrooms', data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<undefined>> => {
    return axios.delete(`/classrooms/${id}`);
  };

  const update = (
    id: number,
    data: UpdateClassroom,
  ): Promise<AxiosResponse<ClassroomResponse>> => {
    return axios.put(`/classrooms/${id}`, data);
  };

  const getWithConflictCountForSchedule = (
    building_id: number,
    schedule_id: number,
  ): Promise<AxiosResponse<ClassroomWithConflictCount[]>> => {
    const params = new URLSearchParams();
    return axios.get(
      `/classrooms/with-conflict-count/${building_id}/${schedule_id}`,
      {
        params,
      },
    );
  };

  const getWithConflictCount = (
    data: ClassroomConflictParams,
    building_id: number,
  ): Promise<AxiosResponse<ClassroomWithConflictCount[]>> => {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
      if (key == 'dates') return;
      const value = data[key as keyof ClassroomConflictParams];
      if (value) {
        params.append(key, value as string);
      }
    });
    if (data.dates)
      data.dates.forEach((date) => {
        params.append('dates', date);
      });
    return axios.get(`/classrooms/with-conflict-count/${building_id}`, {
      params,
    });
  };

  return {
    get,
    getMine,
    getOneFull,
    create,
    deleteById,
    update,
    getWithConflictCountForSchedule,
    getWithConflictCount,
  };
};

export default useClassroomsService;
