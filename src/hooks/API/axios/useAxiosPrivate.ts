/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect } from 'react';
import { axiosPrivate } from '../../../services/api/axios';
import { appContext } from '../../../context/AppContext';
import useCustomToast from '../../useCustomToast';
import { AxiosErrorResponse } from '../../../models/http/responses/common.response.models';

// Self-signed dev certs make every request look like a network-level
// failure, so this check only makes sense in production.
const isDev = import.meta.env.VITE_ENVIROMENT === 'development';

const useAxiosPrivate = () => {
  const context = useContext(appContext);
  const showToast = useCustomToast();

  useEffect(() => {
    // No Authorization header: the httpOnly `session` cookie authenticates
    // every request (axiosPrivate has withCredentials: true).
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        context.setBackendUnavailable(false);
        return response;
      },
      async (error: any) => {
        // No HTTP response at all means the request never completed the
        // TLS handshake with the backend (invalid/expired cert, DNS
        // failure, connection refused, etc) - flag the backend as
        // untrustworthy so credential-collecting features can disable
        // themselves instead of silently sending data over a broken
        // connection.
        if (!error.response && !isDev) {
          context.setBackendUnavailable(true);
        }

        // A 401 for a logged-in user means the session cookie expired or
        // was revoked: there is nothing to refresh, the user must log in.
        // Every service hook installs this interceptor, so the flag makes
        // only the first one react.
        if (
          error.response?.status === 401 &&
          context.isAuthenticated &&
          error.config &&
          !error.config._sessionExpiredHandled
        ) {
          error.config._sessionExpiredHandled = true;
          const re = error as AxiosErrorResponse;
          showToast(
            'Sessão expirada',
            re.response?.data.detail || 'Faça login novamente.',
            'error',
          );
          await context.logout();
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.isAuthenticated]);

  return axiosPrivate;
};

export default useAxiosPrivate;
