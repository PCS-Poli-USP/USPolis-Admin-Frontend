import { AxiosResponse } from 'axios';
import Classroom from 'models/common/classroom.model';
import HttpService from './http.service';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export interface AdminUpdateClassroom {
  name: string;
  building: string;
  floor: number;
  capacity: number;
  ignore_to_allocate: boolean;
  air_conditioning: boolean;
  projector: boolean;
  accessibility: boolean;
  created_by?: string;
}

export default class AdminClassroomService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/admin-classrooms`);
  }

  list(): Promise<AxiosResponse<Array<Classroom>>> {
    return this.http.get('');
  }

  update(
    id: string | undefined,
    data: AdminUpdateClassroom,
  ): Promise<AxiosResponse<any>> {
    if (!id) throw new Error('Id is required');
    return this.http.put(id, data);
  }
}
