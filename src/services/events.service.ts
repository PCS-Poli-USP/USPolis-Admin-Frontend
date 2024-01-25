import { AxiosResponse } from 'axios';
import Event from 'models/event.model';
import HttpService from './http.service';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class EventsService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}/events`);
  }

  list(): Promise<AxiosResponse<Array<Event>>> {
    return this.http.get('');
  }

  allocate(): Promise<AxiosResponse<any>> {
    return this.http.patch('allocate');
  }

  edit(
    subjectCode: string,
    classCode: string,
    weekDays: string[],
    classroom: string,
    building: string,
  ): Promise<AxiosResponse<number>> {
    return this.http.patch(`edit/${subjectCode}/${classCode}`, weekDays, {
      params: { classroom, building },
    });
  }

  loadAllocations(): Promise<AxiosResponse<any>> {
    return this.http.get('load');
  }

  editAllocations(
    allocated_events: Event[],
    unallocated_events: Event[],
  ): Promise<AxiosResponse<any>> {
    return this.http.patch('edit-allocations', {allocated_events, unallocated_events});
  }
  deleteOneAllocation(
    subject_code: string,
    class_code: string,
    week_day: string,
    start_time: string,
  ) {
    return this.http.patch(
      `delete/${subject_code}/${class_code}/${week_day}/${start_time}`,
    );
  }

  deleteClassAllocation(subject_code: string, class_code: string) {
    return this.http.patch(`delete/${subject_code}/${class_code}`);
  }

  deleteAllAllocations(): Promise<AxiosResponse<number>> {
    return this.http.patch('delete-allocations');
  }
}
