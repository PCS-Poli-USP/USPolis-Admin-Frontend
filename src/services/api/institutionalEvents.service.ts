import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import {
  CreateInstitutionalEvent,
  UpdateInstitutionalEvent,
} from 'models/http/requests/institutionalEvent.request.models';
import { InstitutionalEventResponse } from 'models/http/responses/instituionalEvent.response.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class InstutionalEventsService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/institutional_events`);
  }

  list(): Promise<AxiosResponse<Array<InstitutionalEventResponse>>> {
    return this.http.get('');
  }

  create(
    data: CreateInstitutionalEvent,
  ): Promise<AxiosResponse<InstitutionalEventResponse>> {
    return this.http.post('', data);
  }

  update(
    id: number,
    data: UpdateInstitutionalEvent,
  ): Promise<AxiosResponse<InstitutionalEventResponse>> {
    return this.http.patch(`/${id}`, data);
  }

  delete(id: number): Promise<AxiosResponse<undefined>> {
    return this.http.delete(`/${id}`);
  }
}
