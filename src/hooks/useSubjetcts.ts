import useCustomToast from 'hooks/useCustomToast';
import {
  CreateSubject,
  UpdateSubject,
} from 'models/http/requests/subject.request.models';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { useCallback, useEffect, useState } from 'react';
import { sortSubjectsResponse } from 'utils/subjects/subjects.sorter';
import useSubjectsService from './API/services/useSubjectsService';

const useSubjects = () => {
  const service = useSubjectsService();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);

  const showToast = useCustomToast();

  const getSubjects = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setSubjects(response.data.sort(sortSubjectsResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar Disciplinas', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const createSubject = useCallback(
    async (data: CreateSubject) => {
      setLoading(true);
      await service
        .create(data)
        .then((response) => {
          showToast(
            'Sucesso',
            `Disciplina ${data.name} criada com sucesso!`,
            'success',
          );
          getSubjects();
        })
        .catch((error) => {
          showToast('Erro', `Erro ao criar disciplina: ${error}`, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getSubjects, showToast, service],
  );

  const updateSubject = useCallback(
    async (id: number, data: UpdateSubject) => {
      setLoading(true);
      await service
        .update(id, data)
        .then((response) => {
          showToast('Sucesso', `Disciplina atualizada com sucesso!`, 'success');
          getSubjects();
        })
        .catch((error) => {
          showToast(
            'Erro',
            `Erro ao atualizar a disciplina ${data.name}: ${error}`,
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getSubjects, showToast, service],
  );

  const deleteSubject = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then((response) => {
          showToast('Sucesso!', 'Sucesso ao remover disciplina', 'success');

          getSubjects();
        })
        .catch((error) => {
          showToast('Erro!', 'Erro ao remover disciplina', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getSubjects, showToast, service],
  );

  useEffect(() => {
    getSubjects();
  }, [getSubjects]);

  return {
    loading,
    subjects,
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};

export default useSubjects;
