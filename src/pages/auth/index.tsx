import {
  Heading,
  HStack,
  Text,
  Image,
  Button,
  Card,
  CardBody,
  Flex,
} from '@chakra-ui/react';

import { useGoogleLogin } from '@react-oauth/google';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import Logo from '../../assets/uspolis.logo.png';
import { isCapacitor } from '../../utils/isCapacitor';
import { appContext } from '../../context/AppContext';
import { AuthHttpService } from '../../services/auth/auth.service';

const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URI;
const ALLOWED_DOMAIN = 'usp.br';

const AuthPage = () => {
  const navigate = useNavigate();

  const { setAccessToken, setIsAuthenticated } =
    useContext(appContext);

  const authService = new AuthHttpService();


  useEffect(() => {
    if (isCapacitor()) {
      GoogleSignIn.initialize({
      clientId: import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID,
      scopes: [
        'openid',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      }).catch((error) => {
        console.error(
          'Erro ao inicializar Google Sign-In:',
          error,
        );
      });
    }
  }, []);

  async function handleGoogleLogin() {
    if (isCapacitor()) {
      try {
        const result = await GoogleSignIn.signIn();

        console.log(
          'Resultado do Google Sign-In:',
          result,
          JSON.stringify(result, null, 2),
        );

        if (!result.idToken) {
          throw new Error(
            'Google não retornou o idToken.',
          );
        }

        if (!result.serverAuthCode) {
          throw new Error(
            'Google não retornou o serverAuthCode.',
          );
        }

        const response = await authService.mobileLogin(
          result.idToken,
          result.serverAuthCode,
        );

        setAccessToken(response.data.access_token);
        setIsAuthenticated(true);

        navigate('/public/allocations');
      } catch (error) {
        console.error(
          'Erro no login nativo do Google:',
          error,
        );
      }
    } else {
      login();
    }
  }

  const login = useGoogleLogin({
    redirect_uri:
      REDIRECT_URL ??
      'http://localhost:3000/auth-callback',

    ux_mode: 'redirect',

    flow: 'auth-code',

    hosted_domain: ALLOWED_DOMAIN,
  });


  return (
    <Flex
      h={'100vh'}
      w={'100vw'}
      justify={'center'}
      align={'center'}
      direction={'column'}
    >
      <Card
        mb={'200px'}
        boxShadow={'dark-lg'}
      >
        <CardBody maxW={'600px'}>
          <Flex
            padding={30}
            gap={5}
            h={'full'}
            w={'full'}
            direction="column"
            align="flex-start"
            alignItems={'center'}
            justify="center"
          >
            <HStack>
              <Image
                boxSize={'170px'}
                alt="USPolis Logo"
                objectFit="cover"
                src={Logo}
                onClick={() =>
                  navigate('/public/allocations')
                }
              />
            </HStack>

            <Heading
              size={'xl'}
              textColor={'teal'}
            >
              USPolis
            </Heading>

            <Heading
              size={'lg'}
              textAlign={'center'}
            >
              Faça login para continuar
            </Heading>

            <Text fontSize={'lg'}>
              Utilize seu email USP
            </Text>

            <Button onClick={handleGoogleLogin}>
              <HStack gap={2}>
                <Image
                  src="https://lh3.googleusercontent.com/COxitqgJ1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                  width={5}
                />

                <span>
                  Google Sign In
                </span>
              </HStack>
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default AuthPage;