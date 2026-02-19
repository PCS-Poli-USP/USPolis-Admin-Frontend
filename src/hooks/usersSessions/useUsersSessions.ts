import useCustomToast from '../useCustomToast';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useUserSessionService from '../API/services/useUserSessionService';
import { UserSessionErrorParser } from './userSessionErrorParser';
import { UserSessionResponse } from '../../models/http/responses/userSession.response.models';
import { sortUserSessionResponse } from '../../utils/userSessions/userSessions.sorter';

const useUsersSessions = (initialFetch: boolean = true) => {
  const service = useUserSessionService();

  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<UserSessionResponse[]>([]);

  const showToast = useCustomToast();
  const parser = useMemo(() => new UserSessionErrorParser(), []);

  const getUsersSessions = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setSessions(response.data.sort(sortUserSessionResponse));
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

  const deleteUserSession = useCallback(
    async (session_id: string) => {
      setLoading(true);
      await service
        .deleteById(session_id)
        .then(() => {
          showToast('Sucesso!', 'Sucesso ao remover sessão', 'success');
          getUsersSessions();
        })
        .catch((error) => {
          showToast('Erro!', parser.parseDeleteError(error), 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getUsersSessions, showToast, service, parser],
  );

  const deleteAllUserSession = useCallback(
    async (user_id: number) => {
      setLoading(true);
      await service
        .deleteByUserId(user_id)
        .then(() => {
          showToast(
            'Sucesso!',
            'Sucesso ao remover todas sessões do usuário',
            'success',
          );
          getUsersSessions();
        })
        .catch((error) => {
          showToast('Erro!', parser.parseDeleteError(error), 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getUsersSessions, showToast, service, parser],
  );

  useEffect(() => {
    if (initialFetch) getUsersSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch]);

  return {
    loading,
    sessions,
    getUsersSessions,
    deleteUserSession,
    deleteAllUserSession,
  };
};

export default useUsersSessions;
