import { AxiosResponse } from 'axios';
import {
  CreateInstitutionalEvent,
  UpdateInstitutionalEvent,
} from '../../../models/http/requests/institutionalEvent.request.models';
import { InstitutionalEventResponse } from '../../../models/http/responses/instituionalEvent.response.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useInstitutionalEventsService = () => {
  const PREFIX = '/institutional_events';
  const axios = useAxiosPrivate();

  const list = (): Promise<
    AxiosResponse<Array<InstitutionalEventResponse>>
  > => {
    return axios.get(PREFIX);
  };

  const create = (
    data: CreateInstitutionalEvent,
  ): Promise<AxiosResponse<InstitutionalEventResponse>> => {
    return axios.post(PREFIX, data);
  };

  const update = (
    id: number,
    data: UpdateInstitutionalEvent,
  ): Promise<AxiosResponse<InstitutionalEventResponse>> => {
    return axios.patch(`${PREFIX}/${id}`, data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<undefined>> => {
    return axios.delete(`${PREFIX}/${id}`);
  };

  return { list, create, update, deleteById };
};

export default useInstitutionalEventsService;
