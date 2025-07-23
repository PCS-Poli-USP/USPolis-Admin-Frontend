import useCustomToast from '../hooks/useCustomToast';
import {
  CreateSubject,
  UpdateSubject,
} from '../models/http/requests/subject.request.models';
import { SubjectResponse } from '../models/http/responses/subject.response.models';
import { useCallback, useEffect, useState } from 'react';
import { sortSubjectsResponse } from '../utils/subjects/subjects.sorter';
import useSubjectsService from './API/services/useSubjectsService';

const useSubjects = (initialFetch = true) => {
  const service = useSubjectsService();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);

  const showToast = useCustomToast();

  const getAllSubjects = useCallback(async () => {
    setLoading(true);
    await service
      .get()
      .then((response) => {
        setSubjects(response.data.sort(sortSubjectsResponse));
      })
      .catch(() => {
        showToast('Erro', 'Erro ao carregar todas disciplinas', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const getSubjects = useCallback(async () => {
    setLoading(true);
    await service
      .getMine()
      .then((response) => {
        setSubjects(response.data.sort(sortSubjectsResponse));
      })
      .catch(() => {
        showToast('Erro', 'Erro ao carregar suas disciplinas', 'error');
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
        .then(() => {
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
        .then(() => {
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
        .then(() => {
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
    if (initialFetch) getSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    subjects,
    getAllSubjects,
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};

export default useSubjects;
