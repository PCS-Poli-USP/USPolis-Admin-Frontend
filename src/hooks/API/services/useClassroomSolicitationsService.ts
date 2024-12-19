import { AxiosResponse } from 'axios';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import {
  ClassroomSolicitationAprove,
  ClassroomSolicitationDeny,
  CreateClassroomSolicitation,
} from 'models/http/requests/classroomSolicitation.request.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useClassroomSolicitationsService = () => {
  const PREFIX = '/solicitations/classroom';
  const axios = useAxiosPrivate();

  const list = (): Promise<
    AxiosResponse<Array<ClassroomSolicitationResponse>>
  > => {
    return axios.get(PREFIX);
  };

  const create = (
    data: CreateClassroomSolicitation,
  ): Promise<AxiosResponse<ClassroomSolicitationResponse>> => {
    return axios.post(PREFIX, data);
  };

  const approve = (
    id: number,
    data: ClassroomSolicitationAprove,
  ): Promise<AxiosResponse<ClassroomSolicitationResponse>> => {
    return axios.put(`${PREFIX}/approve/${id}`, data);
  };

  const deny = (
    id: number,
    data: ClassroomSolicitationDeny,
  ): Promise<AxiosResponse<ClassroomSolicitationResponse>> => {
    return axios.put(`${PREFIX}/deny/${id}`, data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<undefined>> => {
    return axios.delete(`${PREFIX}/${id}`);
  };

  return { list, create, approve, deny, deleteById };
};

export default useClassroomSolicitationsService;
