import { Flex, Spinner, Text, useMediaQuery } from '@chakra-ui/react';

function LoadingRedirect() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');

  return (
    <Flex
      justify={'center'}
      align={'center'}
      direction={'column'}
      w={'100vw'}
      h={'100vh'}
      gap={'30px'}
    >
      <Text textAlign={'center'} w={isMobile ? '80%' : '30%'}>
        Login efetuado com sucesso, aguarde redirecionamento....
      </Text>
      <Spinner size={'xl'} />
    </Flex>
  );
}

export default LoadingRedirect;
