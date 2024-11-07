import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import {
  CreateHolidayCategory,
  UpdateHolidayCategory,
} from 'models/http/requests/holidayCategory.request.models';
import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class HolidaysCategoriesService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/holidays_categories`);
  }

  list(): Promise<AxiosResponse<Array<HolidayCategoryResponse>>> {
    return this.http.get('');
  }

  create(data: CreateHolidayCategory): Promise<AxiosResponse<HolidayCategoryResponse>> {
    return this.http.post('', data);
  }

  delete(id: number): Promise<AxiosResponse<string>> {
    return this.http.delete(`/${id}`);
  }

  update(
    id: number,
    data: UpdateHolidayCategory,
  ): Promise<AxiosResponse<HolidayCategoryResponse>> {
    return this.http.put(`/${id}`, data);
  }
}
