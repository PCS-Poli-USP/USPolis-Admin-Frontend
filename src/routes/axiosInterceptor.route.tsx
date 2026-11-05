import useAxiosPrivate from '../hooks/API/axios/useAxiosPrivate';
import { Outlet } from 'react-router-dom';

// Instala o interceptor (sessão expirada / backend indisponível) antes do PersistLogin
function AxiosInterceptorRoute() {
  useAxiosPrivate();

  return <Outlet />;
}

export default AxiosInterceptorRoute;
