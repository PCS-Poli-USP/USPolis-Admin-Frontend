import { CheckIcon, CopyIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Code,
  Flex,
  Heading,
  HStack,
  Image,
  Link as ChakraLink,
  ListItem,
  OrderedList,
  Text,
  useColorModeValue,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import ServerFilesTopicCard from './ServerFilesTopicCard';
import { serverFilesTopics } from './topics.data';
import architectureDiagram from './content/images/architecture.png';
import { useCodeSurfaceBg } from './codeSurface';
import { useCopyToClipboard } from './useCopyToClipboard';

const DOCS_URL = import.meta.env.VITE_USPOLIS_DOCS_URL;

const tocItems = [
  { id: 'arquitetura', label: 'Arquitetura' },
  { id: 'ambiente', label: 'Ambiente de desenvolvimento' },
  { id: 'arquivos', label: 'Arquivos do servidor' },
  { id: 'deploy', label: 'Deploy & CI/CD' },
];

// Commands scroll sideways on a phone; the copy button saves selecting them
// by hand. It sits in a header strip above the code, so it never covers a
// line, however the code is scrolled.
function CodeBlock({ children }: { children: string }) {
  const [isMobile] = useMediaQuery('(max-width: 800px)', { ssr: false });
  const { copied, copy } = useCopyToClipboard();
  return (
    <Box
      bg={useCodeSurfaceBg()}
      border={'1px solid'}
      borderColor={'uspolis.border'}
      borderRadius={'6px'}
      overflow={'hidden'}
      mb={'16px'}
    >
      <Flex
        justify={'space-between'}
        align={'center'}
        pl={isMobile ? '12px' : '16px'}
        pr={'4px'}
        borderBottom={'1px solid'}
        borderColor={'whiteAlpha.200'}
      >
        <Text
          fontSize={'11px'}
          fontFamily={'ui-monospace, monospace'}
          color={'#a8a8a8'}
          letterSpacing={'0.04em'}
        >
          bash
        </Text>
        <Button
          size={'sm'}
          h={'36px'}
          variant={'ghost'}
          leftIcon={copied ? <CheckIcon /> : <CopyIcon />}
          onClick={() => copy(children)}
          color={copied ? '#5FD39F' : '#c9c9c9'}
          fontWeight={'normal'}
          fontSize={'12px'}
          _hover={{ bg: 'whiteAlpha.200', color: '#ffffff' }}
          _active={{ bg: 'whiteAlpha.300' }}
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
      </Flex>
      <Box
        as={'pre'}
        color={'#f4f4f4'}
        px={isMobile ? '12px' : '16px'}
        py={isMobile ? '12px' : '14px'}
        fontFamily={'ui-monospace, monospace'}
        fontSize={isMobile ? '12px' : '13px'}
        lineHeight={1.7}
        overflowX={'auto'}
        whiteSpace={'pre'}
      >
        {children}
      </Box>
    </Box>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <Code fontFamily={'ui-monospace, monospace'} fontSize={'0.9em'}>
      {children}
    </Code>
  );
}

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <Heading
      id={id}
      size={'md'}
      borderBottom={'2px solid'}
      borderColor={'uspolis.blue'}
      pb={'8px'}
      mb={'16px'}
      scrollMarginTop={'90px'}
    >
      {children}
    </Heading>
  );
}

function ServerDocs() {
  const [isMobile] = useMediaQuery('(max-width: 800px)', { ssr: false });
  const warningBg = useColorModeValue('#FFFBEA', 'rgba(246, 209, 35, 0.12)');
  const textSize = isMobile ? '14px' : '15px';

  return (
    <PageContent>
      <Flex
        align={'flex-start'}
        gap={'40px'}
        maxW={'1180px'}
        mx={'auto'}
        // With PageContent's 8px, a 16px side gutter on phones.
        px={isMobile ? '8px' : 0}
        // The layout above (EmptyPage) is a flex item with min-width: auto, so
        // it grows to this page's widest content: the chip row, the openssl
        // line, the directory trees. Containment keeps that width from leaking
        // up, so those blocks scroll on their own instead of the whole page.
        sx={{ contain: 'inline-size' }}
      >
        {!isMobile && (
          <VStack
            as={'nav'}
            align={'stretch'}
            spacing={'2px'}
            w={'220px'}
            flexShrink={0}
            position={'sticky'}
            top={'70px'}
          >
            <Text
              fontSize={'11px'}
              fontWeight={'bold'}
              letterSpacing={'0.06em'}
              color={'uspolis.textMuted'}
              textTransform={'uppercase'}
              px={'10px'}
              mb={'6px'}
            >
              Documentação do Servidor
            </Text>
            {tocItems.map((item) => (
              <ChakraLink
                key={item.id}
                href={`#${item.id}`}
                px={'10px'}
                py={'8px'}
                borderRadius={'4px'}
                fontSize={'16px'}
                color={'uspolis.black'}
                _hover={{ bg: 'uspolis.hover', textDecoration: 'none' }}
              >
                {item.label}
              </ChakraLink>
            ))}
          </VStack>
        )}

        <Box flex={1} minW={0} maxW={'860px'}>
          <Heading
            size={isMobile ? 'md' : 'lg'}
            color={'uspolis.text'}
            textAlign={'center'}
            mb={isMobile ? '16px' : '24px'}
          >
            Documentação do Servidor
          </Heading>

          {isMobile && (
            // Wraps instead of scrolling sideways, so all four sections are
            // visible at 360px.
            <Flex
              as={'nav'}
              aria-label={'Seções da página'}
              wrap={'wrap'}
              gap={'8px'}
              mb={'16px'}
            >
              {tocItems.map((item) => (
                <ChakraLink
                  key={item.id}
                  href={`#${item.id}`}
                  display={'inline-flex'}
                  alignItems={'center'}
                  minH={'36px'}
                  px={'12px'}
                  py={'6px'}
                  border={'1px solid'}
                  borderColor={'uspolis.border'}
                  borderRadius={'full'}
                  fontSize={'13px'}
                  fontWeight={'medium'}
                  color={'uspolis.black'}
                  whiteSpace={'nowrap'}
                  _hover={{ bg: 'uspolis.hover', textDecoration: 'none' }}
                >
                  {item.label}
                </ChakraLink>
              ))}
            </Flex>
          )}

          <HStack
            align={'flex-start'}
            bg={warningBg}
            border={'1px solid'}
            borderColor={'uspolis.yellow'}
            borderRadius={'6px'}
            px={isMobile ? '12px' : '16px'}
            py={isMobile ? '12px' : '14px'}
            mb={isMobile ? '24px' : '32px'}
            spacing={'12px'}
          >
            <WarningIcon color={'uspolis.yellow'} mt={'2px'} flexShrink={0} />
            <Text
              fontSize={isMobile ? '13px' : '14px'}
              lineHeight={1.5}
              color={'uspolis.black'}
            >
              Este conteúdo descreve a infraestrutura de produção do USPolis
              (caminhos de servidor, serviços e processo de deploy). É restrito
              à equipe técnica administradora — não compartilhe fora do time.
            </Text>
          </HStack>

          <SectionHeading id={'arquitetura'}>Arquitetura</SectionHeading>
          <Text fontSize={textSize} lineHeight={1.7} mb={'20px'}>
            O USPolis é dividido em dois sistemas principais:{' '}
            <b>USPolis Admin</b> e <b>USPolis Mobile</b>. O Admin alimenta o
            banco de dados via web scraping de dados públicos do Júpiter Web e
            do Janus Web (disciplinas e turmas); a alocação de salas é feita
            manualmente pelos gestores. Ambos os sistemas consomem os mesmos
            dados de alocação — o mobile é somente leitura, e o Admin também
            trata reservas e solicitações.
          </Text>
          {/* The diagram is wide: at 360px its labels are too small to read,
              so on a phone it opens full size in a new tab. */}
          <Box
            as={isMobile ? 'a' : 'div'}
            display={'block'}
            mb={'40px'}
            {...(isMobile && {
              href: architectureDiagram,
              target: '_blank',
              rel: 'noopener noreferrer',
              'aria-label':
                'Diagrama de arquitetura do USPolis (abre em tamanho real em nova aba)',
            })}
          >
            <Image
              src={architectureDiagram}
              alt={'Diagrama de arquitetura do USPolis'}
              borderRadius={'8px'}
              border={'1px solid'}
              borderColor={'uspolis.border'}
              maxW={'100%'}
            />
            {isMobile && (
              <Text
                mt={'6px'}
                fontSize={'12px'}
                color={'uspolis.textMuted'}
                textAlign={'center'}
              >
                Toque para ampliar
              </Text>
            )}
          </Box>

          <SectionHeading id={'ambiente'}>
            Ambiente de desenvolvimento
          </SectionHeading>
          <Text fontSize={textSize} lineHeight={1.7} mb={'14px'}>
            Backend e frontend rodam localmente sobre HTTPS (necessário para
            cookies de sessão). Certificado autoassinado:
          </Text>
          <CodeBlock>
            {
              'openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes'
            }
          </CodeBlock>
          <Text fontSize={textSize} lineHeight={1.7} mb={'40px'}>
            Coloque <InlineCode>key.pem</InlineCode> e{' '}
            <InlineCode>cert.pem</InlineCode> em uma pasta{' '}
            <InlineCode>/certs</InlineCode> em backend e frontend (mesmos
            arquivos nos dois). Variáveis sensíveis (chaves, hosts, credenciais
            de banco) ficam em <InlineCode>.env</InlineCode> /{' '}
            <InlineCode>.env.prod</InlineCode>, nunca commitadas — siga o{' '}
            <InlineCode>.env.example</InlineCode> de cada repositório.
          </Text>

          <SectionHeading id={'arquivos'}>Arquivos do servidor</SectionHeading>
          <Text fontSize={textSize} lineHeight={1.7} mb={'20px'}>
            Árvore de diretórios com os arquivos principais da máquina de
            produção, agrupados por sistema.
          </Text>
          {serverFilesTopics.map((topic) => (
            <ServerFilesTopicCard
              key={topic.id}
              topic={topic}
              defaultOpen={!isMobile}
            />
          ))}

          <Box mt={'40px'}>
            <SectionHeading id={'deploy'}>Deploy &amp; CI/CD</SectionHeading>
            <Text fontSize={textSize} lineHeight={1.7} mb={'20px'}>
              CI/CD via GitHub Actions, configurado em{' '}
              <InlineCode>.github/workflows/ci_cd.yml</InlineCode> em cada
              repositório. Segredos (host SSH, credenciais) ficam em{' '}
              <i>Settings → Secrets and variables</i> do GitHub — nunca em texto
              plano no workflow.
            </Text>

            <Flex
              gap={'24px'}
              direction={isMobile ? 'column' : 'row'}
              mb={'20px'}
            >
              <Box flex={1}>
                <Text fontWeight={'bold'} fontSize={'14px'} mb={'8px'}>
                  Backend — jobs
                </Text>
                <OrderedList fontSize={'14px'} lineHeight={1.8} spacing={0}>
                  <ListItem>
                    <b>ci</b>: checkout + setup Python 3.12
                  </ListItem>
                  <ListItem>
                    <b>cd</b>: SSH no servidor → git pull main → reinicia
                    serviço
                  </ListItem>
                </OrderedList>
              </Box>
              <Box flex={1}>
                <Text fontWeight={'bold'} fontSize={'14px'} mb={'8px'}>
                  Frontend — job deploy
                </Text>
                <OrderedList fontSize={'14px'} lineHeight={1.8} spacing={0}>
                  <ListItem>
                    Build da docs (VitePress) → move para{' '}
                    <InlineCode>public/docs</InlineCode>
                  </ListItem>
                  <ListItem>Build do frontend (Vite) com envs</ListItem>
                  <ListItem>
                    Envia arquivos ao servidor, reinicia serviço
                  </ListItem>
                </OrderedList>
              </Box>
            </Flex>

            <Text fontWeight={'bold'} fontSize={'14px'} mb={'8px'}>
              Deploy manual — comandos finais
            </Text>
            <CodeBlock>
              {
                'sudo systemctl restart uspolis-backend.service\nsudo systemctl restart uspolis-frontend.service'
              }
            </CodeBlock>
          </Box>

          <Box
            borderTop={'1px solid'}
            borderColor={'uspolis.border'}
            pt={'20px'}
            mt={'20px'}
            mb={'60px'}
          >
            <Text fontSize={'13px'} color={'uspolis.textMuted'}>
              Esta página substitui a antiga seção pública de documentação
              técnica (VitePress → <InlineCode>docs/dev/server</InlineCode>).{' '}
              <ChakraLink
                href={`${DOCS_URL}/dev`}
                rel={'noopener noreferrer'}
                target={'_blank'}
                color={'uspolis.blue'}
              >
                Ver o restante da documentação pública para desenvolvedores →
              </ChakraLink>
            </Text>
          </Box>
        </Box>
      </Flex>
    </PageContent>
  );
}

export default ServerDocs;
