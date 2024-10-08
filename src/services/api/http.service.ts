import { Auth } from 'aws-amplify';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useNavigate } from 'react-router-dom';

export default abstract class HttpService {
  protected http: AxiosInstance;

  constructor(protected baseURL: string, options: AxiosRequestConfig = {}) {
    this.http = axios.create({ baseURL, ...options });
    this.http.interceptors.request.use(async function (config) {
      const access_token = localStorage.getItem("token");
      config.headers!["Authorization"] = `Bearer ${access_token}`;
      return config;
    });
    this.http.interceptors.response.use((response) => {
      return response;
    }, (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    })
  }
}
