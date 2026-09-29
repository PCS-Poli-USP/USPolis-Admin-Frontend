import { Outlet } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { appContext } from '../context/AppContext';
import { AuthHttpService } from '../services/auth/auth.service';
import LoadingPage from '../components/common/LoadingPage';

const OVERRIDE = import.meta.env.VITE_OVERRIDE_PERSIST_LOGIN;

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const service = new AuthHttpService();
  const context = useContext(appContext);

  useEffect(() => {
    if (OVERRIDE === 'true') {
      setIsLoading(false);
      return;
    }

    // A successful refresh is itself valid proof of an active session, so
    // it still marks the tab authenticated (same as before). What changed
    // is failure here: a stale/missing refresh token no longer concludes
    // "logged out" on its own - it just clears itself locally, and the
    // real answer comes from verifySession's cookie-based check below,
    // which runs regardless.
    const refreshAccessToken = async () => {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) return;
      try {
        const response = await service.refreshToken(refresh);
        context.setAccessToken(response.data.access_token);
        context.setIsAuthenticated(true);
      } catch (error) {
        console.error('Error refreshing access token:', error);
        localStorage.removeItem('refresh_token');
      }
    };

    // The httponly session cookie is sent automatically on this
    // same-origin request (axiosPrivate has withCredentials: true) even
    // with no Authorization header, so this is a real check against the
    // backend - not just "is there a token already in this tab's memory" -
    // and works correctly in a brand-new tab/window that never ran the
    // OAuth flow itself but shares the browser's session cookie.
    const verifySession = async () => {
      await Promise.allSettled([
        refreshAccessToken(),
        context.getSelfFromBackend(),
      ]);
      setIsLoading(false);
    };

    if (context.persist && !context.isAuthenticated) {
      verifySession();
    } else {
      setIsLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.persist, context.isAuthenticated]);

  return (
    <>
      {!context.persist ? <Outlet /> : isLoading ? <LoadingPage /> : <Outlet />}
    </>
  );
};

export default PersistLogin;
