import { AxiosResponse } from 'axios';
import { ClassroomWithConflictCount as ClassroomWithConflictCountOLD } from '../../../models/common/classroom.model';
import {
  ClassroomFullResponse,
  ClassroomResponse,
  ClassroomWithConflictCount,
} from '../../../models/http/responses/classroom.response.models';
import {
  ClassroomConflictCheck,
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

  const getWithConflictCount = (
    schedule_id: number,
    building_id: number,
  ): Promise<AxiosResponse<ClassroomWithConflictCountOLD[]>> => {
    return axios.get(
      `/classrooms/with-conflict-count/${building_id}/${schedule_id}`,
    );
  };

  const getWithConflictCountFromTime = (
    data: ClassroomConflictCheck,
    building_id: number,
  ): Promise<AxiosResponse<ClassroomWithConflictCount[]>> => {
    const params = new URLSearchParams();
    params.append('start_time', data.start_time);
    params.append('end_time', data.end_time);
    data.dates.forEach((date) => params.append('dates', date));
    return axios.get(`/classrooms/with-conflict-count/${building_id}`, {
      params,
    });
  };

  const getClassroomsByBuildingId = (
    building_id: number,
  ): Promise<AxiosResponse<ClassroomResponse[]>> => {
    return axios.get(`/classrooms/building/${building_id}`);
  };

  return {
    get,
    getMine,
    getOneFull,
    create,
    deleteById,
    update,
    getWithConflictCount,
    getWithConflictCountFromTime,
    getClassroomsByBuildingId,
  };
};

export default useClassroomsService;
