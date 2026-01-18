/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { ClassroomPermissionErrorParser } from './classroomPermissionErrorParser';
import useCustomToast from '../useCustomToast';
import {
  CreateClassroomPermission,
  CreateManyClassroomPermission,
  UpdateClassroomPermission,
} from '../../models/http/requests/classroomPermission.request.models';
import useClassroomPermissionsService from '../API/services/useClassroomPermissionsService';
import { ClassroomPermissionType } from '../../utils/enums/classroomPermissionType.enum';
import {
  ClassroomPermissionByClassroomResponse,
  ClassroomPermissionByUserResponse,
  ClassroomPermissionResponse,
} from '../../models/http/responses/classroomPermission.response.models';
import {
  sortClassroomPermissionByUserResponse,
  sortClassroomPermissionResponse,
} from '../../utils/classroomPermissions/classroomPermissions.sorter';

const useClassroomPermissions = (initialFetch: boolean = true) => {
  const service = useClassroomPermissionsService();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<ClassroomPermissionResponse[]>(
    [],
  );

  const parser = new ClassroomPermissionErrorParser();
  const showToast = useCustomToast();

  const getAllClassroomPermissions = useCallback(async () => {
    setLoading(true);
    await service
      .get()
      .then((response) => {
        setPermissions(response.data.sort(sortClassroomPermissionResponse));
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const getAllClassroomPermissionsByClassroom = useCallback(async () => {
    setLoading(true);
    let current: ClassroomPermissionByClassroomResponse[] = [];
    await service
      .getPermissionsByClassrooms()
      .then((response) => {
        current = response.data.sort(sortClassroomPermissionResponse);
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
    return current;
  }, [showToast, service]);

  const getAllClassroomPermissionsByUser = useCallback(async () => {
    setLoading(true);
    let current: ClassroomPermissionByUserResponse[] = [];
    await service
      .getPermissionsByUsers()
      .then((response) => {
        current = response.data.sort(sortClassroomPermissionByUserResponse);
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
    return current;
  }, [showToast, service]);

  const createClassroomPermission = useCallback(
    async (data: CreateClassroomPermission) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast(
            'Sucesso',
            `Permissões ${data.permissions.map((permission) => ClassroomPermissionType.translate(permission)).join(', ')} criadas com sucesso!`,
            'success',
          );
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

  const createManyClassroomPermission = useCallback(
    async (data: CreateManyClassroomPermission) => {
      setLoading(true);
      await service
        .createMany(data)
        .then(() => {
          showToast(
            'Sucesso',
            `Múltiplas permissões criadas com sucesso!`,
            'success',
          );
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

  const updateClassroomPermission = useCallback(
    async (permission_id: number, data: UpdateClassroomPermission) => {
      setLoading(true);
      await service
        .update(permission_id, data)
        .then(() => {
          showToast(
            'Sucesso',
            `Permissões atualizadas com sucesso!`,
            'success',
          );
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

  const deleteClassroomPermission = useCallback(
    async (permission_id: number) => {
      setLoading(true);
      await service
        .deleteById(permission_id)
        .then(() => {
          showToast(
            'Sucesso',
            `Permissão de sala removida com sucesso!`,
            'success',
          );
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
    if (initialFetch) getAllClassroomPermissions();
  }, [initialFetch]);

  return {
    loading,
    permissions,
    getAllClassroomPermissions,
    getAllClassroomPermissionsByClassroom,
    getAllClassroomPermissionsByUser,
    createClassroomPermission,
    createManyClassroomPermission,
    updateClassroomPermission,
    deleteClassroomPermission,
  };
};

export default useClassroomPermissions;
