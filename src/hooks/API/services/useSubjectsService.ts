import { AxiosResponse } from 'axios';
import {
  CrawlSubject,
  CreateSubject,
  UpdateSubject,
} from 'models/http/requests/subject.request.models';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useSubjectsService = () => {
  const PREFIX = '/subjects';
  const axios = useAxiosPrivate();

  const get = (): Promise<AxiosResponse<Array<SubjectResponse>>> => {
    return axios.get(PREFIX);
  };

  const getMine = (): Promise<AxiosResponse<Array<SubjectResponse>>> => {
    return axios.get(`/users/my-subjects`);
  };

  const create = (
    data: CreateSubject,
  ): Promise<AxiosResponse<SubjectResponse>> => {
    return axios.post(PREFIX, data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<undefined>> => {
    return axios.delete(`${PREFIX}/${id}`);
  };

  const update = (
    id: number,
    data: UpdateSubject,
  ): Promise<AxiosResponse<SubjectResponse>> => {
    return axios.put(`${PREFIX}/${id}`, data);
  };

  const crawl = (
    building_id: number,
    data: CrawlSubject,
  ): Promise<AxiosResponse<any>> => {
    return axios.post(`${PREFIX}/crawl`, data, {
      headers: { 'building-id': String(building_id) },
    });
  };

  return { get, getMine, create, deleteById, update, crawl };
};

export default useSubjectsService;
