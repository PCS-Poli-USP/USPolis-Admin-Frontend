import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import { GetHolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import {
  CreateHolidayCategory,
  UpdateHolidayCategory,
} from 'models/http/requests/holidayCategory.request.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class HolidaysCategoriesService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/holidays_categories`);
  }

  list(): Promise<AxiosResponse<Array<GetHolidayCategoryResponse>>> {
    return this.http.get('');
  }

  create(data: CreateHolidayCategory): Promise<AxiosResponse<string>> {
    return this.http.post('', data);
  }

  delete(id: string): Promise<AxiosResponse<number>> {
    return this.http.delete(id);
  }

  update(
    id: string,
    data: UpdateHolidayCategory,
  ): Promise<AxiosResponse<string>> {
    return this.http.put(id, data);
  }
}
