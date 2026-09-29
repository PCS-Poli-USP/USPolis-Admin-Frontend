import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const PREFIX = '/dev/errors';

const useDevService = () => {
  const axios = useAxiosPrivate();

  const raiseUncaughtError = (): Promise<AxiosResponse<void>> => {
    return axios.get(`${PREFIX}/uncaught`);
  };

  return { raiseUncaughtError };
};

export default useDevService;
