import { User } from 'models/common/user.common.model';
import HttpService from './http.service';
import { AxiosResponse } from 'axios';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class SelfService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/users`);
  }

  getSelf(): Promise<AxiosResponse<User>> {
    return this.http.get('');
  }
}
