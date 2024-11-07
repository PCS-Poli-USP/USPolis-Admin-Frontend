import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import { CalendarResponse } from 'models/http/responses/calendar.responde.models';
import {
  CreateCalendar,
  UpdateCalendar,
} from 'models/http/requests/calendar.request.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class CalendarsService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/calendars`);
  }

  list(): Promise<AxiosResponse<Array<CalendarResponse>>> {
    return this.http.get('');
  }

  create(data: CreateCalendar): Promise<AxiosResponse<CalendarResponse>> {
    return this.http.post('', data);
  }

  update(
    id: number,
    data: UpdateCalendar,
  ): Promise<AxiosResponse<CalendarResponse>> {
    return this.http.put(`${id}`, data);
  }

  delete(id: number): Promise<AxiosResponse<undefined>> {
    return this.http.delete(`${id}`);
  }
}
