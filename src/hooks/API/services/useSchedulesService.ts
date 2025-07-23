import { AxiosResponse } from 'axios';
import {
  CreateManySchedule,
  ScheduleUpdateOccurences,
} from '../../../models/http/requests/schedule.request.models';
import { ScheduleFullResponse } from '../../../models/http/responses/schedule.response.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { JSONResponse } from '../../../models/http/responses/common.response.models';

const useScheduleService = () => {
  const PREFIX = '/schedules';
  const axios = useAxiosPrivate();

  const updateOccurences = (
    id: number,
    data: ScheduleUpdateOccurences,
  ): Promise<AxiosResponse<ScheduleFullResponse>> => {
    return axios.patch(`${PREFIX}/${id}/edit-occurrences`, data);
  };

  const createManyForClasses = (
    data: CreateManySchedule,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.post(`${PREFIX}/create-many-for-classes`, data);
  };

  return { updateOccurences, createManyForClasses };
};

export default useScheduleService;
