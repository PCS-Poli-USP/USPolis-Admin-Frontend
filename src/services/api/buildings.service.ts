import { AxiosResponse } from 'axios';
import {
  CreateBuilding,
  UpdateBuilding,
} from 'models/http/requests/building.request.models';
import HttpService from './http.service';
import { BuildingResponse } from 'models/http/responses/building.response.models';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class BuildingsService extends HttpService {
  constructor() {
    super(`${USPOLIS_SERVER_URL}`);
  }

  getAll(): Promise<AxiosResponse<Array<BuildingResponse>>> {
    return this.http.get('/buildings');
  }

  getMyBuildings(): Promise<AxiosResponse<Array<BuildingResponse>>> {
    return this.http.get('/users/my-buildings');
  }

  create(data: CreateBuilding): Promise<AxiosResponse<BuildingResponse>> {
    return this.http.post('/admin/buildings', data);
  }

  delete(id: number): Promise<AxiosResponse<undefined>> {
    return this.http.delete(`/admin/buildings/${id}`);
  }

  update(
    id: number,
    data: UpdateBuilding,
  ): Promise<AxiosResponse<BuildingResponse>> {
    return this.http.put(`/admin/buildings/${id}`, data);
  }
}
