import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Code,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Skeleton,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { LuBan, LuCheck, LuCopy, LuRotateCcw } from 'react-icons/lu';
import PageContent from '../../components/common/PageContent';
import useApiKeysService from '../../hooks/API/services/useApiKeysService';
import useUsersService from '../../hooks/API/services/useUsersService';
import useCustomToast from '../../hooks/useCustomToast';
import {
  ApiClientResponse,
  ApiKeyResponse,
} from '../../models/http/responses/apiKey.response.models';
import { ApiKeyStatus } from '../../utils/enums/apiKeyStatus.enum';
import { apiErrorMessage } from '../../utils/apiKeys/apiKeys.errors';
import {
  DEFAULT_LIMITS,
  dateInputValue,
  environmentLabel,
  expiryNote,
  formatDateTime,
  limitsLong,
} from '../../utils/apiKeys/apiKeys.formatter';
import ExpiryField from './KeyForm/expiryField';
import {
  DEFAULT_CUSTOM_RULE,
  configSchema,
  configToRequest,
  limitsSchema,
  limitsToRequest,
} from './KeyForm/keyForm.form';
import { KeyConfigForm, KeyLimitsForm } from './KeyForm/keyForm.interface';
import PrefixesField from './KeyForm/prefixesField';
import RateLimitsField from './KeyForm/rateLimitsField';
import RevokeKeyModal from './RevokeKeyModal/revokeKeyModal';
import DeliveryLinkCard from './components/deliveryLinkCard';
import { KeyStatusBadge, LimitsBadge, PrefixChips } from './components/badges';
import { Field, LoadError } from './components/states';

function configValues(key: ApiKeyResponse): KeyConfigForm {
  return {
    name: key.name,
    expires_on: dateInputValue(key.expires_at),
    prefixes: [...key.allowed_path_prefixes],
  };
}

function limitsValues(key: ApiKeyResponse): KeyLimitsForm {
  return {
    use_default_limits: key.uses_default_limits,
    rate_limits: key.uses_default_limits
      ? [DEFAULT_CUSTOM_RULE]
      : key.rate_limits.map((r) => ({ ...r })),
  };
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      direction='column'
      gap={5}
      border='1px solid'
      borderColor='uspolis.blue'
      borderRadius='lg'
      p={6}
    >
      {children}
    </Flex>
  );
}

function ApiKeyDetail() {
  const { clientId, keyId } = useParams();
  const location = useLocation() as {
    state?: { client?: ApiClientResponse; apiKey?: ApiKeyResponse };
  };
  const showToast = useCustomToast();
  const { getKeyById, getClientById, updateKey, setKeyRateLimits } =
    useApiKeysService();
  const { list: listUsers } = useUsersService();

  const [apiKey, setApiKey] = useState<ApiKeyResponse | undefined>(
    location.state?.apiKey?.id === Number(keyId)
      ? location.state.apiKey
      : undefined,
  );
  const [client, setClient] = useState<ApiClientResponse | undefined>(
    location.state?.client,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revokedByName, setRevokedByName] = useState<string>();
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingLimits, setSavingLimits] = useState(false);
  const { onCopy, hasCopied, setValue: setClipboard } = useClipboard('', 2000);

  const configForm = useForm<KeyConfigForm>({
    resolver: yupResolver(configSchema),
    defaultValues: apiKey ? configValues(apiKey) : undefined,
  });
  const limitsForm = useForm<KeyLimitsForm>({
    resolver: yupResolver(limitsSchema),
    defaultValues: apiKey ? limitsValues(apiKey) : undefined,
  });

  const applyKey = useCallback(
    (key: ApiKeyResponse) => {
      setApiKey(key);
      setClipboard(key.public_id);
      configForm.reset(configValues(key));
      limitsForm.reset(limitsValues(key));
    },
    [configForm, limitsForm, setClipboard],
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [keyResponse, clientResponse] = await Promise.all([
        getKeyById(Number(keyId)),
        getClientById(Number(clientId)),
      ]);
      applyKey(keyResponse.data);
      setClient(clientResponse.data);
    } catch (err) {
      setError(apiErrorMessage(err, 'Chave de API não encontrada.'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyId, clientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // The API only returns the revoking admin's id; resolve the name from the
  // users list, falling back to the id alone.
  const revokedById = apiKey?.revoked_by_id;
  useEffect(() => {
    if (!revokedById) return;
    listUsers()
      .then((response) =>
        setRevokedByName(response.data.find((u) => u.id === revokedById)?.name),
      )
      .catch(() => setRevokedByName(undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revokedById]);

  async function saveConfig(values: KeyConfigForm) {
    if (!apiKey) return;
    setSavingConfig(true);
    try {
      const response = await updateKey(apiKey.id, configToRequest(values));
      applyKey(response.data);
      showToast(
        'Alterações salvas',
        'A configuração da chave foi atualizada.',
        'success',
      );
    } catch (err) {
      showToast(
        'Erro ao salvar chave',
        apiErrorMessage(err, 'Não foi possível salvar as alterações.'),
        'error',
      );
    } finally {
      setSavingConfig(false);
    }
  }

  async function saveLimits(values: KeyLimitsForm) {
    if (!apiKey) return;
    setSavingLimits(true);
    try {
      const response = await setKeyRateLimits(
        apiKey.id,
        limitsToRequest(values),
      );
      setApiKey(response.data);
      limitsForm.reset(limitsValues(response.data));
      showToast(
        values.use_default_limits
          ? 'Limites padrão restaurados'
          : 'Limites atualizados',
        values.use_default_limits
          ? `A chave agora usa os limites padrão: ${limitsLong(response.data.rate_limits)}.`
          : 'Os limites personalizados estão valendo.',
        'success',
      );
    } catch (err) {
      showToast(
        'Erro ao salvar limites',
        apiErrorMessage(err, 'Não foi possível salvar os limites.'),
        'error',
      );
    } finally {
      setSavingLimits(false);
    }
  }

  if (!apiKey) {
    return (
      <PageContent>
        {loading ? (
          <Flex direction='column' gap={4}>
            <Skeleton h='40px' w='320px' />
            <Skeleton h='32px' w='420px' />
            <Skeleton h='300px' />
          </Flex>
        ) : (
          <LoadError
            title='Não foi possível carregar a chave'
            description={error}
            onRetry={fetchData}
          />
        )}
      </PageContent>
    );
  }

  const revoked = apiKey.status === ApiKeyStatus.REVOKED;
  const note = expiryNote(apiKey.expires_at);
  const defaultLimits = apiKey.uses_default_limits
    ? apiKey.rate_limits
    : DEFAULT_LIMITS;
  const {
    register,
    formState: { errors },
  } = configForm;

  return (
    <PageContent>
      <RevokeKeyModal
        apiKey={revokeOpen ? apiKey : undefined}
        onClose={() => setRevokeOpen(false)}
        onRevoked={applyKey}
      />
      <Flex direction='column' gap={5}>
        <Flex justify='space-between' align='flex-start' gap={4} wrap='wrap'>
          <Flex direction='column' gap={2} minW={0}>
            <Flex align='center' gap={3} wrap='wrap'>
              <Text fontSize='4xl' overflowWrap='anywhere'>
                {apiKey.name}
              </Text>
              <KeyStatusBadge status={apiKey.status} />
            </Flex>
            <Flex align='center' gap='6px' wrap='wrap'>
              <Code
                fontSize='15px'
                px='10px'
                py='6px'
                borderRadius='md'
                border='1px solid'
                borderColor='uspolis.border'
                wordBreak='break-all'
              >
                {apiKey.masked_key}
              </Code>
              <Button
                size='sm'
                variant='outline'
                leftIcon={hasCopied ? <LuCheck /> : <LuCopy />}
                onClick={onCopy}
              >
                {hasCopied ? 'Copiado!' : 'Copiar ID público'}
              </Button>
            </Flex>
            <Flex gap={6} wrap='wrap' fontSize='15px'>
              <Field label='Ambiente'>
                {environmentLabel(apiKey.masked_key)}
              </Field>
              <Field label='Emitida em'>
                {formatDateTime(apiKey.created_at)}
              </Field>
              <Field label='Último uso'>
                {apiKey.last_used_at
                  ? formatDateTime(apiKey.last_used_at)
                  : 'Nunca usada'}
              </Field>
            </Flex>
          </Flex>
          {!revoked && (
            <Button
              variant='outline'
              colorScheme='red'
              leftIcon={<LuBan />}
              onClick={() => setRevokeOpen(true)}
            >
              Revogar chave
            </Button>
          )}
        </Flex>

        {revoked && (
          <Alert status='error' borderRadius='md' alignItems='flex-start'>
            <AlertIcon as={LuBan} />
            <Flex direction='column' gap='6px'>
              <Text fontWeight='bold' fontSize='17px'>
                Chave revogada
              </Text>
              <Grid templateColumns='auto 1fr' gap='4px 16px'>
                <Text color='red.800'>Quando</Text>
                <Text>{formatDateTime(apiKey.revoked_at)}</Text>
                <Text color='red.800'>Por</Text>
                <Text>
                  {revokedByName
                    ? `${revokedByName} (ID ${apiKey.revoked_by_id})`
                    : `ID ${apiKey.revoked_by_id ?? '—'}`}
                </Text>
                <Text color='red.800'>Motivo</Text>
                <Text>{apiKey.revoked_reason || '—'}</Text>
              </Grid>
              <Text fontSize='sm' mt={1}>
                A revogação é permanente: esta chave não pode ser editada nem
                reativada. Para restaurar o acesso do parceiro, emita uma nova
                chave.
              </Text>
            </Flex>
          </Alert>
        )}

        {apiKey.status === ApiKeyStatus.CLIENT_INACTIVE && (
          <Alert status='warning' borderRadius='md'>
            <AlertIcon />
            <AlertDescription>
              O cliente <strong>{client?.name}</strong> está desativado, então
              esta chave está bloqueada. As alterações abaixo serão salvas e
              valerão quando o cliente for reativado.
            </AlertDescription>
          </Alert>
        )}

        {apiKey.delivery_link && (
          <DeliveryLinkCard
            link={apiKey.delivery_link}
            onInvalidated={fetchData}
          />
        )}

        {revoked ? (
          <Box maxW='880px'>
            <Card>
              <Text fontSize='xl' fontWeight='bold'>
                Configuração{' '}
                <Text
                  as='span'
                  fontWeight='normal'
                  fontSize='15px'
                  color='uspolis.textMuted'
                >
                  · somente leitura
                </Text>
              </Text>
              <Grid
                templateColumns='minmax(80px, 180px) minmax(0, 1fr)'
                gap='14px 16px'
              >
                <Text color='uspolis.textMuted'>Nome</Text>
                <Text>{apiKey.name}</Text>
                <Text color='uspolis.textMuted'>Validade</Text>
                <Text>
                  {formatDateTime(apiKey.expires_at)} (
                  {revokedExpiryNote(apiKey, note.text)})
                </Text>
                <Text color='uspolis.textMuted'>Escopo</Text>
                <PrefixChips prefixes={apiKey.allowed_path_prefixes} />
                <Text color='uspolis.textMuted'>Limites</Text>
                <Text>
                  {limitsLong(apiKey.rate_limits)}
                  {apiKey.uses_default_limits ? ' (padrão)' : ''}
                </Text>
              </Grid>
            </Card>
          </Box>
        ) : (
          <Grid
            templateColumns='repeat(auto-fit, minmax(min(100%, 420px), 1fr))'
            gap={5}
            alignItems='start'
          >
            <FormProvider {...configForm}>
              <form noValidate onSubmit={configForm.handleSubmit(saveConfig)}>
                <Card>
                  <Text fontSize='xl' fontWeight='bold'>
                    Configuração
                  </Text>
                  <FormControl isRequired isInvalid={!!errors.name}>
                    <FormLabel>Nome</FormLabel>
                    <Input {...register('name')} maxLength={256} />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                  </FormControl>
                  <ExpiryField shortcutsLabel='Estender por:' />
                  <PrefixesField />
                  <Flex justify='flex-end'>
                    <Button
                      colorScheme='blue'
                      type='submit'
                      isLoading={savingConfig}
                    >
                      Salvar alterações
                    </Button>
                  </Flex>
                </Card>
              </form>
            </FormProvider>

            <FormProvider {...limitsForm}>
              <form noValidate onSubmit={limitsForm.handleSubmit(saveLimits)}>
                <Card>
                  <Flex
                    justify='space-between'
                    align='center'
                    gap={2}
                    wrap='wrap'
                  >
                    <Text fontSize='xl' fontWeight='bold'>
                      Limites de requisição
                    </Text>
                    <LimitsBadge
                      usesDefault={apiKey.uses_default_limits}
                      prefix='Em vigor: '
                    />
                  </Flex>
                  <RateLimitsField defaults={defaultLimits} />
                  <Flex justify='flex-end' gap={2.5} wrap='wrap'>
                    <Button
                      variant='outline'
                      leftIcon={<LuRotateCcw />}
                      isDisabled={savingLimits}
                      onClick={() =>
                        saveLimits({
                          use_default_limits: true,
                          rate_limits: [],
                        })
                      }
                    >
                      Restaurar padrões
                    </Button>
                    <Button
                      colorScheme='blue'
                      type='submit'
                      isLoading={savingLimits}
                    >
                      Salvar limites
                    </Button>
                  </Flex>
                </Card>
              </form>
            </FormProvider>
          </Grid>
        )}
      </Flex>
    </PageContent>
  );
}

function revokedExpiryNote(key: ApiKeyResponse, text: string): string {
  return key.revoked_at && key.revoked_at < key.expires_at
    ? 'revogada antes do vencimento'
    : text;
}

export default ApiKeyDetail;
