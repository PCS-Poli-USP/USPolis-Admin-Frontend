import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import PageContent from '../../components/common/PageContent';
import useDevService from '../../hooks/API/services/useDevService';
import { ErrorParser } from '../../hooks/errorParser';
import useCustomToast from '../../hooks/useCustomToast';

function TestsPage() {
  const [throwError, setThrowError] = useState(false);
  const [triggeringBackendError, setTriggeringBackendError] = useState(false);
  const devService = useDevService();
  const showToast = useCustomToast();
  const parser = useMemo(() => new ErrorParser('Requisição de teste'), []);

  async function handleTriggerBackendError() {
    setTriggeringBackendError(true);
    try {
      await devService.raiseUncaughtError();
    } catch (error) {
      showToast('Erro', parser.parseGetError(error), 'error');
    } finally {
      setTriggeringBackendError(false);
    }
  }

  // Thrown during render (not inside the onClick handler) so the
  // ErrorBoundary around <Outlet /> in EmptyPage actually catches it -
  // error boundaries only catch errors raised while rendering, not inside
  // event handlers. Since that boundary sits inside the layout, the
  // header/sidebar stay visible and only this page's content is replaced.
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
          <Button
            colorScheme={'red'}
            variant={'outline'}
            isLoading={triggeringBackendError}
            onClick={handleTriggerBackendError}
          >
            Disparar erro 500 no backend (testar tratamento de erro da API)
          </Button>
        </VStack>
      </Flex>
    </PageContent>
  );
}

export default TestsPage;
