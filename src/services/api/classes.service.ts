import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import {
  ClassResponse,
  ClassFullResponse,
} from 'models/http/responses/class.response.models';
import {
  CreateClass,
  UpdateClass,
} from 'models/http/requests/class.request.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class ClassesService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/classes`);
  }

  list(): Promise<AxiosResponse<Array<ClassResponse>>> {
    return this.http.get('');
  }
  listBySubject(
    subject_id: number,
  ): Promise<AxiosResponse<Array<ClassResponse>>> {
    return this.http.get(`/subject/${subject_id}`);
  }

  listFull(): Promise<AxiosResponse<Array<ClassFullResponse>>> {
    return this.http.get('/full/');
  }

  listOneFull(id: number): Promise<AxiosResponse<ClassFullResponse>> {
    return this.http.get(`/${id}/full/`);
  }
  getById(id: number): Promise<AxiosResponse<ClassResponse>> {
    return this.http.get(`/${id}`);
  }

  create(data: CreateClass): Promise<AxiosResponse<ClassResponse>> {
    return this.http.post('', data);
  }

  // createMany(data: string[]): Promise<AxiosResponse<any>> {
  //   return this.http.post('many', data);
  // }

  update(id: number, data: UpdateClass) {
    return this.http.put(`/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`/${id}`);
  }

  deleteMany(ids: number[]) {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append('ids', id.toString()));

    return this.http.delete('/many/', {
      params: params,
    });
  }
}
