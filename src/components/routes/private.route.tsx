import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const location = useLocation();
  const token = localStorage.getItem('access_token'); // Check for token in localStorage or sessionStorage
  return token ? (
    <Outlet />
  ) : (
    <Navigate to='/auth' replace={true} state={{ from: location }} /> // To redirects after login
  );
};

export default PrivateRoute;
