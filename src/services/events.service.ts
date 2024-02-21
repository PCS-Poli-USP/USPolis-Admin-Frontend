import { AxiosResponse } from 'axios';
import Event from 'models/event.model';
import HttpService from './http.service';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

interface EditManyAllocationsDTO {
  events_ids: string[];
  building_id: string;
  classroom: string;
}

export default class EventsService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}`);
  }

  list(): Promise<AxiosResponse<Array<Event>>> {
    return this.http.get('/events');
  }

  allocate(): Promise<AxiosResponse<any>> {
    return this.http.patch('/events/allocate');
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
    return this.http.patch('edit-allocations', {
      allocated_events,
      unallocated_events,
    });
  }
  deleteOneAllocation(
    subject_code: string,
    class_code: string,
    week_day: string,
    start_time: string,
  ) {
    return this.http.patch(
      `/events/delete/${subject_code}/${class_code}/${week_day}/${start_time}`,
    );
  }
  deleteClassAllocation(subject_code: string, class_code: string) {
    return this.http.patch(`/events/delete/${subject_code}/${class_code}`);
  }

  deleteAllAllocations(): Promise<AxiosResponse<number>> {
    return this.http.patch('/events/delete-allocations');
  }
  editManyAllocations(
    data: EditManyAllocationsDTO,
  ): Promise<AxiosResponse<any>> {
    return this.http.put('/allocations/update-many', data);
  }
}
