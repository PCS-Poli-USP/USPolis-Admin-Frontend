import { AxiosResponse } from 'axios';
import { ClassroomSolicitationResponse } from '../../../models/http/responses/classroomSolicitation.response.models';
import {
  ClassroomSolicitationAprove,
  ClassroomSolicitationDeny,
  CreateClassroomSolicitation,
} from '../../../models/http/requests/classroomSolicitation.request.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useClassroomSolicitationsService = () => {
  const PREFIX = '/solicitations/classroom';
  const axios = useAxiosPrivate();

  const getAll = (
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<ClassroomSolicitationResponse>>> => {
    const params = new URLSearchParams();
    if (start && end) {
      params.append('start', start);
      params.append('end', end);
    }
    return axios.get(`${PREFIX}`, {
      params,
    });
  };

  const getPending = (): Promise<
    AxiosResponse<Array<ClassroomSolicitationResponse>>
  > => {
    return axios.get(`${PREFIX}/pending`);
  };

  const getMySolicitations = (): Promise<
    AxiosResponse<Array<ClassroomSolicitationResponse>>
  > => {
    return axios.get('/users/my-solicitations');
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

  const cancel = (
    id: number,
  ): Promise<AxiosResponse<ClassroomSolicitationResponse>> => {
    return axios.patch(`${PREFIX}/cancel/${id}`);
  };

  return {
    getAll,
    getPending,
    getMySolicitations,
    create,
    approve,
    deny,
    deleteById,
    cancel,
  };
};

export default useClassroomSolicitationsService;
