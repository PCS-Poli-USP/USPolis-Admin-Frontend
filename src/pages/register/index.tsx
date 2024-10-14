import { Button, Input } from '@chakra-ui/react';
import { GoogleLogin } from '@react-oauth/google';
import { appContext } from 'context/AppContext';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicUsersService from 'services/api/public.users.service';

const RegisterPage = () => {
  const navigate = useNavigate();

  const publicUsersService = new PublicUsersService();

  const handleRegisterCick = async () => {
    console.log(token);
    localStorage.setItem('token', token!);
    try {
      await publicUsersService.create(username!);
      alert('Registrado com sucesso!');
      navigate('/login');
    } catch (e: any) {
      setToken('');
      alert('Email or username already registered!');
    } finally {
      localStorage.removeItem('token');
    }
  };

  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);

  return (
    <>
      <Input
        value={username || ''}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      {!!token ? (
        <p>Logado no google com sucesso!</p>
      ) : (
        <GoogleLogin
          onSuccess={(credentials) => {
            setToken(credentials.credential!);
          }}
          onError={() => {
            alert('Google login failed');
          }}
        ></GoogleLogin>
      )}

      <Button isDisabled={!token || !username} onClick={handleRegisterCick}>
        Cadastrar
      </Button>
    </>
  );
};

export { RegisterPage };
