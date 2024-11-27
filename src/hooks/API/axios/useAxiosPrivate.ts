import { useContext, useEffect } from 'react';
import { AuthHttpService } from 'services/auth/auth.service';
import { axiosPrivate } from '../../../services/api/axios';
import { appContext } from 'context/AppContext';

const authHttpService = new AuthHttpService();

const useAxiosPrivate = () => {
  const context = useContext(appContext);
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async function (config) {
        const access_token = context.accessToken;
        config.headers!['Authorization'] = `Bearer ${access_token}`;
        return config;
      },
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
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
            localStorage.removeItem('refresh_token');
            Promise.reject(error);
            return;
          }
          try {
            const response = await authHttpService.refreshToken(refreshToken!);
            const newAccessToken = response.data.access_token;
            context.setAccessToken(newAccessToken);
            originalRequest.headers[
              'Authorization'
            ] = `Bearer ${newAccessToken}`;
            try {
              const retryResponse = await axiosPrivate(originalRequest);
              return Promise.resolve(retryResponse);
            } catch (retryError: any) {
              Promise.reject(retryError);
            }
          } catch {
            alert('Error refreshing token! Please, login again!');
            await context.logout();
            Promise.reject(error);
          }
        }
        if (error.response && error.response.status === 403) {
          alert('Error refreshing token! Please, login again 2!');
          await context.logout();
          Promise.reject(error);
          return;
        } else {
          Promise.reject(error);
          return;
        }
      },
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [context]);

  return axiosPrivate;
};

export default useAxiosPrivate;
