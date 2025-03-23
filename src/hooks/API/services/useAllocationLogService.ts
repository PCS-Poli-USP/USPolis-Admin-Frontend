import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { AllocationLogResponse } from 'models/http/responses/allocationLog.response.models';

const useAllocationLogService = () => {
  const PREFIX = '/allocations_logs';
  const axios = useAxiosPrivate();

  const getByScheduleId = (
    schedule_id: number,
  ): Promise<AxiosResponse<Array<AllocationLogResponse>>> => {
    return axios.get(`${PREFIX}/${schedule_id}`);
  };

  return { getByScheduleId };
};

export default useAllocationLogService;
