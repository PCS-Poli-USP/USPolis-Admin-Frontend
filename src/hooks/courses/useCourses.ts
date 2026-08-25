/* eslint-disable react-hooks/exhaustive-deps */
import useCustomToast from '../useCustomToast';
import { useCallback, useEffect, useState } from 'react';
import {
  CreateCourse,
  UpdateCourse,
} from '../../models/http/requests/course.request.models';
import { CourseResponse } from '../../models/http/responses/course.response.models';
import { CoursesErrorParser } from './coursesErrorParser';
import useCoursesService from '../API/services/useCoursesService';

const useCourses = (initialFetch: boolean = true) => {
  const service = useCoursesService();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CourseResponse[]>([]);

  const parser = new CoursesErrorParser();
  const showToast = useCustomToast();

  const getCourses = useCallback(async () => {
    setLoading(true);
    await service
      .getAll()
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const createCourse = useCallback(
    async (data: CreateCourse) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast(
            'Sucesso',
            `Curso ${data.name} criado com sucesso!`,
            'success',
          );
          getCourses();
        })
        .catch((error) => {
          showToast('Erro', parser.parseCreateError(error), 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getCourses, showToast, service],
  );

  const updateCourse = useCallback(
    async (id: number, data: UpdateCourse) => {
      setLoading(true);
      await service
        .update(id, data)
        .then(() => {
          showToast('Sucesso', 'Curso atualizado com sucesso!', 'success');
          getCourses();
        })
        .catch((error) => {
          showToast('Erro', parser.parseUpdateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getCourses, showToast, service],
  );

  const deleteCourse = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then(() => {
          showToast('Sucesso!', 'Sucesso ao remover curso', 'success');
          getCourses();
        })
        .catch((error) => {
          showToast('Erro!', parser.parseDeleteError(error), 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getCourses, showToast, service],
  );

  useEffect(() => {
    if (initialFetch) getCourses();
  }, [initialFetch]);

  return {
    loading,
    courses,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};

export default useCourses;
