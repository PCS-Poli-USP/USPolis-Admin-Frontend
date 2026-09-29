import { WarningIcon } from '@chakra-ui/icons';
import {
  Box,
  Code,
  Flex,
  Heading,
  HStack,
  Image,
  Link as ChakraLink,
  ListItem,
  OrderedList,
  Text,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import ServerFilesTopicCard from './ServerFilesTopicCard';
import { serverFilesTopics } from './topics.data';
import architectureDiagram from './content/images/architecture.png';

const DOCS_URL = import.meta.env.VITE_USPOLIS_DOCS_URL;

const tocItems = [
  { id: 'arquitetura', label: 'Arquitetura' },
  { id: 'ambiente', label: 'Ambiente de desenvolvimento' },
  { id: 'arquivos', label: 'Arquivos do servidor' },
  { id: 'deploy', label: 'Deploy & CI/CD' },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <Box
      as={'pre'}
      bg={'#262626'}
      color={'#f4f4f4'}
      px={'16px'}
      py={'14px'}
      borderRadius={'6px'}
      fontFamily={'ui-monospace, monospace'}
      fontSize={'13px'}
      lineHeight={1.7}
      overflowX={'auto'}
      whiteSpace={'pre'}
      mb={'16px'}
    >
      {children}
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
  const [isMobile] = useMediaQuery('(max-width: 800px)');

  return (
    <PageContent>
      <Flex align={'flex-start'} gap={'40px'} maxW={'1180px'} mx={'auto'}>
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
              color={'uspolis.lightGray'}
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
                _hover={{ bg: 'uspolis.lightBlue', textDecoration: 'none' }}
              >
                {item.label}
              </ChakraLink>
            ))}
          </VStack>
        )}

        <Box flex={1} maxW={'860px'}>
          <Heading
            size={'lg'}
            color={'uspolis.blue'}
            textAlign={'center'}
            mb={'24px'}
          >
            Documentação do Servidor
          </Heading>

          <HStack
            align={'flex-start'}
            bg={'#FFFBEA'}
            border={'1px solid'}
            borderColor={'#dcb709'}
            borderRadius={'6px'}
            px={'16px'}
            py={'14px'}
            mb={'32px'}
            spacing={'12px'}
          >
            <WarningIcon color={'#dcb709'} mt={'2px'} />
            <Text fontSize={'14px'} lineHeight={1.5} color={'#262626'}>
              Este conteúdo descreve a infraestrutura de produção do USPolis
              (caminhos de servidor, serviços e processo de deploy). É restrito
              à equipe técnica administradora — não compartilhe fora do time.
            </Text>
          </HStack>

          <SectionHeading id={'arquitetura'}>Arquitetura</SectionHeading>
          <Text fontSize={'15px'} lineHeight={1.7} mb={'20px'}>
            O USPolis é dividido em dois sistemas principais:{' '}
            <b>USPolis Admin</b> e <b>USPolis Mobile</b>. O Admin alimenta o
            banco de dados via web scraping de dados públicos do Júpiter Web e
            do Janus Web (disciplinas e turmas); a alocação de salas é feita
            manualmente pelos gestores. Ambos os sistemas consomem os mesmos
            dados de alocação — o mobile é somente leitura, e o Admin também
            trata reservas e solicitações.
          </Text>
          <Image
            src={architectureDiagram}
            alt={'Diagrama de arquitetura do USPolis'}
            borderRadius={'8px'}
            border={'1px solid'}
            borderColor={'uspolis.lightGray'}
            maxW={'100%'}
            mb={'40px'}
          />

          <SectionHeading id={'ambiente'}>
            Ambiente de desenvolvimento
          </SectionHeading>
          <Text fontSize={'15px'} lineHeight={1.7} mb={'14px'}>
            Backend e frontend rodam localmente sobre HTTPS (necessário para
            cookies de sessão). Certificado autoassinado:
          </Text>
          <CodeBlock>
            {
              'openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes'
            }
          </CodeBlock>
          <Text fontSize={'15px'} lineHeight={1.7} mb={'40px'}>
            Coloque <InlineCode>key.pem</InlineCode> e{' '}
            <InlineCode>cert.pem</InlineCode> em uma pasta{' '}
            <InlineCode>/certs</InlineCode> em backend e frontend (mesmos
            arquivos nos dois). Variáveis sensíveis (chaves, hosts, credenciais
            de banco) ficam em <InlineCode>.env</InlineCode> /{' '}
            <InlineCode>.env.prod</InlineCode>, nunca commitadas — siga o{' '}
            <InlineCode>.env.example</InlineCode> de cada repositório.
          </Text>

          <SectionHeading id={'arquivos'}>Arquivos do servidor</SectionHeading>
          <Text fontSize={'15px'} lineHeight={1.7} mb={'20px'}>
            Árvore de diretórios com os arquivos principais da máquina de
            produção, agrupados por sistema.
          </Text>
          {serverFilesTopics.map((topic) => (
            <ServerFilesTopicCard key={topic.id} topic={topic} defaultOpen />
          ))}

          <Box mt={'40px'}>
            <SectionHeading id={'deploy'}>Deploy &amp; CI/CD</SectionHeading>
            <Text fontSize={'15px'} lineHeight={1.7} mb={'20px'}>
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
            borderColor={'uspolis.lightGray'}
            pt={'20px'}
            mt={'20px'}
            mb={'60px'}
          >
            <Text fontSize={'13px'} color={'uspolis.lightGray'}>
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
