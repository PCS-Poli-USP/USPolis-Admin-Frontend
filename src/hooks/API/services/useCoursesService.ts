import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { CreateCourse, UpdateCourse } from '../../../models/http/requests/course.request.models';
import { CourseResponse } from '../../../models/http/responses/course.response.models';

const useCoursesService = () => {
    const axios = useAxiosPrivate();

    const create = (
        data: CreateCourse,
    ): Promise<AxiosResponse<{ message: string }>> => {
        return axios.post('/admin/courses', data);
    };

    const getAll = (): Promise<AxiosResponse<Array<CourseResponse>>> => {
        return axios.get('/courses');
    };

    const update = (
      id: number,
      data: UpdateCourse,
    ): Promise<AxiosResponse<{ message: string }>> => {
      return axios.put(`/admin/courses/${id}`, data);
    };

    const deleteById = (id: number): Promise<AxiosResponse<{ message: string }>> => {
      return axios.delete(`/admin/courses/${id}`);
    };


  return {
    getAll,
    create,
    update,
    deleteById,
  };
};

export default useCoursesService;