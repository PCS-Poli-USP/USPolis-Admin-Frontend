import { Flex, Heading, Text } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';

function Page404() {
  return (
    <PageContent>
      <Flex
        gap={'40px'}
        direction={'column'}
        justify={'center'}
        align={'center'}
        verticalAlign={'center'}
      >
        <Heading size={'3xl'}>Erro 404</Heading>
        <Text fontSize={'2xl'} textAlign={'center'}>
          Página não encontrada.
        </Text>
      </Flex>
    </PageContent>
  );
}

export default Page404;
