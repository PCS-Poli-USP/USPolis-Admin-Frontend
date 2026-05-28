import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { JSONResponse } from '../../../models/http/responses/common.response.models';
import {
  CreateRole,
  UpdateRole,
} from '../../../models/http/requests/role.request.models';
import { RoleResponse } from '../../../models/http/responses/role.response.models';

const useRolesService = () => {
  const PREFIX = '/admin/roles';
  const axios = useAxiosPrivate();

  const getAll = (): Promise<AxiosResponse<RoleResponse[]>> => {
    return axios.get(PREFIX);
  };

  const getById = (id: number): Promise<AxiosResponse<RoleResponse>> => {
    return axios.get(`${PREFIX}/${id}`);
  };

  const create = (data: CreateRole): Promise<AxiosResponse<JSONResponse>> => {
    return axios.post(PREFIX, data);
  };

  const update = (
    id: number,
    data: UpdateRole,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.put(`${PREFIX}/${id}`, data);
  };

  const deleteRole = (id: number): Promise<AxiosResponse<JSONResponse>> => {
    return axios.delete(`${PREFIX}/${id}`);
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteRole,
  };
};

export default useRolesService;
