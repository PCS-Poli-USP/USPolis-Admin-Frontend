import useCustomToast from '../hooks/useCustomToast';
import {
  CreateSubject,
  UpdateSubject,
} from '../models/http/requests/subject.request.models';
import {
  SubjectResponse,
  SubjectResponseBase,
} from '../models/http/responses/subject.response.models';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { sortSubjectsResponse } from '../utils/subjects/subjects.sorter';
import useSubjectsService from './API/services/useSubjectsService';
import SubjectErrorParser from './subjectErrorParser';

const useSubjects = (initialFetch = true) => {
  const service = useSubjectsService();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [subjectsCore, setSubjectsCore] = useState<SubjectResponseBase[]>([]);

  const showToast = useCustomToast();
  const parser = useMemo(() => new SubjectErrorParser(), []);

  const getAllSubjects = useCallback(async () => {
    setLoading(true);
    await service
      .get()
      .then((response) => {
        setSubjects(response.data.sort(sortSubjectsResponse));
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

  const getAllSubjectsCore = useCallback(async () => {
    setLoading(true);
    await service
      .getCore()
      .then((response) => {
        setSubjectsCore(response.data.sort(sortSubjectsResponse));
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

  const getAllSubjectsActives = useCallback(
    async (start?: string, end?: string) => {
      setLoading(true);
      await service
        .getActive(start, end)
        .then((response) => {
          setSubjects(response.data.sort(sortSubjectsResponse));
        })
        .catch((error) => {
          showToast('Erro', parser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service, parser],
  );

  const getSubjects = useCallback(async () => {
    setLoading(true);
    await service
      .getMine()
      .then((response) => {
        setSubjects(response.data.sort(sortSubjectsResponse));
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

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
          showToast('Erro', parser.parseCreateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getSubjects, showToast, service, parser],
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
          showToast('Erro', parser.parseUpdateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getSubjects, showToast, service, parser],
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
          showToast('Erro!', parser.parseDeleteError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getSubjects, showToast, service, parser],
  );

  useEffect(() => {
    if (initialFetch) getSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    subjects,
    subjectsCore,
    getAllSubjects,
    getAllSubjectsCore,
    getAllSubjectsActives,
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};

export default useSubjects;
