import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { JSONResponse } from '../../../models/http/responses/common.response.models';

import { Resource } from '../../../utils/enums/resources.enums';
import {
  CreateBatchPermission,
  CreatePermission,
  UpdatePermission,
} from '../../../models/http/requests/permission.request.models';
import { PermissionResponse } from '../../../models/http/responses/permissions.response.models';

const usePermissionsService = () => {
  const PREFIX = '/admin/permissions';
  const axios = useAxiosPrivate();

  const get = (
    resource: Resource,
  ): Promise<AxiosResponse<PermissionResponse[]>> => {
    const urlParams = new URLSearchParams({ resource });
    return axios.get(`${PREFIX}`, { params: urlParams });
  };

  const getAll = (): Promise<AxiosResponse<PermissionResponse[]>> => {
    return axios.get(`${PREFIX}/all`);
  };

  const getPermissionsById = (
    permission_id: number,
    resource: Resource,
  ): Promise<AxiosResponse<PermissionResponse>> => {
    const urlParams = new URLSearchParams({ resource });
    return axios.get(`${PREFIX}/${permission_id}`, { params: urlParams });
  };

  const create = (
    data: CreatePermission,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.post(`${PREFIX}`, data);
  };

  const createBatch = (
    data: CreateBatchPermission,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.post(`${PREFIX}/batch`, data);
  };

  const update = (
    id: number,
    data: UpdatePermission,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.patch(`${PREFIX}/${id}`, data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<JSONResponse>> => {
    return axios.delete(`${PREFIX}/${id}`);
  };

  return {
    get,
    getAll,
    getPermissionsById,
    create,
    createBatch,
    update,
    deleteById,
  };
};

export default usePermissionsService;
