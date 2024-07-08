import useCustomToast from 'hooks/useCustomToast';
import {
  CreateClassroom,
  UpdateClassroom,
} from 'models/http/requests/classroom.request.models';
import { ClassroomResponse } from 'models/http/responses/classroom.response.models';
import { useCallback, useEffect, useState } from 'react';
import ClassroomsService from 'services/api/classrooms.service';
import { sortClassroomResponse } from 'utils/classrooms/classrooms.sorter';

const service = new ClassroomsService();

const useClassrooms = () => {
  const [loading, setLoading] = useState(false);
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);

  const showToast = useCustomToast();

  const getClassrooms = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setClassrooms(response.data.sort(sortClassroomResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar Salas', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast]);

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
          showToast('Erro', `Erro ao criar disciplina: ${error}`, 'error');
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
          showToast('Erro!', 'Erro ao remover disciplina', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getClassrooms, showToast],
  );

  useEffect(() => {
    getClassrooms();
  }, [getClassrooms]);

  return {
    loading,
    classrooms,
    getClassrooms,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  };
};

export default useClassrooms;