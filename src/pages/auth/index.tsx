import { Heading, HStack, Text, Image, VStack, Button } from '@chakra-ui/react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
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
    localStorage.setItem('access_token', token);
    try {
      await getSelfFromBackend();
      navigate(from, { replace: true });
    } catch (e: any) {
      localStorage.removeItem('access_token');
      alert(e.message);
    }
  };

  const login = useGoogleLogin({
    redirect_uri: "http://localhost:3000/auth-callback",
    ux_mode: "redirect",
    flow: 'auth-code',
  });

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
      <Button onClick={() => login()}>Sign in with Google 🚀</Button>;
    </VStack>
  );
};

export { AuthPage };
