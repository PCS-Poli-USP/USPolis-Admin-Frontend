import { AxiosResponse } from 'axios';
import * as service from '../../../services/api/axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { JSONResponse } from '../../../models/http/responses/common.response.models';
import { MeetingResponse } from '../../../models/http/responses/meeting.response.models';
import {
  CreateMeeting,
  UpdateMeeting,
} from '../../../models/http/requests/meeting.request.models';

const useMeetingsService = () => {
  const axiosCommon = service.default;
  const axios = useAxiosPrivate();
  const PREFIX = '/reservations/meetings';

  const get = (
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Array<MeetingResponse>>> => {
    if (start && end) {
      const params = new URLSearchParams();
      params.append('start', start);
      params.append('end', end);
      return axiosCommon.get(`${PREFIX}`, { params });
    }
    return axiosCommon.get(`${PREFIX}`);
  };

  const create = (
    data: CreateMeeting,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.post(`${PREFIX}`, data);
  };

  const update = (
    data: UpdateMeeting,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.put(`${PREFIX}`, data);
  };

  return { get, create, update };
};

export default useMeetingsService;
