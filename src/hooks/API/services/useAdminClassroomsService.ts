import { AxiosResponse } from 'axios';
import Classroom from '../../../models/common/classroom.model';
import useAxiosPrivate from '../axios/useAxiosPrivate';

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

const useAdminClassroomsService = () => {
  const PREFIX = '/admin-classrooms';
  const axios = useAxiosPrivate();

  const list = (): Promise<AxiosResponse<Array<Classroom>>> => {
    return axios.get(PREFIX);
  };

  const update = (
    id: string | undefined,
    data: AdminUpdateClassroom,
  ): Promise<AxiosResponse<any>> => {
    if (!id) throw new Error('Id is required');
    return axios.put(`${PREFIX}/${id}`, data);
  };

  return { list, update };
};

export default useAdminClassroomsService;
