import { Heading, HStack, Text, Image, VStack } from '@chakra-ui/react';
import { GoogleLogin } from '@react-oauth/google';
import { appContext } from 'context/AppContext';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from 'assets/uspolis.logo.png';

interface LocationState {
  from: {
    pathname: string;
  };
}

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state ? state.from.pathname : '/';

  const { getSelfFromBackend } = useContext(appContext);

  const handleLogin = async (token: string) => {
    localStorage.setItem('token', token);
    try {
      await getSelfFromBackend();
      navigate(from, { replace: true });
    } catch (e: any) {
      localStorage.removeItem('token');
      alert(e.message);
    }
  };

  return (
    <VStack p={40} spacing={5} h={'full'} w={'full'}>
      <HStack>
        <Image
          boxSize={'150px'}
          alt='USPolis Logo'
          objectFit='cover'
          src={Logo}
          onClick={() => navigate('/')}
        />
        <Heading size={'4xl'}>USPolis</Heading>
      </HStack>
      <Heading size={'lg'}>Faça login para continuar</Heading>
      <Text>Utilize seu email USP</Text>
      <GoogleLogin
        onSuccess={(credentials) => {
          handleLogin(credentials.credential!);
        }}
        onError={() => {
          alert('Login failed');
        }}
      />
    </VStack>
  );
};

export { AuthPage };
