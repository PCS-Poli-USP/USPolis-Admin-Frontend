import { AxiosResponse } from 'axios';
import Class, { EditClassEvents, HasToBeAllocatedClass, Preferences } from 'models/class.model';
import HttpService from './http.service';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class ClassesService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/classes`);
  }

  list(): Promise<AxiosResponse<Array<Class>>> {
    return this.http.get('');
  }

  createMany(data: string[]): Promise<AxiosResponse<any>> {
    return this.http.post('many', data);
  }

  delete(subject_code: string, class_code: string) {
    return this.http.delete(`${subject_code}/${class_code}`);
  }

  patchPreferences(subjectCode: string, classCode: string, data: Preferences) {
    return this.http.patch(`preferences/${subjectCode}/${classCode}`, data);
  }

  edit(subjectCode: string, classCode: string, data: EditClassEvents[]) {
    return this.http.patch(`${subjectCode}/${classCode}`, data);
  }

  editHasToBeAllocated(data: HasToBeAllocatedClass[]) {
    return this.http.patch('has-to-be-allocated', data);
  }
}
