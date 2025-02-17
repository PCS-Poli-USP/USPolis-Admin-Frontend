import { AxiosResponse } from 'axios';
import {
  CrawlSubject,
  CreateSubject,
  UpdateCrawlSubject,
  UpdateSubject,
} from 'models/http/requests/subject.request.models';
import {
  SubjectCrawlResponse,
  SubjectResponse,
} from 'models/http/responses/subject.response.models';
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
  ): Promise<AxiosResponse<SubjectCrawlResponse>> => {
    return axios.post(`${PREFIX}/crawl`, data, {
      headers: { 'building-id': String(building_id) },
    });
  };

  const updateCrawl = (
    data: UpdateCrawlSubject,
  ): Promise<AxiosResponse<SubjectCrawlResponse>> => {
    return axios.patch(`${PREFIX}/crawl`, data);
  };

  return { get, getMine, create, deleteById, update, crawl, updateCrawl };
};

export default useSubjectsService;
