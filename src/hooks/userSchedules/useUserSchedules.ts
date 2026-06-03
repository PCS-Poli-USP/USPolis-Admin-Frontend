import useCustomToast from '../useCustomToast';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { UserScheduleErrorParser } from './userScheduleErrorParser';
import {
  UserScheduleCrawlResponse,
  UserScheduleResponse,
} from '../../models/http/responses/userSchedule.response.models';
import useUserScheduleService from '../API/services/useUserScheduleService';
import {
  CreateUserSchedule,
  JupiterScheduleCrawlRequest,
} from '../../models/http/requests/userSchedule.request.models';

const useUserSchedule = (initialFetch: boolean = true) => {
  const service = useUserScheduleService();

  const [loading, setLoading] = useState(false);
  const [userSchedule, setUserSchedule] = useState<
    UserScheduleResponse | undefined
  >(undefined);

  const showToast = useCustomToast();
  const parser = useMemo(() => new UserScheduleErrorParser(), []);

  const getMySchedule = useCallback(async () => {
    setLoading(true);
    await service
      .getMySchedule()
      .then((response) => {
        setUserSchedule(response.data);
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetMyScheduleError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

  const crawlSchedule = useCallback(
    async (data: JupiterScheduleCrawlRequest) => {
      setLoading(true);
      try {
        const response = await service.crawlUserSchedule(data);
        const crawled: UserScheduleCrawlResponse = response.data;

        showToast('Sucesso', 'Grade horária importada com sucesso', 'success');
        return crawled;
      } catch (error) {
        showToast('Erro', parser.parseCrawlUserScheduleError(error), 'error');
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [showToast, service, parser],
  );

  const createUserSchedule = useCallback(
    async (data: CreateUserSchedule) => {
      setLoading(true);
      try {
        await service.create(data);
        showToast('Sucesso', 'Grade horária criada com sucesso', 'success');
        await getMySchedule();
      } catch (error) {
        showToast('Erro', parser.parseCreateError(error), 'error');
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [service, showToast, parser],
  );

  const updateUserSchedule = useCallback(
    async (user_schedule_id: number, data: CreateUserSchedule) => {
      setLoading(true);
      try {
        await service.update(user_schedule_id, data);
        showToast('Sucesso', 'Grade horária atualizada com sucesso', 'success');
        await getMySchedule();
      } catch (error) {
        showToast('Erro', parser.parseUpdateError(error), 'error');
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [service, showToast, parser],
  );

  const deleteUserSchedule = useCallback(
    async (user_schedule_id: number) => {
      setLoading(true);
      try {
        await service.deleteUserSchedule(user_schedule_id);
        showToast('Sucesso', 'Grade horária removida com sucesso', 'success');
        await getMySchedule();
      } catch (error) {
        showToast('Erro', parser.parseDeleteError(error), 'error');
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [service, showToast, parser],
  );

  useEffect(() => {
    if (initialFetch) getMySchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch]);

  return {
    loading,
    userSchedule,
    getMySchedule,
    crawlSchedule,
    createUserSchedule,
    updateUserSchedule,
    deleteUserSchedule,
  };
};

export default useUserSchedule;
