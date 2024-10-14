import { Navigate } from 'react-router-dom';

interface props {
    element: JSX.Element
}

const PrivateRoute: React.FC<props> = ({ element }) => {
  const token = localStorage.getItem('token'); // Check for token in localStorage or sessionStorage
  return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;