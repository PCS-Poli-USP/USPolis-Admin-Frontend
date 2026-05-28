/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import useCustomToast from '../useCustomToast';
import { PermissionErrorParser } from './permissionErrorParser';
import usePermissionsService from '../API/services/usePermissionsService';
import { Resource } from '../../utils/enums/resources.enums';
import { sortPermissionResponse } from '../../utils/permissions/permissions.sorter';
import { PermissionResponse } from '../../models/http/responses/permissions.response.models';
import {
  CreateBatchPermission,
  CreatePermission,
  UpdatePermission,
} from '../../models/http/requests/permission.request.models';

const usePermissions = (
  initialFetch: boolean = true,
  initialResource: Resource | null = null,
) => {
  const service = usePermissionsService();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);

  const parser = new PermissionErrorParser();
  const showToast = useCustomToast();

  const getPermissions = useCallback(
    async (resource: Resource) => {
      setLoading(true);
      await service
        .get(resource)
        .then((response) => {
          setPermissions(response.data.sort(sortPermissionResponse));
        })
        .catch((error) => {
          showToast('Erro', parser.parseGetError(error), 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service],
  );

  const getAllPermissions = useCallback(async () => {
    setLoading(true);
    await service
      .getAll()
      .then((response) => {
        setPermissions(response.data.sort(sortPermissionResponse));
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const createPermission = useCallback(
    async (data: CreatePermission) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast('Sucesso', `Permissão criada com sucesso!`, 'success');
        })
        .catch((error) => {
          showToast('Erro', parser.parseCreateError(error), 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service],
  );

  const createBatchPermission = useCallback(
    async (data: CreateBatchPermission) => {
      setLoading(true);
      await service
        .createBatch(data)
        .then(() => {
          showToast('Sucesso', 'Permissões criadas com sucesso!', 'success');
          getAllPermissions();
        })
        .catch((error) => {
          showToast('Erro', parser.parseCreateError(error), 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getAllPermissions, showToast, service],
  );

  const updatePermission = useCallback(
    async (permission_id: number, data: UpdatePermission) => {
      setLoading(true);
      await service
        .update(permission_id, data)
        .then(() => {
          showToast('Sucesso', `Permissão atualizada com sucesso!`, 'success');
        })
        .catch((error) => {
          showToast('Erro', parser.parseCreateError(error), 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service],
  );

  const deletePermission = useCallback(
    async (permission_id: number) => {
      setLoading(true);
      await service
        .deleteById(permission_id)
        .then(() => {
          showToast('Sucesso', `Permissão removida com sucesso!`, 'success');
        })
        .catch((error) => {
          showToast('Erro', parser.parseDeleteError(error), 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service],
  );

  useEffect(() => {
    if (initialFetch && !initialResource) getAllPermissions();
    if (initialFetch && initialResource) getPermissions(initialResource);
  }, [initialFetch, initialResource]);

  return {
    loading,
    permissions,
    getAllPermissions,
    createPermission,
    createBatchPermission,
    updatePermission,
    deletePermission,
  };
};

export default usePermissions;
