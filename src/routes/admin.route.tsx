import LoadingPage from '../components/common/LoadingPage';
import { appContext } from '../context/AppContext';
import Page401 from '../pages/page401';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

const AdminRoute: React.FC = () => {
  const { loggedUser, loading, isAuthenticated } = useContext(appContext);
  if (isAuthenticated && loading) return <LoadingPage />;
  return loggedUser && loggedUser.is_admin ? <Outlet /> : <Page401 />;
};

export default AdminRoute;
