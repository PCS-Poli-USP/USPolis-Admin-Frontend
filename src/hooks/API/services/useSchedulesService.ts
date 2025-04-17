import { AxiosResponse } from 'axios';
import { ScheduleUpdateOccurences } from '../../../models/http/requests/schedule.request.models';
import { ScheduleFullResponse } from '../../../models/http/responses/schedule.response.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useScheduleService = () => {
  const PREFIX = '/schedules';
  const axios = useAxiosPrivate();

  const updateOccurences = (
    id: number,
    data: ScheduleUpdateOccurences,
  ): Promise<AxiosResponse<ScheduleFullResponse>> => {
    return axios.patch(`${PREFIX}/${id}/edit-occurrences`, data);
  };

  return { updateOccurences };
};

export default useScheduleService;
