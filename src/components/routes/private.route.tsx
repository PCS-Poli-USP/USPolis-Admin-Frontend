import { Navigate, Outlet, useLocation } from 'react-router-dom';

const OVERRIDE = process.env.REACT_APP_OVERRIDE_AUTH;

const PrivateRoute: React.FC = () => {
  const location = useLocation();
  console.log(OVERRIDE);
  const token = localStorage.getItem('access_token'); // Check for token in localStorage or sessionStorage
  return token || OVERRIDE === 'true' ? (
    <Outlet />
  ) : (
    <Navigate to='/auth' replace={true} state={{ from: location }} /> // To redirects after login
  );
};

export default PrivateRoute;
