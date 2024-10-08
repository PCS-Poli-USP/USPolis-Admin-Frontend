import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    navigate("/classes");
  }

  return (
    <GoogleLogin
      onSuccess={(credentials) => {
        handleLogin(credentials.credential!)
      }}
      onError={() => {
        alert('Login failed');
      }}
    ></GoogleLogin>
  );
};

export { LoginPage };
