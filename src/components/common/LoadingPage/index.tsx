import { Flex, Heading, Spinner } from '@chakra-ui/react';

function LoadingPage() {
  return (
    <Flex
      flex='1'
      direction='column'
      width='100vw'
      height='100vh'
      align={'center'}
      justify={'top'}
      overflow={'auto'}
      p={'50px'}
    >
      <Heading mb={4}>Carregando...</Heading>

      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
      />
    </Flex>
  );
}

export default LoadingPage;
