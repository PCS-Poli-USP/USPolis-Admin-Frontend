import { AxiosResponse } from 'axios';
import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import {
  ClassroomSolicitationAprove,
  ClassroomSolicitationDeny,
  CreateClassroomSolicitation,
} from '../../../models/http/requests/solicitation.request.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useClassroomSolicitationsService = () => {
  const PREFIX = '/solicitations';
  const axios = useAxiosPrivate();

  const getAll = (
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<SolicitationResponse>>> => {
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
    AxiosResponse<Array<SolicitationResponse>>
  > => {
    return axios.get(`${PREFIX}/pending`);
  };

  const getMySolicitations = (): Promise<
    AxiosResponse<Array<SolicitationResponse>>
  > => {
    return axios.get('/users/my-solicitations');
  };

  const create = (
    data: CreateClassroomSolicitation,
  ): Promise<AxiosResponse<SolicitationResponse>> => {
    return axios.post(PREFIX, data);
  };

  const approve = (
    id: number,
    data: ClassroomSolicitationAprove,
  ): Promise<AxiosResponse<SolicitationResponse>> => {
    return axios.put(`${PREFIX}/approve/${id}`, data);
  };

  const deny = (
    id: number,
    data: ClassroomSolicitationDeny,
  ): Promise<AxiosResponse<SolicitationResponse>> => {
    return axios.put(`${PREFIX}/deny/${id}`, data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<undefined>> => {
    return axios.delete(`${PREFIX}/${id}`);
  };

  const cancel = (id: number): Promise<AxiosResponse<SolicitationResponse>> => {
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
