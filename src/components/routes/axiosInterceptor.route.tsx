import useAxiosPrivate from 'hooks/API/axios/useAxiosPrivate';
import { Outlet } from 'react-router-dom';

// Para garantir que o interceptor carregue PRIMEIRO que o access_token (em PersistLogin)
function AxiosInterceptorRoute() {
  useAxiosPrivate();

  return <Outlet />;
}

export default AxiosInterceptorRoute;
