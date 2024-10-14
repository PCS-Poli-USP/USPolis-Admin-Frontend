import { Heading, VStack } from '@chakra-ui/react';
import PageContent from 'components/common/PageContent';

function Page404() {
  return (
    <PageContent>
      <VStack p={40}>
        <Heading size={'3xl'}>Erro 404</Heading>
        <Heading>Página não encontrada.</Heading>
      </VStack>
    </PageContent>
  );
}

export default Page404;
