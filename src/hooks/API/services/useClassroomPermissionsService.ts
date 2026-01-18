import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { JSONResponse } from '../../../models/http/responses/common.response.models';
import {
  CreateClassroomPermission,
  CreateManyClassroomPermission,
  UpdateClassroomPermission,
} from '../../../models/http/requests/classroomPermission.request.models';
import {
  ClassroomPermissionByClassroomResponse,
  ClassroomPermissionByUserResponse,
  ClassroomPermissionResponse,
} from '../../../models/http/responses/classroomPermission.response.models';

const useClassroomPermissionsService = () => {
  const PREFIX = '/classroom_permissions';
  const axios = useAxiosPrivate();

  const get = (): Promise<AxiosResponse<ClassroomPermissionResponse[]>> => {
    return axios.get(`${PREFIX}`);
  };

  const getPermissionsByClassrooms = (): Promise<
    AxiosResponse<ClassroomPermissionByClassroomResponse[]>
  > => {
    return axios.get(`${PREFIX}/classrooms`);
  };

  const getPermissionsByUsers = (): Promise<
    AxiosResponse<ClassroomPermissionByUserResponse[]>
  > => {
    return axios.get(`${PREFIX}/users`);
  };

  const create = (
    data: CreateClassroomPermission,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.post(`${PREFIX}`, data);
  };

  const createMany = (
    data: CreateManyClassroomPermission,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.post(`${PREFIX}/many`, data);
  };

  const update = (
    id: number,
    data: UpdateClassroomPermission,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.patch(`${PREFIX}/${id}`, data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<JSONResponse>> => {
    return axios.delete(`${PREFIX}/${id}`);
  };

  return {
    get,
    getPermissionsByClassrooms,
    getPermissionsByUsers,
    create,
    createMany,
    update,
    deleteById,
  };
};

export default useClassroomPermissionsService;
