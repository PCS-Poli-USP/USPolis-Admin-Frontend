import { useCallback, useEffect, useState } from 'react';
import useGroupService from '../API/services/useGroupService';
import { GroupResponse } from '../../models/http/responses/group.response.models';
import useCustomToast from '../useCustomToast';
import {
  GroupRequest,
  GroupUpdate,
} from '../../models/http/requests/group.request.models';
import { GroupErrorParser } from './groupErrorParser';

const useGroups = (initialFetch = true) => {
  const service = useGroupService();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<GroupResponse[]>([]);

  const errorParser = new GroupErrorParser();
  const showToast = useCustomToast();

  const getAllGroups = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGroups = useCallback(async () => {
    setLoading(true);
    await service
      .listMyGroups()
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createGroup = useCallback(async (data: GroupRequest) => {
    setLoading(true);
    await service
      .create(data)
      .then(() => {
        showToast('Sucesso', `Grupo criado com sucesso!`, 'success');
        getAllGroups();
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseCreateError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateGroup = useCallback(async (id: number, data: GroupUpdate) => {
    setLoading(true);
    await service
      .update(id, data)
      .then(() => {
        showToast('Sucesso', `Grupo atualizado com sucesso!`, 'success');
        getAllGroups();
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseUpdateError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteGroup = useCallback(async (id: number) => {
    setLoading(true);
    await service
      .remove(id)
      .then(() => {
        showToast('Sucesso', `Grupo removido com sucesso!`, 'success');
        getAllGroups();
      })
      .catch((error) => {
        showToast('Erro', errorParser.parseDeleteError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialFetch) getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch]);

  return {
    loading,
    groups,
    getAllGroups,
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  };
};

export default useGroups;
