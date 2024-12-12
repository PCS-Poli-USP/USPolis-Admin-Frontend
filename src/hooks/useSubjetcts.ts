import useCustomToast from 'hooks/useCustomToast';
import { CreateSubject, UpdateSubject } from 'models/http/requests/subject.request.models';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { useCallback, useEffect, useState } from 'react';
import subjectsService from 'services/api/subjects.service';
import { sortSubjectsResponse } from 'utils/subjects/subjects.sorter';

const service = new subjectsService();

const useSubjects = () => {
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
  }, [showToast]);

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
    [getSubjects, showToast],
  );

  const updateSubject = useCallback(async (id: number, data: UpdateSubject) => {
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
  }, [getSubjects, showToast]);

  const deleteSubject = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .delete(id)
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
    [getSubjects, showToast],
  );

  useEffect(() => {
    getSubjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
