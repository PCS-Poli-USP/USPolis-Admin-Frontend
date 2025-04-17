import Conflict from '../../../models/http/responses/conflict.response.models';
import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useConflictsService = () => {
  const PREFIX = '/conflicts';
  const axios = useAxiosPrivate();

  const list = (): Promise<AxiosResponse<Conflict[]>> => {
    return axios.get(PREFIX);
  };

  return { list };
};

export default useConflictsService;
