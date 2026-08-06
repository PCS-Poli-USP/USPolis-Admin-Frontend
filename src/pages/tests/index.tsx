import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import PageContent from '../../components/common/PageContent';

function TestsPage() {
  const [throwError, setThrowError] = useState(false);

  // Thrown during render (not inside the onClick handler) so the global
  // ErrorBoundary in main.tsx actually catches it - error boundaries only
  // catch errors raised while rendering, not inside event handlers.
  if (throwError) {
    throw new Error(
      'Erro de teste disparado manualmente na página /admin/tests',
    );
  }

  return (
    <PageContent>
      <Flex direction={'column'} alignItems={'center'} gap={'20px'}>
        <Heading>Página de Testes</Heading>
        <Text>Ferramentas para testar comportamentos do sistema.</Text>
        <VStack align={'stretch'} gap={'10px'}>
          <Button colorScheme={'red'} onClick={() => setThrowError(true)}>
            Disparar erro (testar página de erro)
          </Button>
        </VStack>
      </Flex>
    </PageContent>
  );
}

export default TestsPage;
