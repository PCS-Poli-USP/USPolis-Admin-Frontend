import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import { ClassResponse } from 'models/http/responses/class.response.models';
import { CreateClass, UpdateClass } from 'models/http/requests/class.request.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class ClassesService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/classes`);
  }

  list(): Promise<AxiosResponse<Array<ClassResponse>>> {
    return this.http.get('');
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

  // patchPreferences(subjectCode: string, classCode: string, data: Preferences) {
  //   return this.http.patch(`preferences/${subjectCode}/${classCode}`, data);
  // }

  // edit(subjectCode: string, classCode: string, data: CreateClassEvents[]) {
  //   return this.http.patch(`${subjectCode}/${classCode}`, data);
  // }

  // editHasToBeAllocated(data: HasToBeAllocatedClass[]) {
  //   return this.http.patch('has-to-be-allocated', data);
  // }
}
