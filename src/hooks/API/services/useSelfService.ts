import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { UserResponse } from '../../../models/http/responses/user.response.models';

const useSelfService = () => {
  const PREFIX = '/users';
  const axios = useAxiosPrivate();

  const getSelf = (): Promise<AxiosResponse<UserResponse>> => {
    return axios.get(PREFIX);
  };

  return { getSelf };
};

export default useSelfService;
