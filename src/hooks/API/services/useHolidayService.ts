import { AxiosResponse } from 'axios';
import {
  CreateHoliday,
  CreateManyHolidays,
  UpdateHoliday,
} from '../../../models/http/requests/holiday.request.models';
import { HolidayResponse } from '../../../models/http/responses/holiday.response.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useHolidaysService = () => {
  const PREFIX = '/holidays';
  const axios = useAxiosPrivate();

  const list = (): Promise<AxiosResponse<Array<HolidayResponse>>> => {
    return axios.get(PREFIX);
  };

  const create = (
    data: CreateHoliday,
  ): Promise<AxiosResponse<HolidayResponse>> => {
    return axios.post(PREFIX, data);
  };

  const createMany = (
    data: CreateManyHolidays,
  ): Promise<AxiosResponse<Array<HolidayResponse>>> => {
    return axios.post(`${PREFIX}/many`, data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<string>> => {
    return axios.delete(`${PREFIX}/${id}`);
  };

  const update = (
    id: number,
    data: UpdateHoliday,
  ): Promise<AxiosResponse<HolidayResponse>> => {
    return axios.put(`${PREFIX}/${id}`, data);
  };

  return { list, create, createMany, deleteById, update };
};

export default useHolidaysService;
