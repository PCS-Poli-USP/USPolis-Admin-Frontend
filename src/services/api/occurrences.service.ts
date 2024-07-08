import { AxiosResponse } from 'axios';
import HttpService from './http.service';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export interface AllocateManySchedulesData {
  schedule_id: number;
  classroom_id: number;
}

export default class OccurrencesService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/occurrences`);
  }

  allocate_many_schedules(
    data: AllocateManySchedulesData[],
  ): Promise<AxiosResponse<any>> {
    return this.http.post('allocate-schedule-many', data);
  }
}
