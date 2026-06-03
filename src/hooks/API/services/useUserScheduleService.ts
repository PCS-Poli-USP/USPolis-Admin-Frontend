import useAxiosPrivate from '../axios/useAxiosPrivate';
import { AxiosResponse } from 'axios';
import { JSONResponse } from '../../../models/http/responses/common.response.models';
import {
  UserScheduleCrawlResponse,
  UserScheduleResponse,
} from '../../../models/http/responses/userSchedule.response.models';
import {
  CreateUserSchedule,
  JupiterScheduleCrawlRequest,
  UpdateUserSchedule,
} from '../../../models/http/requests/userSchedule.request.models';

const useUserScheduleService = () => {
  const PREFIX = '/users';
  const axios = useAxiosPrivate();

  const getMySchedule = (): Promise<AxiosResponse<UserScheduleResponse>> => {
    return axios.get(`${PREFIX}/my-schedule`);
  };

  const crawlUserSchedule = (
    data: JupiterScheduleCrawlRequest,
  ): Promise<AxiosResponse<UserScheduleCrawlResponse>> => {
    return axios.post(`${PREFIX}/schedules/crawl`, data);
  };

  const create = (
    data: CreateUserSchedule,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.post(`${PREFIX}/schedules/`, data);
  };

  const list = (): Promise<AxiosResponse<Array<UserScheduleResponse>>> => {
    return axios.get(`${PREFIX}/schedules/`);
  };

  const update = (
    user_schedule_id: number,
    data: UpdateUserSchedule,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.put(`${PREFIX}/schedules/${user_schedule_id}`, data);
  };

  const deleteUserSchedule = (user_schedule_id: number): Promise<AxiosResponse<JSONResponse>> => {
    return axios.delete(`${PREFIX}/schedules/${user_schedule_id}`);
  };

  return {
    getMySchedule,
    list,
    create,
    update,
    crawlUserSchedule,
    deleteUserSchedule,
  };
};

export default useUserScheduleService;
