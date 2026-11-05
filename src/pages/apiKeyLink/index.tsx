import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Code,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  Link,
  Spinner,
  Text,
  useClipboard,
  useColorMode,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useColorScheme } from '@mui/material';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  LuCheck,
  LuCircleAlert,
  LuCopy,
  LuEye,
  LuKeyRound,
  LuLink2Off,
} from 'react-icons/lu';
import Logo from '../../assets/uspolis.logo.png';
import useApiKeyLinksService from '../../hooks/API/services/useApiKeyLinksService';
import {
  ApiKeyLinkPublicResponse,
  ApiKeyRevealedResponse,
} from '../../models/http/responses/apiKey.response.models';
import { ApiKeyLinkStatus } from '../../utils/enums/apiKeyLinkStatus.enum';
import { formatDateTime } from '../../utils/apiKeys/apiKeys.formatter';

type PageState =
  | { kind: 'loading' }
  | { kind: 'error'; title: string; description: string; retry?: boolean }
  | { kind: 'ready'; link: ApiKeyLinkPublicResponse }
  | { kind: 'revealed'; revealed: ApiKeyRevealedResponse };

const API_BASE = (import.meta.env.VITE_USPOLIS_API_ENDPOINT ?? '').replace(
  /\/+$/,
  '',
);
const DOCS_URL = import.meta.env.VITE_USPOLIS_DOCS_URL;

function unavailableMessage(link: ApiKeyLinkPublicResponse): {
  title: string;
  description: string;
} {
  switch (link.status) {
    case ApiKeyLinkStatus.CONSUMED:
      return {
        title: 'Este link já foi aberto',
        description:
          'A chave só pode ser exibida uma vez. Se não foi você quem abriu o link, avise a equipe do USPolis imediatamente para que a chave seja revogada.',
      };
    case ApiKeyLinkStatus.EXPIRED:
      return {
        title: 'Este link expirou',
        description:
          'Por segurança, a chave foi revogada. Peça à equipe do USPolis que emita uma nova.',
      };
    case ApiKeyLinkStatus.INVALIDATED:
      return {
        title: 'Este link foi invalidado',
        description:
          'A equipe do USPolis cancelou esta entrega. Se você ainda precisa de acesso, entre em contato para receber uma nova chave.',
      };
    default:
      return {
        title: 'Esta chave não está mais ativa',
        description:
          'A chave deste link foi revogada ou o acesso do seu cliente está suspenso. Entre em contato com a equipe do USPolis.',
      };
  }
}

// Reads the token from the URL fragment, which browsers never send to any
// server (so it stays out of logs and Referer headers).
function readToken(): string {
  return window.location.hash.replace(/^#/, '').trim();
}

// Keep the token only in memory: drop it from the address bar and history
// right away, so it doesn't linger in the browser after the page is open.
function useTokenFromFragment(): string {
  const [token] = useState(readToken);
  useEffect(() => {
    if (window.location.hash)
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
  }, []);
  return token;
}

// Tell crawlers and the browser not to index or leak this page.
function usePrivatePageMeta() {
  useEffect(() => {
    const metas = [
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'referrer', content: 'no-referrer' },
    ].map(({ name, content }) => {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
      return meta;
    });
    return () => metas.forEach((meta) => meta.remove());
  }, []);
}

// Plain links (full page load), not router navigation: leaving after the key
// was revealed must still trigger the browser's "leave page?" warning.
const HOME_URL = '/index';

// Same toggle as the app's navbar: Chakra and MUI themes switch together.
function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { setMode } = useColorScheme();
  return (
    <IconButton
      aria-label='Alternar modo claro/escuro'
      title='Alternar modo claro/escuro'
      icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      variant='ghost'
      color='white'
      _hover={{ bg: 'whiteAlpha.200' }}
      onClick={() => {
        toggleColorMode();
        setMode(colorMode === 'light' ? 'dark' : 'light');
      }}
    />
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <Box minH='100vh' bg='uspolis.white'>
      <Flex
        as='header'
        h='60px'
        px={4}
        align='center'
        gap={3}
        bg='uspolis.blue'
        color='white'
        boxShadow='10px 15px 60px rgba(0,0,0,0.25)'
      >
        <Link
          href={HOME_URL}
          display='flex'
          alignItems='center'
          gap={3}
          color='white'
          px={2}
          py={1}
          borderRadius='md'
          _hover={{ textDecoration: 'none', bg: 'whiteAlpha.200' }}
        >
          <Image src={Logo} alt='' boxSize='40px' objectFit='contain' />
          <Text fontWeight='bold' fontSize='lg'>
            USPolis
          </Text>
        </Link>
        <Text opacity={0.85} display={{ base: 'none', sm: 'block' }}>
          Entrega de chave de API
        </Text>
        <Box ml='auto'>
          <ColorModeToggle />
        </Box>
      </Flex>
      <Flex justify='center' px={4} py={{ base: 6, md: 12 }}>
        <Flex
          direction='column'
          gap={5}
          w='100%'
          maxW='680px'
          border='1px solid'
          borderColor='uspolis.blue'
          borderRadius='lg'
          p={{ base: 5, md: 8 }}
          color='uspolis.black'
        >
          {children}
        </Flex>
      </Flex>
      <Flex justify='center' px={4} pb={10}>
        <Link href={HOME_URL} color='uspolis.text' fontWeight='medium'>
          Ir para o site do USPolis
        </Link>
      </Flex>
    </Box>
  );
}

function Details({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <Grid templateColumns='minmax(80px, 140px) minmax(0, 1fr)' gap='8px 16px'>
      {rows.map(([label, value]) => (
        <Box key={label} display='contents'>
          <Text color='uspolis.textMuted'>{label}</Text>
          <Box overflowWrap='anywhere'>{value}</Box>
        </Box>
      ))}
    </Grid>
  );
}

function ApiKeyLinkPage() {
  const { linkId = '' } = useParams();
  const { getStatus, reveal } = useApiKeyLinksService();
  const token = useTokenFromFragment();
  const [state, setState] = useState<PageState>({ kind: 'loading' });
  const [revealing, setRevealing] = useState(false);
  const [revealError, setRevealError] = useState('');
  const revealedKey = state.kind === 'revealed' ? state.revealed.key : '';
  const { onCopy, hasCopied } = useClipboard(revealedKey, 2500);
  const [copiedOnce, setCopiedOnce] = useState(false);

  usePrivatePageMeta();

  const loadStatus = useCallback(async () => {
    setState({ kind: 'loading' });
    try {
      const response = await getStatus(linkId);
      setState({ kind: 'ready', link: response.data });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (error as any)?.response?.status;
      setState(
        status === 404 || status === 422
          ? {
              kind: 'error',
              title: 'Link não encontrado',
              description:
                'Confira se você abriu o endereço completo, exatamente como foi enviado.',
            }
          : {
              kind: 'error',
              title: 'Não foi possível carregar o link',
              description:
                'O servidor do USPolis não respondeu. Tente novamente em alguns instantes. Abrir esta página não consome o link.',
              retry: true,
            },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkId]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // The key can't be shown again: warn before leaving until it was copied.
  useEffect(() => {
    if (state.kind !== 'revealed' || copiedOnce) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [state.kind, copiedOnce]);

  async function handleReveal() {
    setRevealing(true);
    setRevealError('');
    try {
      const response = await reveal(linkId, { token });
      setState({ kind: 'revealed', revealed: response.data });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (error as any)?.response?.status;
      if (status === 410) {
        await loadStatus();
      } else if (status === 404 || status === 422) {
        setRevealError(
          'O link está incompleto ou incorreto. Abra novamente o endereço completo que você recebeu, exatamente como foi enviado. O link continua válido.',
        );
      } else {
        setRevealError(
          'Não foi possível revelar a chave agora. Tente novamente: o link continua válido.',
        );
      }
    } finally {
      setRevealing(false);
    }
  }

  if (state.kind === 'loading') {
    return (
      <Shell>
        <Flex justify='center' py={10}>
          <Spinner size='xl' color='uspolis.blue' thickness='3px' />
        </Flex>
      </Shell>
    );
  }

  if (state.kind === 'error') {
    return (
      <Shell>
        <Flex direction='column' align='center' textAlign='center' gap={3}>
          <LuLink2Off size={48} />
          <Heading size='md'>{state.title}</Heading>
          <Text maxW='520px' lineHeight={1.5}>
            {state.description}
          </Text>
          {state.retry && (
            <Button colorScheme='blue' onClick={loadStatus}>
              Tentar novamente
            </Button>
          )}
        </Flex>
      </Shell>
    );
  }

  if (state.kind === 'revealed') {
    const { revealed } = state;
    const examplePrefix =
      revealed.allowed_path_prefixes.find((p) => p !== '/') ?? '/buildings';
    return (
      <Shell>
        <Flex direction='column' gap={1}>
          <Heading size='lg'>{revealed.key_name}</Heading>
          <Text color='uspolis.textMuted'>{revealed.client_name}</Text>
        </Flex>
        <Alert status='warning' borderRadius='md' alignItems='flex-start'>
          <AlertIcon />
          <AlertDescription lineHeight={1.5}>
            <strong>Esta é a única vez que a chave será exibida.</strong>{' '}
            Guarde-a agora em um local seguro (gerenciador de senhas ou variável
            de ambiente do servidor). Ao sair desta página, ela não poderá ser
            recuperada.
          </AlertDescription>
        </Alert>
        <Box
          p={4}
          borderRadius='md'
          bg='uspolis.surfaceSubtle'
          border='1px solid'
          borderColor='uspolis.border'
          fontFamily='mono'
          fontSize='15px'
          lineHeight={1.6}
          wordBreak='break-all'
          userSelect='all'
        >
          {revealed.key}
        </Box>
        <Button
          size='lg'
          w='100%'
          colorScheme={hasCopied ? 'green' : 'blue'}
          leftIcon={hasCopied ? <LuCheck /> : <LuCopy />}
          onClick={() => {
            onCopy();
            setCopiedOnce(true);
          }}
        >
          {hasCopied ? 'Copiado!' : 'Copiar chave'}
        </Button>
        <Details
          rows={[
            ['Válida até', formatDateTime(revealed.expires_at)],
            [
              'Rotas',
              <Flex key='prefixes' wrap='wrap' gap={1}>
                {revealed.allowed_path_prefixes.map((p) => (
                  <Code key={p}>{p === '/' ? '/ (todas)' : p}</Code>
                ))}
              </Flex>,
            ],
            ['Uso', 'Somente no seu servidor (nunca em código de navegador)'],
          ]}
        />
        <Flex direction='column' gap={2}>
          <Text fontWeight='bold'>Como usar</Text>
          <Text fontSize='sm' lineHeight={1.5}>
            Use a chave só a partir do seu servidor, no header{' '}
            <Code>X-API-Key</Code>, em requisições GET. Requisições feitas do
            navegador são recusadas, e uma chave exposta em código de front-end
            deve ser considerada vazada. Nunca coloque a chave na URL.
          </Text>
          <Box
            as='pre'
            p={3}
            borderRadius='md'
            bg='uspolis.surfaceSubtle'
            fontSize='13px'
            overflowX='auto'
          >
            {`curl -H "X-API-Key: <sua chave>" \\\n  ${API_BASE}${examplePrefix}`}
          </Box>
          {DOCS_URL && (
            <Link
              href={`${DOCS_URL}/api-keys/`}
              isExternal
              rel='noopener noreferrer'
              fontSize='sm'
              color='uspolis.blue'
              fontWeight='medium'
            >
              Guia completo: exemplos em Python e TypeScript, limites e boas
              práticas
            </Link>
          )}
        </Flex>
      </Shell>
    );
  }

  const { link } = state;
  if (!link.available) {
    const message = unavailableMessage(link);
    return (
      <Shell>
        <Flex direction='column' align='center' textAlign='center' gap={3}>
          <LuCircleAlert size={48} />
          <Heading size='md'>{message.title}</Heading>
          <Text maxW='520px' lineHeight={1.5}>
            {message.description}
          </Text>
          <Text fontSize='sm' color='uspolis.textMuted'>
            {link.key_name} · {link.client_name}
          </Text>
        </Flex>
      </Shell>
    );
  }

  return (
    <Shell>
      <Flex align='center' gap={3}>
        <LuKeyRound size={40} />
        <Flex direction='column'>
          <Heading size='lg'>Sua chave da API do USPolis</Heading>
          <Text color='uspolis.textMuted'>
            {link.key_name} · {link.client_name}
          </Text>
        </Flex>
      </Flex>
      <Text lineHeight={1.5}>
        Este link mostra a chave <strong>uma única vez</strong>. Depois de
        revelada, ela não poderá ser exibida de novo, nem por este link nem pela
        equipe do USPolis. Tenha um local seguro pronto para guardá-la antes de
        continuar.
      </Text>
      <Details rows={[['Link válido até', formatDateTime(link.expires_at)]]} />
      {!token && (
        <Alert status='error' borderRadius='md'>
          <AlertIcon />
          <AlertDescription>
            Não foi possível ler o código de acesso deste link (a página pode
            ter sido recarregada ou o endereço foi copiado pela metade). Abra
            novamente o link completo que você recebeu: ele continua válido.
          </AlertDescription>
        </Alert>
      )}
      {revealError && (
        <Alert status='error' borderRadius='md'>
          <AlertIcon />
          <AlertDescription>{revealError}</AlertDescription>
        </Alert>
      )}
      <Button
        size='lg'
        colorScheme='blue'
        leftIcon={<LuEye />}
        isLoading={revealing}
        isDisabled={!token}
        onClick={handleReveal}
      >
        Revelar chave
      </Button>
      <Text fontSize='sm' color='uspolis.textMuted'>
        Não reconhece este envio? Não revele a chave e avise a equipe do
        USPolis.
      </Text>
    </Shell>
  );
}

export default ApiKeyLinkPage;
