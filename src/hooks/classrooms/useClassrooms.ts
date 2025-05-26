/* eslint-disable react-hooks/exhaustive-deps */
import useCustomToast from '../../hooks/useCustomToast';
import {
  ClassroomConflictCheck,
  CreateClassroom,
  UpdateClassroom,
} from '../../models/http/requests/classroom.request.models';
import {
  ClassroomResponse,
  ClassroomFullResponse,
  ClassroomWithConflictCount,
} from '../../models/http/responses/classroom.response.models';
import { useCallback, useEffect, useState } from 'react';
import { sortClassroomResponse } from '../../utils/classrooms/classrooms.sorter';
import useClassroomsService from '../API/services/useClassroomsService';
import { ClassroomErrorParser } from './classroomErrorParser';

const useClassrooms = (initialFetch: boolean = true) => {
  const service = useClassroomsService();
  const [loading, setLoading] = useState(false);
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);

  const parser = new ClassroomErrorParser();

  const showToast = useCustomToast();

  const getAllClassrooms = useCallback(async () => {
    setLoading(true);
    await service
      .get()
      .then((response) => {
        setClassrooms(response.data.sort(sortClassroomResponse));
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const getClassrooms = useCallback(async () => {
    setLoading(true);
    await service
      .getMine()
      .then((response) => {
        setClassrooms(response.data.sort(sortClassroomResponse));
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

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
          showToast('Erro', parser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
      return current;
    },
    [showToast, service],
  );

  // const getClassroomsWithConflict = useCallback(
  //   async (schedule_id: number, building_id: number) => {
  //     setLoading(true);
  //     let current: ClassroomWithConflictCount[] = [];
  //     await service
  //       .getWithConflictCount(schedule_id, building_id)
  //       .then((response) => {
  //         // current = response.data.sort(sortClassroomResponse);
  //       })
  //       .catch(() => {
  //         showToast(
  //           'Erro',
  //           `Erro ao carregar salas do prédio ${building_id}`,
  //           'error',
  //         );
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //     return current;
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [],
  // );

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
          showToast('Erro', parser.parseGetError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
      return current;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const listOneFull = useCallback(
    async (id: number) => {
      let current: ClassroomFullResponse | undefined;
      await service
        .getOneFull(id)
        .then((response) => {
          current = response.data;
        })
        .catch((error) => {
          showToast('Erro', parser.parseGetError(error), 'error');
          current = undefined;
        });
      return current;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const createClassroom = useCallback(
    async (data: CreateClassroom) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast(
            'Sucesso',
            `Sala ${data.name} criada com sucesso!`,
            'success',
          );
          getClassrooms();
        })
        .catch((error) => {
          showToast('Erro', parser.parseCreateError(error), 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getClassrooms, showToast, service],
  );

  const updateClassroom = useCallback(
    async (id: number, data: UpdateClassroom) => {
      setLoading(true);
      await service
        .update(id, data)
        .then(() => {
          showToast('Sucesso', `Sala atualizada com sucesso!`, 'success');
          getClassrooms();
        })
        .catch((error) => {
          showToast('Erro', parser.parseUpdateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getClassrooms, showToast, service],
  );

  const deleteClassroom = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then(() => {
          showToast('Sucesso!', 'Sucesso ao remover sala', 'success');
          getClassrooms();
        })
        .catch((error) => {
          showToast('Erro!', parser.parseDeleteError(error), 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getClassrooms, showToast, service],
  );

  useEffect(() => {
    if (initialFetch) getClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch]);

  return {
    loading,
    classrooms,
    getAllClassrooms,
    getClassrooms,
    getClassroomsByBuilding,
    // getClassroomsWithConflict,
    getClassroomsWithConflictFromTime,
    listOneFull,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  };
};

export default useClassrooms;
