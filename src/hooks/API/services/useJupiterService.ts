import { AxiosResponse } from "axios";
import useAxiosPrivate from "../axios/useAxiosPrivate";

export interface CourseOptionResponse {
  codcur: number;
  codhab: number;
  name: string;
}

const useJupiterService = () => {
  const axios = useAxiosPrivate();

  const getCachedCourseOptions = (): Promise<
    AxiosResponse<CourseOptionResponse[]>
  > => {
    return axios.get("/courses/options");
  };

  const syncCourseOptions = (
    codcg: number = 3
  ): Promise<AxiosResponse<CourseOptionResponse[]>> => {
    return axios.post(`/courses/options/sync?codcg=${codcg}`);
  };

  return {
    getCachedCourseOptions,
    syncCourseOptions,
  };
};

export default useJupiterService;