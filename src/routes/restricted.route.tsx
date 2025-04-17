import { appContext } from '../context/AppContext';
import Page401 from '../pages/page401';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

const RestrictedRoute: React.FC = () => {
  const { loggedUser } = useContext(appContext);
  return loggedUser &&
    (loggedUser.is_admin ||
      (loggedUser.buildings && loggedUser.buildings.length > 0)) ? (
    <Outlet />
  ) : (
    <Page401 />
  );
};

export default RestrictedRoute;
