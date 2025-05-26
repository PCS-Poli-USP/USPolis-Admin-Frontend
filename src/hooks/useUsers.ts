import useCustomToast from '../hooks/useCustomToast';
// import { CreateUser } from 'models/common/user.common.model';
import {
  CreateUser,
  UpdateUser,
} from '../models/http/requests/user.request.models';

import { UserResponse } from '../models/http/responses/user.response.models';
import { useCallback, useEffect, useState } from 'react';
import { sortUsersResponse } from '../utils/users/users.sorter';
import useUsersService from './API/services/useUsersService';
import useSelfService from './API/services/useSelfService';

const useUsers = (initialFetch: boolean = true) => {
  const service = useUsersService();
  const selfService = useSelfService();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserResponse[]>([]);

  const showToast = useCustomToast();

  const getSelf = useCallback(async () => {
    setLoading(true);
    let self: UserResponse | undefined = undefined;
    try {
      const respopnse = await selfService.getSelf();
      self = respopnse.data;
    } catch (error) {
      showToast('Erro', 'Erro ao carregar sua conta', 'error');
      self = undefined;
    } finally {
      setLoading(false);
    }
    return self;
  }, [showToast, selfService]);

  const getUsers = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setUsers(response.data.sort(sortUsersResponse));
      })
      .catch(() => {
        showToast('Erro', 'Erro ao carregar usuários', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const createUser = useCallback(
    async (data: CreateUser) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast(
            'Sucesso',
            `Usuário ${data.name} criado com sucesso!`,
            'success',
          );
          getUsers();
        })
        .catch((error) => {
          showToast('Erro', `Erro ao criar usuário: ${error}`, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getUsers, showToast, service],
  );

  const updateUser = useCallback(
    async (id: number, data: UpdateUser) => {
      setLoading(true);
      await service
        .update(id, data)
        .then(() => {
          showToast('Sucesso', `Usuário atualizado com sucesso!`, 'success');
          getUsers();
        })
        .catch((error) => {
          showToast('Erro', `Erro ao atualizar o usuário: ${error}`, 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getUsers, showToast, service],
  );

  const deleteUser = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then(() => {
          showToast('Sucesso!', 'Sucesso ao remover usuário', 'success');

          getUsers();
        })
        .catch((error) => {
          showToast('Erro!', 'Erro ao remover usuário', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getUsers, showToast, service],
  );

  useEffect(() => {
    if (initialFetch) getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch]);

  return {
    loading,
    users,
    getSelf,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

export default useUsers;
