import {
  CreateUser,
  CreateUserResponse,
  EditUser,
  User,
} from 'models/database/user.model';
import HttpService from './http.service';
import { AxiosResponse } from 'axios';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class UsersService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/user`);
  }

  create(data: CreateUser): Promise<AxiosResponse<CreateUserResponse>> {
    return this.http.post('', data);
  }

  list(): Promise<AxiosResponse<Array<User>>> {
    return this.http.get('');
  }

  async update(
    data: EditUser,
    user_id: string,
  ): Promise<AxiosResponse<Number>> {
    return this.http.put(`/${user_id}`, data);
  }

  async delete(user_id: string): Promise<AxiosResponse<any>> {
    return this.http.delete(`/${user_id}`);
  }
}
