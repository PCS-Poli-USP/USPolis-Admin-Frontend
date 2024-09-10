import useCustomToast from 'hooks/useCustomToast';
import { ClassroomSolicitationAprove, CreateClassroomSolicitation } from 'models/http/requests/classroomSolicitation.request.models';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import { useCallback, useEffect, useState } from 'react';
import ClassroomSolicitationService from 'services/api/classroomSolicitations.service';
import { sortClassroomSolicitationResponse } from 'utils/solicitations/solicitation.sorter';

const service = new ClassroomSolicitationService();

const useClassroomsSolicitations = () => {
  const [loading, setLoading] = useState(false);
  const [solicitations, setSolicitations] = useState<
    ClassroomSolicitationResponse[]
  >([]);

  const showToast = useCustomToast();

  const getSolicitations = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setSolicitations(response.data.sort(sortClassroomSolicitationResponse));
      })
      .catch((error) => {
        console.log(error);
        showToast('Erro', 'Erro ao carregar solicitações', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast]);

  const createSolicitation = useCallback(
    async (data: CreateClassroomSolicitation) => {
      setLoading(true);
      await service
        .create(data)
        .then((response) => {
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
    [getSolicitations, showToast],
  );

  const approveSolicitation = useCallback(
    async (id: number, data: ClassroomSolicitationAprove) => {
      setLoading(true);
      await service
        .approve(id, data)
        .then((response) => {
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
    [getSolicitations, showToast],
  );

  const denySolicitation = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deny(id)
        .then((response) => {
          showToast('Sucesso!', 'Sucesso ao negar solicitação', 'success');

          getSolicitations();
        })
        .catch((error) => {
          showToast('Erro!', `Erro ao negar solicitação: ${error}`, 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getSolicitations, showToast],
  );

  useEffect(() => {
    getSolicitations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    solicitations,
    getSolicitations,
    createSolicitation,
    approveSolicitation,
    denySolicitation,
  };
};

export default useClassroomsSolicitations;
