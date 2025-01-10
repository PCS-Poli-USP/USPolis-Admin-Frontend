import { appContext } from 'context/AppContext';
import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const OVERRIDE = process.env.REACT_APP_OVERRIDE_AUTH;

const PrivateRoute: React.FC = () => {
  const location = useLocation();
  const context = useContext(appContext);
  return context.isAuthenticated || OVERRIDE === 'true' ? (
    <Outlet />
  ) : (
    <Navigate to='/auth' replace={true} state={{ from: location }} /> // To redirects after login
  );
};

export default PrivateRoute;
