import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import { InstitutionalEvent } from 'models/institutionalEvent.model';
import { CreateInstitutionalEventRequest } from 'models/interfaces/requests/createInstitutionalEvent.request';
import { UpdateInstitutionalEventRequest } from 'models/interfaces/requests/updateInstitutionalEvent.request';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class InstutionalEventsService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/institutional-events`);
  }

  list(): Promise<AxiosResponse<Array<InstitutionalEvent>>> {
    return this.http.get('');
  }

  create(body: CreateInstitutionalEventRequest): Promise<AxiosResponse> {
    return this.http.post('', body);
  }

  update(id: string, body: UpdateInstitutionalEventRequest): Promise<AxiosResponse> {
    return this.http.patch(`/${id}`, body);
  }

  delete(id: string): Promise<AxiosResponse> {
    return this.http.delete(`/${id}`);
  }
}
