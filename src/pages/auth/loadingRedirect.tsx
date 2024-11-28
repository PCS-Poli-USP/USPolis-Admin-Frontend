import { Flex, Spinner, Text } from '@chakra-ui/react';

function LoadingRedirect() {
  return (
    <Flex
      justify={'center'}
      align={'center'}
      direction={'column'}
      w={'100vw'}
      h={'100vh'}
      gap={'30px'}
    >
      <Text textAlign={'justify'} w={'80%'}>
        Login efetuado com sucesso, aguarde redirecionamento....
      </Text>
      <Spinner size={'xl'} />
    </Flex>
  );
}

export default LoadingRedirect;
