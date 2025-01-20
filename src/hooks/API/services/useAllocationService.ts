import { AxiosResponse } from 'axios';
import { EventResponse, ResourceResponse } from 'models/http/responses/allocation.response.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useALlocationsService = () => {
  const PREFIX = '/allocations';
  const axios = useAxiosPrivate();

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
