/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react';
import useCustomToast from '../useCustomToast';
import useRolesService from '../API/services/useRolesService';
import { RoleResponse } from '../../models/http/responses/role.response.models';
import {
  CreateRole,
  UpdateRole,
} from '../../models/http/requests/role.request.models';
import RoleErrorParser from './roleErrorParser';

const useRoles = (initialFetch: boolean = true) => {
  const service = useRolesService();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleResponse[]>([]);

  const showToast = useCustomToast();
  const parser = useMemo(() => new RoleErrorParser(), []);

  const getAllRoles = useCallback(async () => {
    setLoading(true);
    await service
      .getAll()
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

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
          showToast('Erro', parser.parseGetError(error), 'error');
          role = undefined;
        })
        .finally(() => {
          setLoading(false);
        });
      return role;
    },
    [showToast, service, parser],
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
          showToast('Erro', parser.parseCreateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getAllRoles, showToast, service, parser],
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
          showToast('Erro', parser.parseUpdateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getAllRoles, showToast, service, parser],
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
          showToast('Erro', parser.parseDeleteError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getAllRoles, showToast, service, parser],
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
