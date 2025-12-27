import useAxiosPrivate from '../axios/useAxiosPrivate';
import { AxiosResponse } from 'axios';

import { JSONResponse } from '../../../models/http/responses/common.response.models';
import { UserSessionResponse } from '../../../models/http/responses/userSession.response.models';

const useUserSessionService = () => {
  const PREFIX = '/admin/sessions/users';
  const axios = useAxiosPrivate();

  const list = (): Promise<AxiosResponse<Array<UserSessionResponse>>> => {
    return axios.get(PREFIX);
  };

  const deleteById = (session_id: string): Promise<AxiosResponse<JSONResponse>> => {
    return axios.delete(`${PREFIX}/${session_id}`);
  };

  const deleteByUserId = (
    user_id: number,
  ): Promise<AxiosResponse<JSONResponse>> => {
    return axios.delete(`${PREFIX}/all/${user_id}`);
  };

  return { list, deleteById, deleteByUserId };
};

export default useUserSessionService;
