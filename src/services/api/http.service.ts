import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export default abstract class HttpService {
  protected http: AxiosInstance;

  constructor(protected baseURL: string, options: AxiosRequestConfig = {}) {
    this.http = axios.create({ baseURL, ...options });
    this.http.interceptors.request.use(async function (config) {
      const access_token = localStorage.getItem('token');
      console.log(access_token);
      config.headers!['Authorization'] = `Bearer ${access_token}`;
      return config;
    });
    this.http.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
        }
        return Promise.reject(error);
      },
    );
  }
}
