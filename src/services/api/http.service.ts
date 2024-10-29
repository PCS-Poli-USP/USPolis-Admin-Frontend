import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthHttpService } from 'services/auth/auth.service';

export default abstract class HttpService {
  protected http: AxiosInstance;
  private authHttpService: AuthHttpService;

  constructor(protected baseURL: string, options: AxiosRequestConfig = {}) {
    this.http = axios.create({ baseURL, ...options });
    this.authHttpService = new AuthHttpService();
    this.http.interceptors.request.use(async function (config) {
      const access_token = localStorage.getItem('access_token');
      config.headers!['Authorization'] = `Bearer ${access_token}`;
      return config;
    });
    this.http.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true; // prevent loop

          const refreshToken: string | null =
            localStorage.getItem('refresh_token');
          if (refreshToken == null) {
            alert('No access token, please login again!');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            Promise.reject(error);
            return;
          }
          try {
            const response = await this.authHttpService.refreshToken(
              refreshToken!,
            );
            const newAccessToken = response.data.access_token;
            localStorage.setItem('access_token', newAccessToken);
            originalRequest.headers[
              'Authorization'
            ] = `Bearer ${newAccessToken}`;
            try {
              const retryResponse = await this.http(originalRequest);
              return Promise.resolve(retryResponse);
            } catch (retryError: any) {
              Promise.reject(retryError);
            }
          } catch {
            alert('Error refreshing token! Please, login again!');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            Promise.reject(error);
          }
        } else {
          Promise.reject(error);
          return;
        }
      },
    );
  }
}
