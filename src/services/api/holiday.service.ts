import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import {
  CreateHoliday,
  UpdateHoliday,
} from 'models/http/requests/holiday.request.models';
import { HolidayResponse } from 'models/http/responses/holiday.response.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class HolidaysService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/holidays`);
  }

  list(): Promise<AxiosResponse<Array<HolidayResponse>>> {
    return this.http.get('');
  }

  create(data: CreateHoliday): Promise<AxiosResponse<HolidayResponse>> {
    return this.http.post('', data);
  }

  delete(id: number): Promise<AxiosResponse<string>> {
    return this.http.delete(`/${id}`);
  }

  update(id: number, data: UpdateHoliday): Promise<AxiosResponse<HolidayResponse>> {
    return this.http.put(`/${id}`, data);
  }
}
