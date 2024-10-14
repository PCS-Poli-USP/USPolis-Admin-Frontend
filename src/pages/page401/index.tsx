import { Heading, VStack } from '@chakra-ui/react';
import PageContent from 'components/common/PageContent';

function Page401() {
  return (
    <PageContent>
      <VStack p={40}>
        <Heading size={'3xl'}>Erro 401</Heading>
        <Heading>Você não tem permissão para acessar essa página.</Heading>
      </VStack>
    </PageContent>
  );
}

export default Page401;
