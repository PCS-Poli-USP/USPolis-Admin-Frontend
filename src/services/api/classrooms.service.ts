import { AxiosResponse } from 'axios';
import { ClassroomWithConflictCount as ClassroomWithConflictCountOLD } from 'models/common/classroom.model';
import HttpService from './http.service';
import {
  ClassroomFullResponse,
  ClassroomResponse,
  ClassroomWithConflictCount
} from 'models/http/responses/classroom.response.models';
import {
  ClassroomConflictCheck,
  CreateClassroom,
  UpdateClassroom,
} from 'models/http/requests/classroom.request.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class ClassroomsService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/classrooms`);
  }

  list(): Promise<AxiosResponse<Array<ClassroomResponse>>> {
    return this.http.get('');
  }

  listOneFull(id: number): Promise<AxiosResponse<ClassroomFullResponse>> {
    return this.http.get(`/full/${id}`);
  }

  create(data: CreateClassroom): Promise<AxiosResponse<ClassroomResponse>> {
    return this.http.post('', data);
  }

  delete(id: number): Promise<AxiosResponse<undefined>> {
    return this.http.delete(`/${id}`);
  }

  update(
    id: number,
    data: UpdateClassroom,
  ): Promise<AxiosResponse<ClassroomResponse>> {
    return this.http.put(`/${id}`, data);
  }

  getWithConflictCount(
    schedule_id: number,
    building_id: number,
  ): Promise<AxiosResponse<ClassroomWithConflictCountOLD[]>> {
    return this.http.get(`with-conflict-count/${building_id}/${schedule_id}`);
  }

  getWithConflictCountFromTime(
    data: ClassroomConflictCheck,
    building_id: number,
  ): Promise<AxiosResponse<ClassroomWithConflictCount[]>> {
    const params = new URLSearchParams();
    params.append('start_time', data.start_time);
    params.append('end_time', data.end_time);
    data.dates.forEach((date) => params.append('dates', date));
    return this.http.get(`with-conflict-count/${building_id}`, { params });
  }

  getClassroomsByBuildingId(
    building_id: number,
  ): Promise<AxiosResponse<ClassroomResponse[]>> {
    return this.http.get(`/building/${building_id}`);
  }
}
