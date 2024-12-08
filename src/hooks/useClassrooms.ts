import useCustomToast from 'hooks/useCustomToast';
import {
  ClassroomConflictCheck,
  CreateClassroom,
  UpdateClassroom,
} from 'models/http/requests/classroom.request.models';
import {
  ClassroomResponse,
  ClassroomFullResponse,
  ClassroomWithConflictCount,
} from 'models/http/responses/classroom.response.models';
import { useCallback, useEffect, useState } from 'react';
import ClassroomsService from 'services/api/classrooms.service';
import { sortClassroomResponse } from 'utils/classrooms/classrooms.sorter';

const service = new ClassroomsService();

const useClassrooms = (initialFetch: boolean = true) => {
  const [loading, setLoading] = useState(false);
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);

  const showToast = useCustomToast();

  const getAllClassrooms = useCallback(async () => {
    setLoading(true);
    await service
      .getAll()
      .then((response) => {
        setClassrooms(response.data.sort(sortClassroomResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar salas', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast]);

  const getClassrooms = useCallback(async () => {
    setLoading(true);
    await service
      .getMyClassrooms()
      .then((response) => {
        setClassrooms(response.data.sort(sortClassroomResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar salas', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast]);

  const getClassroomsByBuilding = useCallback(
    async (building_id: number) => {
      setLoading(true);
      let current: ClassroomResponse[] = [];
      await service
        .getClassroomsByBuildingId(building_id)
        .then((response) => {
          current = response.data;
          setClassrooms(current.sort(sortClassroomResponse));
        })
        .catch((error) => {
          showToast(
            'Erro',
            `Erro ao carregar salas do prédio ${building_id}`,
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
      return current;
    },
    [showToast],
  );

  const getClassroomsWithConflictFromTime = useCallback(
    async (data: ClassroomConflictCheck, building_id: number) => {
      setLoading(true);
      let current: ClassroomWithConflictCount[] = [];
      await service
        .getWithConflictCountFromTime(data, building_id)
        .then((response) => {
          current = response.data.sort(sortClassroomResponse);
        })
        .catch((error) => {
          showToast(
            'Erro',
            `Erro ao carregar salas do prédio ${building_id}`,
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
      return current;
    },
    [showToast],
  );

  const listOneFull = useCallback(async (id: number) => {
    let current: ClassroomFullResponse | undefined;
    await service
      .getOneFull(id)
      .then((response) => {
        current = response.data;
      })
      .catch((error) => {
        current = undefined;
      });
    return current;
  }, []);

  const createClassroom = useCallback(
    async (data: CreateClassroom) => {
      setLoading(true);
      await service
        .create(data)
        .then((response) => {
          showToast(
            'Sucesso',
            `Sala ${data.name} criada com sucesso!`,
            'success',
          );
          getClassrooms();
        })
        .catch((error) => {
          showToast('Erro', `Erro ao criar sala: ${error}`, 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getClassrooms, showToast],
  );

  const updateClassroom = useCallback(
    async (id: number, data: UpdateClassroom) => {
      setLoading(true);
      await service
        .update(id, data)
        .then((response) => {
          showToast('Sucesso', `Sala atualizada com sucesso!`, 'success');
          getClassrooms();
        })
        .catch((error) => {
          showToast(
            'Erro',
            `Erro ao atualizar a sala ${data.name}: ${error}`,
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getClassrooms, showToast],
  );

  const deleteClassroom = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .delete(id)
        .then((response) => {
          showToast('Sucesso!', 'Sucesso ao remover sala', 'success');
          getClassrooms();
        })
        .catch((error) => {
          showToast('Erro!', 'Erro ao remover sala', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getClassrooms, showToast],
  );

  useEffect(() => {
    if (initialFetch) getClassrooms();
  }, [getClassrooms, initialFetch]);

  return {
    loading,
    classrooms,
    getClassrooms,
    getClassroomsByBuilding,
    getClassroomsWithConflictFromTime,
    listOneFull,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  };
};

export default useClassrooms;
