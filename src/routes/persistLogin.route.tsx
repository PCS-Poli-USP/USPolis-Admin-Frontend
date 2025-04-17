import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { appContext } from '../context/AppContext';
import { AuthHttpService } from '../services/auth/auth.service';
import LoadingPage from '../components/common/LoadingPage';

const OVERRIDE = import.meta.env.VITE_OVERRIDE_PERSIST_LOGIN;

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const service = new AuthHttpService();
  const context = useContext(appContext);

  useEffect(() => {
    if (OVERRIDE === 'true') {
      setIsLoading(false);
      return;
    }

    const verifyRefreshToken = async () => {
      try {
        const refresh = localStorage.getItem('refresh_token');

        if (!refresh) {
          setIsLoading(false);
          return;
        }

        await service.refreshToken(refresh).then(async (response) => {
          context.setAccessToken(response.data.access_token);
          context.setIsAuthenticated(true);
        });
      } catch (error) {
        context.logout();
        if (location.pathname !== '/index') navigate('/auth');
        else setIsLoading(false);
      }
    };

    if (context.persist && !context.isAuthenticated) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    // Cleanup opcional (se necessário)
    return () => {};

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.persist, context.isAuthenticated]);

  return (
    <>
      {!context.persist ? <Outlet /> : isLoading ? <LoadingPage /> : <Outlet />}
    </>
  );
};

export default PersistLogin;
