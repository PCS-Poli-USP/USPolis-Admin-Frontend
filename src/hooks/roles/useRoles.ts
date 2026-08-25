/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import useCustomToast from '../useCustomToast';
import useRolesService from '../API/services/useRolesService';
import { RoleResponse } from '../../models/http/responses/role.response.models';
import {
  CreateRole,
  UpdateRole,
} from '../../models/http/requests/role.request.models';

const useRoles = (initialFetch: boolean = true) => {
  const service = useRolesService();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleResponse[]>([]);

  const showToast = useCustomToast();

  const getAllRoles = useCallback(async () => {
    setLoading(true);
    await service
      .getAll()
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar cargos', 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const getRoleById = useCallback(
    async (id: number) => {
      setLoading(true);
      let role: RoleResponse | undefined;
      await service
        .getById(id)
        .then((response) => {
          role = response.data;
        })
        .catch((error) => {
          showToast('Erro', 'Erro ao carregar cargo', 'error');
          console.log(error);
          role = undefined;
        })
        .finally(() => {
          setLoading(false);
        });
      return role;
    },
    [showToast, service],
  );

  const createRole = useCallback(
    async (data: CreateRole) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast('Sucesso', 'Cargo criado com sucesso!', 'success');
          getAllRoles();
        })
        .catch((error) => {
          showToast('Erro', 'Erro ao criar cargo', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getAllRoles, showToast, service],
  );

  const updateRole = useCallback(
    async (id: number, data: UpdateRole) => {
      setLoading(true);
      await service
        .update(id, data)
        .then(() => {
          showToast('Sucesso', 'Cargo atualizado com sucesso!', 'success');
          getAllRoles();
        })
        .catch((error) => {
          showToast('Erro', 'Erro ao atualizar cargo', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getAllRoles, showToast, service],
  );

  const deleteRole = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .delete(id)
        .then(() => {
          showToast('Sucesso', 'Cargo removido com sucesso!', 'success');
          getAllRoles();
        })
        .catch((error) => {
          showToast('Erro', 'Erro ao remover cargo', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getAllRoles, showToast, service],
  );

  useEffect(() => {
    if (initialFetch) getAllRoles();
  }, [initialFetch]);

  return {
    loading,
    roles,
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
  };
};

export default useRoles;
