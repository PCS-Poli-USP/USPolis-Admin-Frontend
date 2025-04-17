import { AxiosResponse } from 'axios';
import {
  CreateBuilding,
  UpdateBuilding,
} from '../../../models/http/requests/building.request.models';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import useAxiosPrivate from '../axios/useAxiosPrivate';

const useBuildingsService = () => {
  const axios = useAxiosPrivate();
  const getAll = (): Promise<AxiosResponse<Array<BuildingResponse>>> => {
    return axios.get('/buildings');
  };

  const getMyBuildings = (): Promise<
    AxiosResponse<Array<BuildingResponse>>
  > => {
    return axios.get('/users/my-buildings');
  };

  const create = (
    data: CreateBuilding,
  ): Promise<AxiosResponse<BuildingResponse>> => {
    return axios.post('/admin/buildings', data);
  };

  const deleteById = (id: number): Promise<AxiosResponse<undefined>> => {
    return axios.delete(`/admin/buildings/${id}`);
  };

  const update = (
    id: number,
    data: UpdateBuilding,
  ): Promise<AxiosResponse<BuildingResponse>> => {
    return axios.put(`/admin/buildings/${id}`, data);
  };

  return { getAll, getMyBuildings, create, deleteById, update };
};

export default useBuildingsService;
