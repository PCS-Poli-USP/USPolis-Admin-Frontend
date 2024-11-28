import {
  Heading,
  HStack,
  Text,
  Image,
  Button,
  Checkbox,
} from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';
import { Card, CardBody, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Logo from 'assets/uspolis.logo.png';
import { useContext, useState } from 'react';
import { appContext } from 'context/AppContext';

const AuthPage = () => {
  const context = useContext(appContext);
  const [checked, setChecked] = useState(context.persist);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    redirect_uri:
      process.env.REACT_APP_REDIRECT_URI ??
      'http://localhost:3000/auth-callback',
    ux_mode: 'redirect',
    flow: 'auth-code',
  });

  return (
    <Flex
      h={'100vh'}
      w={'100vw'}
      justify={'center'}
      align={'center'}
      direction={'column'}
    >
      <Card mb={'200px'} boxShadow={'dark-lg'}>
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
            <Heading size={'lg'} textAlign={'center'}>
              Faça login para continuar
            </Heading>
            <Text fontSize={'lg'}>Utilize seu email USP</Text>
            <Button onClick={() => login()}>
              <HStack gap={2}>
                <Image
                  src='https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA'
                  width={5}
                />
                <span>Google Sign In</span>
              </HStack>
            </Button>
            <Checkbox
              isChecked={checked}
              onChange={(event) => {
                localStorage.setItem('persist', String(event.target.checked));
                setChecked(event.target.checked);
              }}
            >
              Lembrar desse dispositivo
            </Checkbox>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
};

export { AuthPage };
