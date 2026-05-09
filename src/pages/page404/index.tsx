import { Flex, Heading, Text } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import { PiSmileySad } from 'react-icons/pi';

function Page404() {
  return (
    <PageContent>
      <Flex
        gap={'40px'}
        height='calc(100vh - 100px)'
        direction={'column'}
        justify={'flex-start'}
        align={'center'}
        margin={'0 auto 0 auto'}
      >
        <PiSmileySad size={'128px'} />
        <Heading size={'3xl'}>Erro 404</Heading>
        <Text fontSize={'2xl'} textAlign={'center'}>
          Página não encontrada, verifique se o endereço está correto ou entre
          em contato com o suporte.
        </Text>
      </Flex>
    </PageContent>
  );
}

export default Page404;
