import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import { ScheduleUpdateOccurences } from 'models/http/requests/schedule.request.models';
import { ScheduleFullResponse } from 'models/http/responses/schedule.response.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class ScheduleService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/schedules`);
  }

  updateOccurences(
    id: number,
    data: ScheduleUpdateOccurences,
  ): Promise<AxiosResponse<ScheduleFullResponse>> {
    console.log(data);
    return this.http.patch(`/${id}/edit-occurrences`, data);
  }
}
