import LoadingPage from '../components/common/LoadingPage';
import { appContext } from '../context/AppContext';
import Page401 from '../pages/page401';
import { hasRestrictedAccess } from '../utils/users/users.formatter';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

const RestrictedRoute: React.FC = () => {
  const { loggedUser, isAuthenticated, loading } = useContext(appContext);
  if (isAuthenticated && loading) return <LoadingPage />;
  return hasRestrictedAccess(loggedUser) ? <Outlet /> : <Page401 />;
};

export default RestrictedRoute;
