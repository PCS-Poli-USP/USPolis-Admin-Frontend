import HttpService from './http.service';
import { AxiosResponse } from 'axios';
import { UserResponse } from 'models/http/responses/user.response.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class SelfService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/users`);
  }

  getSelf(): Promise<AxiosResponse<UserResponse>> {
    return this.http.get('');
  }
}
