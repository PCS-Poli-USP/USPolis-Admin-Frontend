import { AxiosResponse } from 'axios';
import {
  EventResponse,
  ResourceResponse,
} from 'models/http/responses/allocation.response.models';
import axios from 'services/api/axios';

const useALlocationsService = () => {
  const PREFIX = '/allocations';

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

  return { listEvents, listResources };
};

export default useALlocationsService;
