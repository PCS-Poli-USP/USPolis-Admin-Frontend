import { AxiosResponse } from 'axios';
import HttpService from './http.service';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import {
  ClassroomSolicitationAprove,
  ClassroomSolicitationDeny,
  CreateClassroomSolicitation,
} from 'models/http/requests/classroomSolicitation.request.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class ClassroomSolicitationService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/solicitations/classroom`);
  }

  list(): Promise<AxiosResponse<Array<ClassroomSolicitationResponse>>> {
    return this.http.get('');
  }

  create(
    data: CreateClassroomSolicitation,
  ): Promise<AxiosResponse<ClassroomSolicitationResponse>> {
    return this.http.post('', data);
  }

  approve(
    id: number,
    data: ClassroomSolicitationAprove,
  ): Promise<AxiosResponse<ClassroomSolicitationResponse>> {
    return this.http.put(`/approve/${id}`, data);
  }

  deny(
    id: number,
    data: ClassroomSolicitationDeny,
  ): Promise<AxiosResponse<ClassroomSolicitationResponse>> {
    return this.http.put(`/deny/${id}`, data);
  }

  delete(id: number): Promise<AxiosResponse<undefined>> {
    return this.http.delete(`${id}`);
  }
}
