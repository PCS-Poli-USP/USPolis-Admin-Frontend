import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { UserResponse } from '../../../models/http/responses/user.response.models';
import { UserAccessResponse } from '../../../models/http/responses/access.response.models';

const useSelfService = () => {
  const PREFIX = '/users';
  const axios = useAxiosPrivate();

  const getSelf = (): Promise<AxiosResponse<UserResponse>> => {
    return axios.get(PREFIX);
  };

  // What the user can see and do, already resolved by the backend.
  const getMyAccess = (): Promise<AxiosResponse<UserAccessResponse>> => {
    return axios.get(`${PREFIX}/my-access`);
  };

  return { getSelf, getMyAccess };
};

export default useSelfService;
