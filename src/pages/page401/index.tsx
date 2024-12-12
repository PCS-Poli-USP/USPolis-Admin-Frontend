import { Flex, Heading, Text } from '@chakra-ui/react';
import PageContent from 'components/common/PageContent';

function Page401() {
  return (
    <PageContent>
      <Flex
        gap={'40px'}
        direction={'column'}
        justify={'center'}
        align={'center'}
        verticalAlign={'center'}
        h={'100%'} // 60px header + 8px de padding top e bot
      >
        <Heading size={'3xl'}>Erro 401</Heading>
        <Text fontSize={'2xl'} textAlign={'center'}>
          Você não tem permissão para acessar essa página.
        </Text>
      </Flex>
    </PageContent>
  );
}

export default Page401;
