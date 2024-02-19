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
    return this.http.get('');
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
    return this.http.patch(`/events/edit/${subjectCode}/${classCode}`, weekDays, { params: { classroom, building } });
  }

  editManyAllocations(data: EditManyAllocationsDTO
  ): Promise<AxiosResponse<any>> {
    return this.http.put('/allocations/update-many', data);
  }
}
