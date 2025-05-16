import Conflict from '../../../models/http/responses/conflict.response.models';
import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { ConflictType } from '../../../utils/enums/conflictType.enum';

const useConflictsService = () => {
  const PREFIX = '/conflicts';
  const axios = useAxiosPrivate();

  const list = (
    start: string,
    end: string,
    type: ConflictType,
  ): Promise<AxiosResponse<Conflict[]>> => {
    const params = new URLSearchParams();
    params.append('start', start);
    params.append('end', end);
    params.append('type', type);
    return axios.get(PREFIX, { params });
  };

  return { list };
};

export default useConflictsService;
