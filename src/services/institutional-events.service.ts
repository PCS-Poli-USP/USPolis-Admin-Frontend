import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import { InstitutionalEvent } from 'models/institutionalEvent.model';
import { CreateInstitutionalEventRequest } from 'models/interfaces/requests/createInstitutionalEvent.request';
import { UpdateInstitutionalEventRequest } from 'models/interfaces/requests/updateInstitutionalEvent.request';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class InstutionalEventsService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/`);
  }

  list(): Promise<AxiosResponse<Array<InstitutionalEvent>>> {
    return this.http.get('api/mobile/institutional-events');
  }

  create(body: CreateInstitutionalEventRequest): Promise<AxiosResponse> {
    return this.http.post('api/institutional-events', body);
  }

  update(id: string, body: UpdateInstitutionalEventRequest): Promise<AxiosResponse> {
    return this.http.patch(`api/institutional-events/${id}`, body);
  }

  delete(id: string): Promise<AxiosResponse> {
    return this.http.delete(`api/institutional-events/${id}`);
  }
}
