import { AxiosResponse } from 'axios';
import { EventResponse } from 'models/http/responses/allocation.response.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useALlocationsService = () => {
  const PREFIX = '/allocations';
  const axios = useAxiosPrivate();

  const list = (
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<EventResponse>>> => {
    if (start && end)
      return axios.get(`${PREFIX}/events`, { params: { start, end } });
    return axios.get(`${PREFIX}/events`);
  };

  return { list };
};

export default useALlocationsService;
