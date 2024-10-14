// import {
//   CreateUser,
//   CreateUserResponse,
//   EditUser,
//   User,
// } from 'models/common/user.common.model';
import { CreateUser, UpdateUser } from 'models/http/requests/user.request.models';
import HttpService from './http.service';
import { AxiosResponse } from 'axios';
import { UserResponse } from 'models/http/responses/user.response.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class UsersService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/admin/users`);
  }

  create(data: CreateUser): Promise<AxiosResponse<UserResponse>> {
    return this.http.post('', data);
  }

  list(): Promise<AxiosResponse<Array<UserResponse>>> {
    return this.http.get('');
  }

  async update(
    user_id: Number,
    data: UpdateUser,
  ): Promise<AxiosResponse<Number>> {
    return this.http.put(`/${user_id}`, data);
  }

  async delete(user_id: number): Promise<AxiosResponse<any>> {
    return this.http.delete(`/${user_id}`);
  } 
}
