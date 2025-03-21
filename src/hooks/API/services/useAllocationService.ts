import { AxiosResponse } from 'axios';
import {
  EventResponse,
  ResourceResponse,
} from 'models/http/responses/allocation.response.models';
import { JSONResponse } from 'models/http/responses/common.response.models';
import axios from 'services/api/axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { EventUpdate } from 'models/http/requests/allocation.request.models';

const useAllocationsService = () => {
  const PREFIX = '/allocations';
  const privateAxios = useAxiosPrivate();

  const listEvents = (
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<EventResponse>>> => {
    if (start && end)
      return axios.get(`${PREFIX}/events`, { params: { start, end } });
    return axios.get(`${PREFIX}/events`);
  };

  const listResources = (): Promise<AxiosResponse<Array<ResourceResponse>>> => {
    return axios.get(`${PREFIX}/resources`);
  };

  const update = (
    event: EventUpdate,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return privateAxios.patch(`${PREFIX}/events`, event);
  };

  return { listEvents, listResources, update };
};

export default useAllocationsService;
