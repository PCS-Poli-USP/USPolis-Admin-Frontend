import { Auth } from 'aws-amplify';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export default abstract class HttpService {
  protected http: AxiosInstance;

  constructor(protected baseURL: string, options: AxiosRequestConfig = {}) {
    this.http = axios.create({ baseURL, ...options });
    this.http.interceptors.request.use(async function (config) {
      const access_token = (await Auth.currentSession()).getAccessToken().getJwtToken();
      config.headers = { Authorization: `Bearer ${access_token}` };
      return config;
    });
  }
}
