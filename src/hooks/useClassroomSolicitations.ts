import useCustomToast from '../hooks/useCustomToast';
import {
  ClassroomSolicitationAprove,
  ClassroomSolicitationDeny,
  CreateClassroomSolicitation,
} from '../models/http/requests/classroomSolicitation.request.models';
import { ClassroomSolicitationResponse } from '../models/http/responses/classroomSolicitation.response.models';
import { useCallback, useEffect, useState } from 'react';
import { sortClassroomSolicitationResponse } from '../utils/solicitations/solicitation.sorter';
import useClassroomSolicitationsService from './API/services/useClassroomSolicitationsService';

const useClassroomsSolicitations = (initialFetch = true) => {
  const service = useClassroomSolicitationsService();
  const [loading, setLoading] = useState(false);
  const [solicitations, setSolicitations] = useState<
    ClassroomSolicitationResponse[]
  >([]);

  const showToast = useCustomToast();

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
        setSolicitations(response.data.sort(sortClassroomSolicitationResponse));
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
          setSolicitations(
            response.data.sort(sortClassroomSolicitationResponse),
          );
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
    async (data: CreateClassroomSolicitation) => {
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
    async (id: number, data: ClassroomSolicitationAprove) => {
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
        });
    },
    [getSolicitations, showToast, service],
  );

  const denySolicitation = useCallback(
    async (id: number, data: ClassroomSolicitationDeny) => {
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
        });
    },
    [getPendingBuildingSolicitations, showToast, service],
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
  };
};

export default useClassroomsSolicitations;
