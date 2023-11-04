import { CreateUser, CreateUserResponse } from 'models/user.model';
import HttpService from './http.service';
import { AxiosResponse } from 'axios';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class UsersService extends HttpService {
    constructor() {
      super(`${USPOLIS_SERVER_URL}/user`);
    }

    create(data: CreateUser): Promise<AxiosResponse<CreateUserResponse>>{
        return this.http.post('', data);
    }
}