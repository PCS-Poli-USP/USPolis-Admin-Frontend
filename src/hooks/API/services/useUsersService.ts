import useAxiosPrivate from '../axios/useAxiosPrivate';
import {
  CreateUser,
  UpdateUser,
} from '../../../models/http/requests/user.request.models';
import { AxiosResponse } from 'axios';
import { UserResponse } from '../../../models/http/responses/user.response.models';

const useUsersService = () => {
  const PREFIX = '/admin/users';
  const axios = useAxiosPrivate();

  const create = (data: CreateUser): Promise<AxiosResponse<UserResponse>> => {
    return axios.post(PREFIX, data);
  };

  const list = (): Promise<AxiosResponse<Array<UserResponse>>> => {
    return axios.get(PREFIX);
  };

  const update = (
    user_id: Number,
    data: UpdateUser,
  ): Promise<AxiosResponse<Number>> => {
    return axios.put(`${PREFIX}/${user_id}`, data);
  };

  const deleteById = (user_id: number): Promise<AxiosResponse<any>> => {
    return axios.delete(`${PREFIX}/${user_id}`);
  };

  return { create, list, update, deleteById };
};

export default useUsersService;
