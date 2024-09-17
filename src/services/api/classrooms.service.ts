import { AxiosResponse } from 'axios';
import { ClassroomWithConflictCount } from 'models/common/classroom.model';
import HttpService from './http.service';
import {
  ClassroomFullResponse,
  ClassroomResponse,
} from 'models/http/responses/classroom.response.models';
import {
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
  ): Promise<AxiosResponse<ClassroomWithConflictCount[]>> {
    return this.http.get(`with-conflict-count/${building_id}/${schedule_id}`);
  }

  getClassroomsByBuildingId(
    building_id: number,
  ): Promise<AxiosResponse<ClassroomResponse[]>> {
    return this.http.get(`/building/${building_id}`);
  }
}
