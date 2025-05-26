import { AxiosResponse } from 'axios';
import {
  CreateHolidayCategory,
  UpdateHolidayCategory,
} from '../../../models/http/requests/holidayCategory.request.models';
import { HolidayCategoryResponse } from '../../../models/http/responses/holidayCategory.response.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useHolidayCategoryService = () => {
  const PREFIX = '/holidays_categories';
  const axios = useAxiosPrivate();

  const list = (): Promise<AxiosResponse<Array<HolidayCategoryResponse>>> => {
    return axios.get(PREFIX);
  };

  const create = (
    data: CreateHolidayCategory,
  ): Promise<AxiosResponse<HolidayCategoryResponse>> => {
    return axios.post(PREFIX, data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<string>> => {
    return axios.delete(`${PREFIX}/${id}`);
  };

  const update = (
    id: number,
    data: UpdateHolidayCategory,
  ): Promise<AxiosResponse<HolidayCategoryResponse>> => {
    return axios.put(`${PREFIX}/${id}`, data);
  };

  return { list, create, deleteById, update };
};

export default useHolidayCategoryService;
