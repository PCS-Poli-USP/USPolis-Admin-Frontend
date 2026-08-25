import useAxiosPrivate from '../axios/useAxiosPrivate';
import {
  CreateUser,
  UpdateUser,
} from '../../../models/http/requests/user.request.models';
import { AxiosResponse } from 'axios';
import {
  UserCoreResponse,
  UserPermissionResponse,
  UserResponse,
} from '../../../models/http/responses/user.response.models';

const useUsersService = () => {
  const PREFIX = '/admin/users';
  const axios = useAxiosPrivate();

  const create = (data: CreateUser): Promise<AxiosResponse<UserResponse>> => {
    return axios.post(PREFIX, data);
  };

  const list = (): Promise<AxiosResponse<Array<UserCoreResponse>>> => {
    return axios.get(PREFIX);
  };

  const listWithPermissions = (): Promise<
    AxiosResponse<Array<UserPermissionResponse>>
  > => {
    return axios.get(`${PREFIX}/permissions`);
  };

  const update = (
    user_id: number,
    data: UpdateUser,
  ): Promise<AxiosResponse<number>> => {
    return axios.put(`${PREFIX}/${user_id}`, data);
  };

  const updateEmailNotifications = (
    receive_emails: boolean,
  ): Promise<AxiosResponse<UserResponse>> => {
    return axios.patch(`/users/notifications/email`, null, {
      params: { receive_emails },
    });
  };

  return {
    create,
    list,
    listWithPermissions,
    update,
    updateEmailNotifications,
  };
};

export default useUsersService;
