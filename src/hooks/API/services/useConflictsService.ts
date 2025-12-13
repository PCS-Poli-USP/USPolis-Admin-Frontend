import Conflict from '../../../models/http/responses/conflict.response.models';
import { AxiosResponse } from 'axios';
import useAxiosPrivate from '../axios/useAxiosPrivate';
import { ConflictType } from '../../../utils/enums/conflictType.enum';

const useConflictsService = () => {
  const PREFIX = '/conflicts';
  const axios = useAxiosPrivate();

  const listByBuilding = (
    building_id: number,
    type: ConflictType,
    start?: string,
    end?: string,
  ): Promise<AxiosResponse<Conflict>> => {
    const params = new URLSearchParams();
    params.append('type', type);
    if (start && end) {
      params.append('start', start);
      params.append('end', end);
    }
    return axios.get(`${PREFIX}/building/${building_id}`, { params });
  };

  return { listByBuilding };
};

export default useConflictsService;
