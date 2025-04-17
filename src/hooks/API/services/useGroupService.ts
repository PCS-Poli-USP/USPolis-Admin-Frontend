import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { GroupResponse } from '../../../models/http/responses/group.response.models';
import { JSONResponse } from '../../../models/http/responses/common.response.models';
import {
  GroupRequest,
  GroupUpdate,
} from '../../../models/http/requests/group.request.models';

const useGroupService = () => {
  const PREFIX = '/admin/groups';
  const axios = useAxiosPrivate();

  const list = (): Promise<AxiosResponse<Array<GroupResponse>>> => {
    return axios.get(PREFIX);
  };

  const listById = (id: number): Promise<AxiosResponse<GroupResponse>> => {
    return axios.get(`${PREFIX}/${id}`);
  };
  const create = (
    input: GroupRequest,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.post(`${PREFIX}`, input);
  };
  const update = (
    id: number,
    input: GroupUpdate,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.patch(`${PREFIX}/${id}`, input);
  };
  const remove = (id: number): Promise<AxiosResponse<JSONResponse>> => {
    return axios.delete(`${PREFIX}/${id}`);
  };
  return {
    list,
    listById,
    create,
    update,
    remove,
  };
};

export default useGroupService;
