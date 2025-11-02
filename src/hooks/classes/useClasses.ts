/* eslint-disable @typescript-eslint/no-explicit-any */
import useCustomToast from '../../hooks/useCustomToast';
import {
  CreateClass,
  UpdateClass,
} from '../../models/http/requests/class.request.models';
import {
  ClassFullResponse,
  ClassResponse,
} from '../../models/http/responses/class.response.models';
import { useCallback, useEffect, useState } from 'react';
import { sortClassResponse } from '../../utils/classes/classes.sorter';
import useClassesService from '../API/services/useClassesService';
import {
  AxiosErrorResponse,
  isAxiosErrorResponse,
} from '../../models/http/responses/common.response.models';
import { ClassErrorParser } from './classErrorParser';

const useClasses = (initialFetch: boolean = true) => {
  const service = useClassesService();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<ClassResponse[]>([]);

  const showToast = useCustomToast();
  const errorParser = new ClassErrorParser();

  const getAllClasses = useCallback(async () => {
    setLoading(true);
    await service
      .get()
      .then((response) => {
        setClasses(response.data.sort(sortClassResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar todas as turmas', 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const getClasses = useCallback(
    async (start?: string, end?: string) => {
      setLoading(true);
      await service
        .getMine(start, end)
        .then((response) => {
          setClasses(response.data.sort(sortClassResponse));
        })
        .catch((error) => {
          showToast('Erro', 'Erro ao carregar suas turmas', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service],
  );

  const getClassesBySubject = useCallback(
    async (subject_id: number) => {
      setLoading(true);
      await service
        .getBySubject(subject_id)
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
    },
    [showToast, service],
  );

  const getClassesBySubjects = useCallback(
    async (subject_ids: number[], start?: string, end?: string) => {
      setLoading(true);
      await service
        .getBySubjects(subject_ids, start, end)
        .then((response) => {
          setClasses(response.data.sort(sortClassResponse));
        })
        .catch((error) => {
          showToast('Erro', `Erro ao carregar turmas`, 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service],
  );

  const getClassesByBuildingName = useCallback(
    async (building_name: string, start?: string, end?: string) => {
      setLoading(true);
      await service
        .getByBuildingName(building_name, start, end)
        .then((response) => {
          setClasses(response.data.sort(sortClassResponse));
        })
        .catch((error) => {
          showToast(
            'Erro',
            `Erro ao carregar turmas do prédio ${building_name}`,
            'error',
          );
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showToast, service],
  );

  const getClassFull = useCallback(
    async (id: number) => {
      setLoading(true);
      let full: ClassFullResponse | undefined = undefined;
      await service
        .getOneFull(id)
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
        .then(() => {
          showToast(
            'Sucesso',
            `Turma ${data.code} criada com sucesso!`,
            'success',
          );
          getClasses();
        })
        .catch((error: any) => {
          console.log(error);
          showToast('Erro', errorParser.parseCreateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getClasses, showToast, service],
  );

  const updateClass = useCallback(
    async (id: number, data: UpdateClass) => {
      setLoading(true);
      await service
        .update(id, data)
        .then(() => {
          showToast('Sucesso', `Turma atualizada com sucesso!`, 'success');
          getClasses();
        })
        .catch((error: any) => {
          if (isAxiosErrorResponse(error)) {
            console.log(error);
            showToast('Erro', errorParser.parseUpdateError(error), 'error');
          } else {
            console.log(error);
            showToast('Erro', `Erro inesperado ao atualizar turma`, 'error');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getClasses, showToast, service],
  );

  const deleteClass = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then(() => {
          showToast('Sucesso!', 'Sucesso ao remover turma', 'success');

          getClasses();
        })
        .catch((error: any) => {
          if (isAxiosErrorResponse(error)) {
            console.log(error);
            showToast('Erro', errorParser.parseDeleteError(error), 'error');
          } else {
            console.log(error);
            showToast('Erro', `Erro inesperado ao remover turma`, 'error');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getClasses, showToast, service],
  );

  const deleteManyClass = useCallback(
    async (ids: number[]) => {
      setLoading(true);
      await service
        .deleteMany(ids)
        .then(() => {
          showToast(
            'Sucesso!',
            `Sucesso ao remover ${ids.length} turmas`,
            'success',
          );

          getClasses();
        })
        .catch((error: AxiosErrorResponse) => {
          if (isAxiosErrorResponse(error)) {
            console.log(error);
            showToast(
              'Erro',
              `Erro ao remover turmas: ${error.response?.data.detail}`,
              'error',
            );
          } else {
            console.log(error);
            showToast('Erro', errorParser.parseDeleteError(error), 'error');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getClasses, showToast, service],
  );

  useEffect(() => {
    if (initialFetch) getClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch]);

  return {
    loading,
    classes,
    getClasses,
    getAllClasses,
    getClassesBySubject,
    getClassesBySubjects,
    getClassesByBuildingName,
    getClassFull,
    createClass,
    updateClass,
    deleteClass,
    deleteManyClass,
  };
};

export default useClasses;
