import useCustomToast from 'hooks/useCustomToast';
import {
  CreateClass,
  UpdateClass,
} from 'models/http/requests/class.request.models';
import {
  ClassFullResponse,
  ClassResponse,
} from 'models/http/responses/class.response.models';
import { useCallback, useEffect, useState } from 'react';
import { sortClassResponse } from 'utils/classes/classes.sorter';
import useClassesService from './API/services/useClassesService';

const useClasses = (initialFetch: boolean = true) => {
  const service = useClassesService();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<ClassResponse[]>([]);

  const showToast = useCustomToast();

  const getClasses = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setClasses(response.data.sort(sortClassResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar turmas', 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const getClassesBySubject = useCallback(async (subject_id: number) => {
    setLoading(true);
    await service
      .listBySubject(subject_id)
      .then((response) => {
        setClasses(response.data.sort(sortClassResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar turmas', 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const getClassFull = useCallback(
    async (id: number) => {
      setLoading(true);
      let full: ClassFullResponse | undefined = undefined;
      await service
        .listOneFull(id)
        .then((response) => {
          full = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
      return full;
    },
    [service],
  );

  const createClass = useCallback(
    async (data: CreateClass) => {
      setLoading(true);
      await service
        .create(data)
        .then((response) => {
          showToast(
            'Sucesso',
            `Turma ${data.code} criada com sucesso!`,
            'success',
          );
          getClasses();
        })
        .catch((error) => {
          console.log(error);
          showToast('Erro', `Erro ao criar turma: ${error}`, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getClasses, showToast, service],
  );

  const updateClass = useCallback(
    async (id: number, data: UpdateClass) => {
      setLoading(true);
      await service
        .update(id, data)
        .then((response) => {
          showToast('Sucesso', `Turma atualizado com sucesso!`, 'success');
          getClasses();
        })
        .catch((error) => {
          console.log(error);
          showToast(
            'Erro',
            `Erro ao atualizar a turma ${data.code}: ${error}`,
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getClasses, showToast, service],
  );

  const deleteClass = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then((response) => {
          showToast('Sucesso!', 'Sucesso ao remover turma', 'success');

          getClasses();
        })
        .catch((error) => {
          showToast('Erro!', 'Erro ao remover turma', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getClasses, showToast, service],
  );

  const deleteManyClass = useCallback(
    async (ids: number[]) => {
      setLoading(true);
      await service
        .deleteMany(ids)
        .then((response) => {
          showToast(
            'Sucesso!',
            `Sucesso ao remover ${ids.length} turmas`,
            'success',
          );

          getClasses();
        })
        .catch((error) => {
          showToast('Erro!', 'Erro ao remover turmas', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getClasses, showToast, service],
  );

  useEffect(() => {
    if (initialFetch) getClasses();
  }, [getClasses, initialFetch]);

  return {
    loading,
    classes,
    getClasses,
    getClassesBySubject,
    getClassFull,
    createClass,
    updateClass,
    deleteClass,
    deleteManyClass,
  };
};

export default useClasses;
