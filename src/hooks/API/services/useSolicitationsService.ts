import { AxiosResponse } from 'axios';
import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import {
  ApproveSolicitation,
  DenySolicitation,
  CreateSolicitation,
} from '../../../models/http/requests/solicitation.request.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { PageSize } from '../../../utils/enums/pageSize.enum';
import { PaginatedResponse } from '../../../models/http/responses/paginated.response.models';

const useSolicitationsService = () => {
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

  const getAllPaginated = (
    page?: number,
    page_size?: number,
  ): Promise<AxiosResponse<PaginatedResponse<SolicitationResponse>>> => {
    if (!page) page = 1;
    if (!page_size) page_size = PageSize.SIZE_10;
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('page_size', String(page_size));
    return axios.get(`${PREFIX}`, { params });
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
    data: CreateSolicitation,
  ): Promise<AxiosResponse<SolicitationResponse>> => {
    return axios.post(PREFIX, data);
  };

  const approve = (
    id: number,
    data: ApproveSolicitation,
  ): Promise<AxiosResponse<SolicitationResponse>> => {
    return axios.put(`${PREFIX}/approve/${id}`, data);
  };

  const deny = (
    id: number,
    data: DenySolicitation,
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
    getAllPaginated,
    getPending,
    getMySolicitations,
    create,
    approve,
    deny,
    deleteById,
    cancel,
  };
};

export default useSolicitationsService;
