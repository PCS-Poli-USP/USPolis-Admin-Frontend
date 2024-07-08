import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import { CreateSubject, UpdateSubject } from 'models/http/requests/subject.request.models';
import { SubjectResponse } from 'models/http/responses/subject.response.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class SubjectsService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/subjects`);
  }

  list(): Promise<AxiosResponse<Array<SubjectResponse>>> {
    return this.http.get('');
  }

  create(data: CreateSubject): Promise<AxiosResponse<SubjectResponse>> {
    return this.http.post('', data);
  }

  delete(id: number): Promise<AxiosResponse<undefined>> {
    return this.http.delete(`/${id}`);
  }

  update(id: number, data: UpdateSubject): Promise<AxiosResponse<SubjectResponse>> {
    return this.http.put(`/${id}`, data);
  }
}
