import { AxiosResponse } from 'axios';
import Event from 'models/common/event.model';
import useAxiosPrivate from '../axios/useAxiosPrivate';

interface EditManyAllocationsDTO {
  events_ids: string[];
  building_id: number;
  classroom: string;
}

interface EditManyAllocationsInManyBuildingsDTO {
  events_ids: string[];
  buildings_ids: number[];
  classrooms: string[];
}

interface DeleteManyAllocationsDTO {
  events_ids: string[];
}

const useEventsService = () => {
  const axios = useAxiosPrivate();

  const list = (): Promise<AxiosResponse<Array<Event>>> => {
    return axios.get('/events');
  };

  const allocate = (): Promise<AxiosResponse<any>> => {
    return axios.patch('/events/allocate');
  };

  const edit = (
    subjectCode: string,
    classCode: string,
    weekDays: string[],
    classroom: string,
    building: string,
  ): Promise<AxiosResponse<number>> => {
    return axios.patch(`/events/edit/${subjectCode}/${classCode}`, weekDays, {
      params: { classroom, building },
    });
  };

  const loadAllocations = (): Promise<AxiosResponse<any>> => {
    return axios.get('/events/load');
  };

  const editAllocations = (
    allocated_events: Event[],
    unallocated_events: Event[],
  ): Promise<AxiosResponse<any>> => {
    return axios.patch('/events/edit-allocations', {
      allocated_events,
      unallocated_events,
    });
  };
  const deleteOneAllocation = (
    subject_code: string,
    class_code: string,
    week_day: string,
    start_time: string,
  ) => {
    return axios.patch(
      `/events/delete/${subject_code}/${class_code}/${week_day}/${start_time}`,
    );
  };
  const deleteClassAllocation = (subject_code: string, class_code: string) => {
    return axios.patch(`/events/delete/${subject_code}/${class_code}`);
  };

  const deleteAllAllocations = (): Promise<AxiosResponse<number>> => {
    return axios.patch('/events/delete-allocations');
  };

  const deleteAllEvents = (): Promise<AxiosResponse<number>> => {
    return axios.delete('/events/delete-all-events');
  };

  const deleteManyEvents = (
    data: DeleteManyAllocationsDTO,
  ): Promise<AxiosResponse<number>> => {
    return axios.delete('/events/delete-many', { data });
  };

  const editManyAllocations = (
    data: EditManyAllocationsDTO,
  ): Promise<AxiosResponse<any>> => {
    return axios.put('/allocations/update-many', data);
  };

  const editManyAllocationsInManyBuildings = (
    data: EditManyAllocationsInManyBuildingsDTO,
  ): Promise<AxiosResponse<any>> => {
    return axios.put('/allocations/update-many-in-many-buildings', data);
  };

  const deleteManyAllocations = (
    data: DeleteManyAllocationsDTO,
  ): Promise<AxiosResponse<number>> => {
    return axios.delete('/allocations/delete-many', { data });
  };

  return {
    list,
    allocate,
    edit,
    loadAllocations,
    editAllocations,
    deleteOneAllocation,
    deleteClassAllocation,
    deleteAllAllocations,
    deleteAllEvents,
    deleteManyEvents,
    editManyAllocations,
    editManyAllocationsInManyBuildings,
    deleteManyAllocations,
  };
};

export default useEventsService;
