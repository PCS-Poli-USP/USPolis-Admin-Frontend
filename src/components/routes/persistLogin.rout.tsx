import { Outlet } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Spinner } from '@chakra-ui/react';
import { appContext } from 'context/AppContext';
import { AuthHttpService } from 'services/auth/auth.service';

const OVERRIDE = process.env.REACT_APP_OVERRIDE_AUTH;

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const service = new AuthHttpService();
  const context = useContext(appContext);

  useEffect(() => {
    console.log('PersistLogin', context);
    if (OVERRIDE === 'true') {
      setIsLoading(false);
      return;
    }
    const verifyRefreshToken = async () => {
      try {
        const refresh = localStorage.getItem('refresh_token');
        const response = await service.refreshToken(refresh || '');
        localStorage.setItem('access_token', response.data.access_token);
        context.getSelfFromBackend();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    context.persist && !context.isAuthenticaded
      ? verifyRefreshToken()
      : setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  return (
    <>{!context.persist ? <Outlet /> : isLoading ? <Spinner /> : <Outlet />}</>
  );
};

export default PersistLogin;
