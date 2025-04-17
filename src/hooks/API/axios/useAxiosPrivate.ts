import { useContext, useEffect } from 'react';
import { AuthHttpService } from '../../../services/auth/auth.service';
import { axiosPrivate } from '../../../services/api/axios';
import { appContext } from '../../../context/AppContext';

const authHttpService = new AuthHttpService();

const useAxiosPrivate = () => {
  const context = useContext(appContext);

  useEffect(() => {
    if (!context.accessToken) {
      return;
    }
    // Ejetar interceptores antigos antes de adicionar novos
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: any) => {
        // If request is being retried, don't add the context acessToken, the request already has it and the context isn't updated yet
        if (config._retry) {
          return config;
        }
        // Use o accessToken mais recente do contexto
        if (context.accessToken) {
          if (!config.headers) {
            config.headers = {};
          }
          config.headers['Authorization'] = `Bearer ${context.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: any) => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true; // Prevent looping retries
          const refreshToken: string | null =
            localStorage.getItem('refresh_token');

          // Se não houver refresh token, remover e retornar erro
          if (!refreshToken) {
            console.log('No refresh token found!');
            localStorage.removeItem('refresh_token');
            return Promise.reject(error);
          }

          try {
            const response = await authHttpService.refreshToken(refreshToken);
            const newAccessToken = response.data.access_token;
            context.setAccessToken(newAccessToken);

            originalRequest.headers[
              'Authorization'
            ] = `Bearer ${newAccessToken}`;

            const retryResponse = await axiosPrivate(originalRequest);
            return retryResponse;
          } catch (refreshError: any) {
            console.log('Error refreshing access token!', refreshError);
            alert('Error refreshing token! Please, login again!');
            context.logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error); // Retorna erro caso não seja 401
      },
    );

    return () => {
      // Limpeza dos interceptores quando o componente for desmontado
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.accessToken]); // O useEffect depende do accessToken ser atualizado no contexto

  return axiosPrivate;
};

export default useAxiosPrivate;
