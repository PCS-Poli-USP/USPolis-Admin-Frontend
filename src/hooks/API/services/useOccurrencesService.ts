import { AxiosResponse } from 'axios';
import { OccurrenceResponse } from '../../../models/http/responses/occurrence.response.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export interface AllocateManySchedulesData {
  schedule_id: number;
  classroom_id: number;
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

  return { list, allocate_many_schedules };
};

export default useOcurrencesService;
