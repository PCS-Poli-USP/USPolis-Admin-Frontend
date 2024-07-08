import { AxiosResponse } from 'axios';
import Classroom, {
  AvailableClassroom,
  ClassroomSchedule,
} from 'models/common/classroom.model';
import HttpService from './http.service';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

interface GetAvailableWithConflictIndicatorProps {
  events_ids: string[];
  building_id: number;
}

interface GetClassroomsSchedulesProps {
  classrooms: string[];
  buildings: string[];
}

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

  delete(id: string): Promise<AxiosResponse<any>> {
    return this.http.delete(`/${id}`);
  }

  update(id: string, data: any): Promise<AxiosResponse<any>> {
    console.log("updating...")
    return this.http.put(`/${id}`, data);
  }

  getAvailable(
    week_day: string,
    start_time: string,
    end_time: string,
  ): Promise<AxiosResponse<AvailableClassroom[]>> {
    return this.http.get('available', {
      params: { week_day, start_time, end_time },
    });
  }

  async getAvailableWithConflictIndicator(
    data: GetAvailableWithConflictIndicatorProps,
  ): Promise<AxiosResponse<AvailableClassroom[]>> {
    const response = await this.http.post(
      'available-with-conflict-check',
      data,
    );
    return response;
  }

  getClassroomsByBuilding(
    building: string,
  ): Promise<AxiosResponse<Classroom[]>> {
    return this.http.get(`/${building}`);
  }

  getAllSchedules() {
    return this.http.get('schedules');
  }

  getClassroomSchedule(
    classroom: string,
    building: string,
  ): Promise<AxiosResponse<ClassroomSchedule>> {
    return this.http.get('/classroom-schedule', {
      params: { classroom, building },
    });
  }

  getClassroomsSchedulesByBuilding(
    building: string,
  ): Promise<AxiosResponse<ClassroomSchedule[]>> {
    return this.http.get(`/${building}/classrooms-schedules`);
  }

  async getManyClassroomsSchedules(
    data: GetClassroomsSchedulesProps,
  ): Promise<AxiosResponse<ClassroomSchedule[]>> {
    const response = await this.http.get('/many-classrooms-schedules', {
      params: { classrooms: data.classrooms, buildings: data.buildings },
    });
    return response;
  }
}
