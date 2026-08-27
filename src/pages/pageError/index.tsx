import {
  Box,
  Button,
  Code,
  Collapse,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { MdErrorOutline, MdOutlineFeedback } from 'react-icons/md';
import PageContent from '../../components/common/PageContent';
import ContactUsModal, {
  ViewType,
} from '../../components/common/ContactUsModal';
import { BugReportForm } from '../../components/common/ContactUsModal/BugReportContent/bug.report.interface';
import { BugPriority, BugType } from '../../utils/enums/bugReport.enum';

const SUPPORT_EMAIL = 'uspolis@usp.br';

interface PageErrorProps {
  error?: Error;
}

function buildErrorDetails(error?: Error): string {
  return (
    `${error ? `${error.name}: ${error.message}` : 'Não disponível'}\n` +
    `Página: ${window.location.href}`
  );
}

function buildSupportMailto(error?: Error): string {
  const subject = encodeURIComponent('USPolis - Erro inesperado no sistema');
  const body = encodeURIComponent(
    `Descreva o que estava fazendo quando o erro ocorreu:\n\n\n---\n` +
      `Detalhes técnicos (não edite):\n${buildErrorDetails(error)}`,
  );
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}&su=${subject}&body=${body}`;
}

function buildBugReportPreset(error?: Error): Partial<BugReportForm> {
  return {
    type: BugType.CRASH_ERROR,
    priority: BugPriority.HIGH,
    description:
      `Descreva o que você estava fazendo quando o erro ocorreu:\n\n\n` +
      `---\nDetalhes técnicos (não edite):\n${buildErrorDetails(error)}`,
  };
}

function PageError({ error }: PageErrorProps) {
  const { isOpen, onToggle } = useDisclosure();
  const {
    isOpen: isOpenContact,
    onOpen: onOpenContact,
    onClose: onCloseContact,
  } = useDisclosure();

  return (
    <PageContent center>
      <Flex
        gap={'24px'}
        maxW={'600px'}
        direction={'column'}
        justify={'flex-start'}
        align={'center'}
        margin={'0 auto'}
        textAlign={'center'}
      >
        <MdErrorOutline size={'96px'} />
        <Heading size={'2xl'}>Ocorreu um erro inesperado</Heading>
        <Text fontSize={'lg'}>
          Algo deu errado ao carregar esta página. Tente recarregar a página e,
          se o problema persistir, entre em contato com o suporte informando o
          que você estava fazendo.
        </Text>
        <HStack>
          <Button colorScheme={'teal'} onClick={() => window.location.reload()}>
            Recarregar página
          </Button>
          <Button
            variant={'outline'}
            onClick={() => (window.location.href = '/')}
          >
            Voltar para o início
          </Button>
        </HStack>
        <Button
          leftIcon={<MdOutlineFeedback />}
          colorScheme={'blue'}
          variant={'outline'}
          onClick={onOpenContact}
        >
          Enviar feedback sobre este erro
        </Button>
        <HStack>
          <EmailIcon />
          <Link
            href={buildSupportMailto(error)}
            target='_blank'
            rel='noopener noreferrer'
          >
            {SUPPORT_EMAIL}
          </Link>
        </HStack>
        {error && (
          <Box w={'full'}>
            <Button size={'sm'} variant={'link'} onClick={onToggle}>
              {isOpen
                ? 'Ocultar detalhes técnicos'
                : 'Mostrar detalhes técnicos'}
            </Button>
            <Collapse in={isOpen}>
              <Box
                mt={'8px'}
                p={'12px'}
                borderRadius={'8px'}
                bg={'gray.100'}
                textAlign={'left'}
                overflowX={'auto'}
              >
                <Code
                  whiteSpace={'pre-wrap'}
                  background={'transparent'}
                  color={'#262626'}
                >
                  {`${error.name}: ${error.message}`}
                </Code>
              </Box>
            </Collapse>
          </Box>
        )}
      </Flex>
      <ContactUsModal
        isOpen={isOpenContact}
        onClose={onCloseContact}
        initialView={ViewType.BUG_REPORT}
        initialBugReport={buildBugReportPreset(error)}
      />
    </PageContent>
  );
}

export default PageError;
