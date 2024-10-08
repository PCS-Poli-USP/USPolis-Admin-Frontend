import { GoogleLogin } from '@react-oauth/google';
import { appContext } from 'context/AppContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const { getSelfFromBackend } = useContext(appContext);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    getSelfFromBackend();
    navigate('/classes');
  };

  return (
    <GoogleLogin
      onSuccess={(credentials) => {
        handleLogin(credentials.credential!);
      }}
      onError={() => {
        alert('Login failed');
      }}
    ></GoogleLogin>
  );
};

export { LoginPage };
