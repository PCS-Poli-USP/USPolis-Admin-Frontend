import { AxiosResponse } from 'axios';
import { CalendarResponse } from 'models/http/responses/calendar.responde.models';
import {
  CreateCalendar,
  UpdateCalendar,
} from 'models/http/requests/calendar.request.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useCalendarsService = () => {
  const PREFIX = '/calendars';
  const axios = useAxiosPrivate();

  const list = (): Promise<AxiosResponse<Array<CalendarResponse>>> => {
    return axios.get(PREFIX);
  };

  const create = (
    data: CreateCalendar,
  ): Promise<AxiosResponse<CalendarResponse>> => {
    return axios.post(PREFIX, data);
  };

  const update = (
    id: number,
    data: UpdateCalendar,
  ): Promise<AxiosResponse<CalendarResponse>> => {
    return axios.put(`${PREFIX}/${id}`, data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<undefined>> => {
    return axios.delete(`${PREFIX}/${id}`);
  };

  return { list, create, update, deleteById };
};

export default useCalendarsService;
