import { AxiosResponse } from 'axios';
import {
  AllocationReuseResponse,
  AllocationEventResponse,
  AllocationResourceResponse,
} from '../../../models/http/responses/allocation.response.models';
import { JSONResponse } from '../../../models/http/responses/common.response.models';
import axios from '../../../services/api/axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import {
  AllocationReuseInput,
  EventUpdate,
} from '../../../models/http/requests/allocation.request.models';

const useAllocationsService = () => {
  const PREFIX = '/allocations';
  const privateAxios = useAxiosPrivate();

  const listEvents = (
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<AllocationEventResponse>>> => {
    if (start && end)
      return axios.get(`${PREFIX}/events`, { params: { start, end } });
    return axios.get(`${PREFIX}/events`);
  };

  const listResources = (): Promise<
    AxiosResponse<Array<AllocationResourceResponse>>
  > => {
    return axios.get(`${PREFIX}/resources`);
  };

  const update = (event: EventUpdate): Promise<AxiosResponse<JSONResponse>> => {
    return privateAxios.patch(`${PREFIX}/events`, event);
  };

  const getAllocationOptions = (
    data: AllocationReuseInput,
  ): Promise<AxiosResponse<AllocationReuseResponse>> => {
    return privateAxios.post(`${PREFIX}/reuse-options`, data);
  };

  return { listEvents, listResources, update, getAllocationOptions };
};

export default useAllocationsService;
