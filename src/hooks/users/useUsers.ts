import useCustomToast from '../../hooks/useCustomToast';
// import { CreateUser } from 'models/common/user.common.model';
import {
  CreateUser,
  UpdateUser,
} from '../../models/http/requests/user.request.models';

import {
  UserCoreResponse,
  UserPermissionResponse,
  UserResponse,
} from '../../models/http/responses/user.response.models';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  sortUsersPermissions,
  sortUsersResponse,
} from '../../utils/users/users.sorter';
import useUsersService from './../API/services/useUsersService';
import useSelfService from './../API/services/useSelfService';
import { UserErrorParser } from './userErrorParser';

const useUsers = (initialFetch: boolean = true) => {
  const service = useUsersService();
  const selfService = useSelfService();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserCoreResponse[]>([]);

  const showToast = useCustomToast();
  const parser = useMemo(() => new UserErrorParser(), []);

  const getSelf = useCallback(async () => {
    setLoading(true);
    let self: UserResponse | undefined = undefined;
    try {
      const respopnse = await selfService.getSelf();
      self = respopnse.data;
    } catch (error) {
      showToast('Erro', parser.parseCreateError(error), 'error');
      self = undefined;
    } finally {
      setLoading(false);
    }
    return self;
  }, [selfService, showToast, parser]);

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

  const getUsersWithPermissions = useCallback(async () => {
    setLoading(true);
    let usersWithPermissions: UserPermissionResponse[] = [];
    try {
      const response = await service.listWithPermissions();
      usersWithPermissions = response.data;
    } catch (error) {
      showToast('Erro', parser.parseListWithPermissionsError(error), 'error');
      usersWithPermissions = [];
    } finally {
      setLoading(false);
    }
    return usersWithPermissions.sort(sortUsersPermissions);
  }, [service, showToast, parser]);

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

  const updateUserEmailNotifications = useCallback(
    async (receive_emails: boolean) => {
      setLoading(true);
      await service
        .updateEmailNotifications(receive_emails)
        .then(() => {
          showToast(
            'Sucesso',
            `Notificações por e-mail atualizadas!`,
            'success',
          );
        })
        .catch((error) => {
          showToast(
            'Erro',
            parser.parseUpdateEmailNotificationsError(error),
            'error',
          );
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service, parser],
  );

  useEffect(() => {
    if (initialFetch) getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch]);

  return {
    loading,
    users,
    getSelf,
    getUsersWithPermissions,
    getUsers,
    createUser,
    updateUser,
    updateUserEmailNotifications,
  };
};

export default useUsers;
