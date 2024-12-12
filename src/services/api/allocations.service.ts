import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import { EventResponse } from 'models/http/responses/allocation.response.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class AllocationService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/allocations`);
  }

  list(
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<EventResponse>>> {
    if (start && end)
      return this.http.get('/events', { params: { start, end } });
    return this.http.get('/events');
  }
}
