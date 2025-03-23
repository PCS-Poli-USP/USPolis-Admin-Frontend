import { useCallback, useState } from 'react';
import useAllocationLogService from './API/services/useAllocationLogService';
import { AllocationLogResponse } from 'models/http/responses/allocationLog.response.models';
import useCustomToast from './useCustomToast';

const useAllocationLog = () => {
  const service = useAllocationLogService();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<AllocationLogResponse[]>([]);
  const showToast = useCustomToast();

  const getLogs = useCallback(
    async (schedule_id: number) => {
      setLoading(true);
      await service
        .getByScheduleId(schedule_id)
        .then((response) => {
          setLogs(response.data);
        })
        .catch((error) => {
          showToast('Erro', 'Erro ao carregar histórico', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service],
  );

  return { loading, logs, getLogs };
};

export default useAllocationLog;
