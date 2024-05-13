import { AxiosResponse } from 'axios';
import Event from 'models/database/event.model';
import HttpService from './http.service';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

interface EditManyAllocationsDTO {
  events_ids: string[];
  building_id: string;
  classroom: string;
}

interface EditManyAllocationsInManyBuildingsDTO {
  events_ids: string[];
  buildings_ids: string[];
  classrooms: string[];
}

interface DeleteManyAllocationsDTO {
  events_ids: string[];
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
    return this.http.patch(
      `/events/edit/${subjectCode}/${classCode}`,
      weekDays,
      {
        params: { classroom, building },
      },
    );
  }

  loadAllocations(): Promise<AxiosResponse<any>> {
    return this.http.get('/events/load');
  }

  editAllocations(
    allocated_events: Event[],
    unallocated_events: Event[],
  ): Promise<AxiosResponse<any>> {
    return this.http.patch('/events/edit-allocations', {
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

  deleteAllEvents(): Promise<AxiosResponse<number>> {
    return this.http.delete('/events/delete-all-events');
  }

  deleteManyEvents(
    data: DeleteManyAllocationsDTO,
  ): Promise<AxiosResponse<number>> {
    return this.http.delete('/events/delete-many', { data });
  }

  editManyAllocations(
    data: EditManyAllocationsDTO,
  ): Promise<AxiosResponse<any>> {
    return this.http.put('/allocations/update-many', data);
  }

  editManyAllocationsInManyBuildings(
    data: EditManyAllocationsInManyBuildingsDTO,
  ): Promise<AxiosResponse<any>> {
    return this.http.put('/allocations/update-many-in-many-buildings', data);
  }

  deleteManyAllocations(
    data: DeleteManyAllocationsDTO,
  ): Promise<AxiosResponse<number>> {
    return this.http.delete('/allocations/delete-many', { data });
  }
}
