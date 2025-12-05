import useAxiosPrivate from '../axios/useAxiosPrivate';
import {
  CreateUser,
  UpdateUser,
} from '../../../models/http/requests/user.request.models';
import { AxiosResponse } from 'axios';
import { UserCoreResponse, UserResponse } from '../../../models/http/responses/user.response.models';
import { JSONResponse } from '../../../models/http/responses/common.response.models';

const useUsersService = () => {
  const PREFIX = '/admin/users';
  const axios = useAxiosPrivate();

  const create = (data: CreateUser): Promise<AxiosResponse<UserResponse>> => {
    return axios.post(PREFIX, data);
  };

  const list = (): Promise<AxiosResponse<Array<UserCoreResponse>>> => {
    return axios.get(PREFIX);
  };

  const update = (
    user_id: number,
    data: UpdateUser,
  ): Promise<AxiosResponse<number>> => {
    return axios.put(`${PREFIX}/${user_id}`, data);
  };

  const deleteById = (
    user_id: number,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.delete(`${PREFIX}/${user_id}`);
  };

  const updateEmailNotifications = (
    receive_emails: boolean,
  ): Promise<AxiosResponse<UserResponse>> => {
    return axios.patch(`/users/notifications/email`, null, {
      params: { receive_emails },
    });
  };

  return { create, list, update, deleteById, updateEmailNotifications };
};

export default useUsersService;
