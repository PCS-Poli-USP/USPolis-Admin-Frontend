import { AxiosResponse } from 'axios';
import { OccurrenceResponse } from '../../../models/http/responses/occurrence.response.models';
import { ScheduleFullResponse } from '../../../models/http/responses/schedule.response.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export interface AllocateManySchedulesData {
  schedule_id: number;
  classroom_id: number;
  intentional_conflict: boolean;
  intentional_occurrence_ids: number[];
}

const useOcurrencesService = () => {
  const PREFIX = '/occurrences';
  const axios = useAxiosPrivate();

  const list = (): Promise<AxiosResponse<OccurrenceResponse[]>> => {
    return axios.get(PREFIX);
  };

  const allocate_many_schedules = (
    data: AllocateManySchedulesData[],
  ): Promise<AxiosResponse<undefined>> => {
    return axios.post(`${PREFIX}/allocate-schedule-many`, data);
  };

  const getFullBySchedule = (
    schedule_id: number,
  ): Promise<AxiosResponse<ScheduleFullResponse>> => {
    return axios.get(`${PREFIX}/schedule/full/${schedule_id}`);
  };

  return { list, allocate_many_schedules, getFullBySchedule };
};

export default useOcurrencesService;
