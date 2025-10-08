import { AxiosResponse } from 'axios';
import * as service from '../../../services/api/axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { JSONResponse } from '../../../models/http/responses/common.response.models';
import { EventResponse } from '../../../models/http/responses/event.response.models';
import {
  CreateEvent,
  UpdateEvent,
} from '../../../models/http/requests/event.request.models';

const useEventsService = () => {
  const axiosCommon = service.default;
  const axios = useAxiosPrivate();
  const PREFIX = '/reservations/events';

  const get = (
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<EventResponse>>> => {
    if (start && end) {
      const params = new URLSearchParams();
      params.append('start', start);
      params.append('end', end);
      return axiosCommon.get(`${PREFIX}`, { params });
    }
    return axiosCommon.get(`${PREFIX}`);
  };

  const create = (data: CreateEvent): Promise<AxiosResponse<JSONResponse>> => {
    return axios.post(`${PREFIX}`, data);
  };

  const update = (
    event_id: number,
    data: UpdateEvent,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.put(`${PREFIX}/${event_id}`, data);
  };

  return { get, create, update };
};

export default useEventsService;
