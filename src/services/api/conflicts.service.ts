import Conflict from 'models/common/conflict.model';
import HttpService from './http.service';
import { AxiosResponse } from 'axios';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class ClonflictsService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/conflicts`);
  }

  list(): Promise<AxiosResponse<Conflict>> {
    return this.http.get('');
  }
}
