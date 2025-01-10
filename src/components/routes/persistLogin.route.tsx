import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { appContext } from 'context/AppContext';
import { AuthHttpService } from 'services/auth/auth.service';
import LoadingPage from 'components/common/LoadingPage';

const OVERRIDE = process.env.REACT_APP_OVERRIDE_AUTH;

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
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
        console.log(error);
        context.logout();
        navigate('/auth');
      }
    };

    if (context.persist && !context.isAuthenticated) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    // Cleanup opcional (se necessário)
    return () => {
      console.log('PersistLogin cleanup');
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.persist, context.isAuthenticated]);

  return (
    <>
      {!context.persist ? <Outlet /> : isLoading ? <LoadingPage /> : <Outlet />}
    </>
  );
};

export default PersistLogin;
