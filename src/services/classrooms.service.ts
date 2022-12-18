import { AxiosResponse } from 'axios';
import Classroom, { AvailableClassroom } from 'models/classroom.model';
import HttpService from './http.service';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class ClassroomsService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/classrooms`);
  }

  list(): Promise<AxiosResponse<Array<Classroom>>> {
    return this.http.get('');
  }

  create(data: any): Promise<AxiosResponse<any>> {
    return this.http.post('', data);
  }

  delete(name: string): Promise<AxiosResponse<any>> {
    return this.http.delete(name);
  }

  update(name: string, data: any): Promise<AxiosResponse<any>> {
    return this.http.put(name, data);
  }
  getAvailable(week_day: string, start_time: string, end_time: string): Promise<AxiosResponse<AvailableClassroom[]>> {
    return this.http.get('available', { params: { week_day, start_time, end_time } });
  }
}
