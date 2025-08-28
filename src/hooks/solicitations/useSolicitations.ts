import useCustomToast from '../useCustomToast';
import {
  ApproveSolicitation,
  DenySolicitation,
  CreateSolicitation,
} from '../../models/http/requests/solicitation.request.models';
import { SolicitationResponse } from '../../models/http/responses/solicitation.response.models';
import { useCallback, useEffect, useState } from 'react';
import { sortSolicitationResponse } from '../../utils/solicitations/solicitation.sorter';
import useSolicitationsService from '../API/services/useSolicitationsService';
import { SolicitationErrorParser } from './solicitationErrorParser';

const useClassroomsSolicitations = (initialFetch = true) => {
  const service = useSolicitationsService();
  const [loading, setLoading] = useState(false);
  const [solicitations, setSolicitations] = useState<SolicitationResponse[]>(
    [],
  );

  const showToast = useCustomToast();

  const parser = new SolicitationErrorParser();

  const getSolicitations = useCallback(async () => {
    setLoading(true);
    await service
      .getMySolicitations()
      .then((response) => {
        setSolicitations(response.data);
      })
      .catch((error) => {
        console.log(error);
        showToast('Erro', 'Erro ao carregar suas solicitações', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const getPendingBuildingSolicitations = useCallback(async () => {
    setLoading(true);
    await service
      .getPending()
      .then((response) => {
        setSolicitations(response.data.sort(sortSolicitationResponse));
      })
      .catch((error) => {
        console.log(error);
        showToast(
          'Erro',
          'Erro ao carregar as solicitações pendentes do seu prédio',
          'error',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const getAllBuildingSolicitations = useCallback(
    async (start?: string, end?: string) => {
      setLoading(true);
      await service
        .getAll(start, end)
        .then((response) => {
          setSolicitations(response.data.sort(sortSolicitationResponse));
        })
        .catch((error) => {
          console.log(error);
          showToast(
            'Erro',
            'Erro ao carregar as solicitações do seu prédio',
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service],
  );

  const createSolicitation = useCallback(
    async (data: CreateSolicitation) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast('Sucesso', `Solicitação criada com sucesso!`, 'success');
          getSolicitations();
        })
        .catch((error) => {
          console.log(error);
          showToast('Erro', `Erro ao criar solicita;ção: ${error}`, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getSolicitations, showToast, service],
  );

  const approveSolicitation = useCallback(
    async (id: number, data: ApproveSolicitation) => {
      setLoading(true);
      await service
        .approve(id, data)
        .then(() => {
          showToast('Sucesso', `Solicitação aprovada com sucesso!`, 'success');
          getSolicitations();
        })
        .catch((error) => {
          showToast('Erro', `Erro ao aprovar a solicitação: ${error}`, 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getSolicitations, showToast, service],
  );

  const denySolicitation = useCallback(
    async (id: number, data: DenySolicitation) => {
      setLoading(true);
      await service
        .deny(id, data)
        .then(async () => {
          showToast('Sucesso!', 'Sucesso ao negar solicitação', 'success');
          getPendingBuildingSolicitations();
        })
        .catch((error) => {
          showToast('Erro!', `Erro ao negar solicitação: ${error}`, 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getPendingBuildingSolicitations, showToast, service],
  );

  const cancelSolicitation = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .cancel(id)
        .then(async () => {
          showToast('Sucesso!', 'Sucesso ao cancelar solicitação', 'success');
          getSolicitations();
        })
        .catch((error) => {
          console.log(error);
          showToast('Erro!', parser.parseCancelError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getSolicitations, showToast, service],
  );

  useEffect(() => {
    if (initialFetch) getSolicitations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    solicitations,
    getSolicitations,
    getPendingBuildingSolicitations,
    getAllBuildingSolicitations,
    createSolicitation,
    approveSolicitation,
    denySolicitation,
    cancelSolicitation,
  };
};

export default useClassroomsSolicitations;
