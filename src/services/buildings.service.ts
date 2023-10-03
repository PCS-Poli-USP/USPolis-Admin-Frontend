import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Building, CreateBuilding } from 'models/building.model';
import HttpService from './http.service';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default class BuildingsService {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({ baseURL: `http://localhost:5000/api/building` });
  }

  list(): Promise<AxiosResponse<Array<Building>>> {
    return this.http.get('');
  }

  create(data: CreateBuilding): Promise<AxiosResponse<any>> {
    return this.http.post('', data);
  }

  delete(id: string): Promise<AxiosResponse<any>> {
    return this.http.delete(id);
  }

  update(id: string, data: any): Promise<AxiosResponse<any>> {
    return this.http.put(id, data);
  }
}
