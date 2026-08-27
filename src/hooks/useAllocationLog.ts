import { useCallback, useMemo, useState } from 'react';
import useAllocationLogService from './API/services/useAllocationLogService';
import { AllocationLogResponse } from '../models/http/responses/allocationLog.response.models';
import useCustomToast from './useCustomToast';
import AllocationLogErrorParser from './allocationLogErrorParser';

const useAllocationLog = () => {
  const service = useAllocationLogService();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<AllocationLogResponse[]>([]);
  const showToast = useCustomToast();
  const parser = useMemo(() => new AllocationLogErrorParser(), []);

  const getLogs = useCallback(
    async (schedule_id: number) => {
      setLoading(true);
      await service
        .getByScheduleId(schedule_id)
        .then((response) => {
          setLogs(response.data);
        })
        .catch((error) => {
          showToast('Erro', parser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service, parser],
  );

  return { loading, logs, getLogs };
};

export default useAllocationLog;
