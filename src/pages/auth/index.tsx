import {
  Heading,
  HStack,
  Text,
  Image,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Flex,
  StackDivider,
  Spacer,
} from '@chakra-ui/react';
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
    <Flex
      h={'100vh'}
      w={'100vw'}
      justify={'center'}
      align={'center'}
      direction={'column'}
    >
      <Card mb={'200px'}>
        <CardBody maxW={'600px'}>
          <Flex
            padding={30}
            gap={5}
            h={'full'}
            w={'full'}
            direction='column' // Para organizar os itens em coluna
            align='flex-start' // Alinha os itens no topo
            alignItems={'center'}
            justify='center' // Centraliza horizontalmente
            // divider={<StackDivider />}
          >
            <HStack>
              <Image
                boxSize={'170px'}
                alt='USPolis Logo'
                objectFit='cover'
                src={Logo}
                onClick={() => navigate('/allocation')}
              />
            </HStack>
            <Heading size={'xl'} textColor={'teal'}>
              USPolis
            </Heading>
            <Heading size={'lg'}>Faça login para continuar</Heading>
            <Text fontSize={'lg'}>Utilize seu email USP</Text>
            <GoogleLogin
              onSuccess={(credentials) => {
                handleLogin(credentials.credential!);
              }}
              onError={() => {
                alert('Login failed');
              }}
            />
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
};

export { AuthPage };
