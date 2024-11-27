import { Outlet } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Spinner } from '@chakra-ui/react';
import { appContext } from 'context/AppContext';
import useSelfService from 'hooks/API/services/useSelfService';

const MOCK_AUTH = process.env.REACT_APP_MOCK_AUTH;

const PersistLogin = () => {
  const service = useSelfService();

  const [isLoading, setIsLoading] = useState(true);
  const context = useContext(appContext);

  useEffect(() => {
    console.log(context.loggedUser, 'in persist login');
    if (MOCK_AUTH) {
      setIsLoading(false);
      return;
    }

    !context.accessToken ? context.getSelfFromBackend() : setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>{!context.persist ? <Outlet /> : isLoading ? <Spinner /> : <Outlet />}</>
  );
};

export default PersistLogin;
