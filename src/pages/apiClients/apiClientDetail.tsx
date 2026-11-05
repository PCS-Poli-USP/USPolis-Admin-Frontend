import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Code,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Link,
  Progress,
  Skeleton,
  Switch,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BsEyeFill, BsFillPenFill } from 'react-icons/bs';
import { LuBan, LuCopy, LuKeyRound } from 'react-icons/lu';
import PageContent from '../../components/common/PageContent';
import DataTable from '../../components/common/DataTable/dataTable.component';
import { appContext } from '../../context/AppContext';
import useApiKeysService from '../../hooks/API/services/useApiKeysService';
import useCustomToast from '../../hooks/useCustomToast';
import {
  ApiClientResponse,
  ApiKeyCreatedResponse,
  ApiKeyDeliveryLinkResponse,
  ApiKeyLinkCreatedResponse,
  ApiKeyResponse,
} from '../../models/http/responses/apiKey.response.models';
import { ApiKeyStatus } from '../../utils/enums/apiKeyStatus.enum';
import { apiErrorMessage } from '../../utils/apiKeys/apiKeys.errors';
import { formatDateTime, plural } from '../../utils/apiKeys/apiKeys.formatter';
import ApiClientModal from './ApiClientModal/apiClientModal';
import DeactivateClientDialog from './DeactivateClientDialog/deactivateClientDialog';
import DeliveryLinkModal from './DeliveryLinkModal/deliveryLinkModal';
import IssueKeyModal from './IssueKeyModal/issueKeyModal';
import OneTimeKeyModal from './OneTimeKeyModal/oneTimeKeyModal';
import RevokeKeyModal from './RevokeKeyModal/revokeKeyModal';
import {
  ExpiryCell,
  LimitsCell,
  getApiKeyColumns,
} from './Tables/apiKey.table';
import {
  ClientStatusBadge,
  DeliveryLinkNote,
  KeyStatusBadge,
  PrefixChips,
} from './components/badges';
import { EmptyState, Field, LoadError } from './components/states';

function MobileLabel({ children }: { children: string }) {
  return (
    <Text
      fontSize='11px'
      fontWeight='bold'
      letterSpacing='0.05em'
      textTransform='uppercase'
      color='uspolis.textMuted'
      mb='2px'
    >
      {children}
    </Text>
  );
}

function ApiClientDetail() {
  const { clientId } = useParams();
  const id = Number(clientId);
  const location = useLocation() as { state?: { client?: ApiClientResponse } };
  const navigate = useNavigate();
  const showToast = useCustomToast();
  const { isMobile } = useContext(appContext);
  const { getClientById, getClientKeys, setClientActive } = useApiKeysService();

  const [client, setClient] = useState<ApiClientResponse | undefined>(
    location.state?.client?.id === id ? location.state.client : undefined,
  );
  const [keys, setKeys] = useState<ApiKeyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientError, setClientError] = useState('');
  const [keysError, setKeysError] = useState('');
  const [togglingActive, setTogglingActive] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKeyResponse>();
  const [createdKey, setCreatedKey] = useState<ApiKeyCreatedResponse>();
  const [createdLink, setCreatedLink] = useState<ApiKeyLinkCreatedResponse>();

  const editModal = useDisclosure();
  const issueModal = useDisclosure();
  const deactivateDialog = useDisclosure();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setClientError('');
    setKeysError('');
    const [clientResult, keysResult] = await Promise.allSettled([
      getClientById(id),
      getClientKeys(id),
    ]);
    if (clientResult.status === 'fulfilled') setClient(clientResult.value.data);
    else
      setClientError(
        apiErrorMessage(clientResult.reason, 'Cliente de API não encontrado.'),
      );
    if (keysResult.status === 'fulfilled') setKeys(keysResult.value.data);
    else
      setKeysError(
        apiErrorMessage(
          keysResult.reason,
          `Erro ao consultar /api-clients/${id}/keys. Tente novamente.`,
        ),
      );
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedKeys = useMemo(
    () => [...keys].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [keys],
  );
  const activeCount = keys.filter(
    (k) => k.status === ApiKeyStatus.ACTIVE,
  ).length;

  function openKey(key: ApiKeyResponse) {
    navigate(`/admin/api-clients/${id}/keys/${key.id}`, {
      state: { client, apiKey: key },
    });
  }

  function copyPublicId(key: ApiKeyResponse) {
    navigator.clipboard?.writeText(key.public_id).catch(() => {});
    showToast('ID público copiado', key.public_id, 'success');
  }

  async function changeActive(isActive: boolean) {
    if (!client) return;
    setTogglingActive(true);
    try {
      const response = await setClientActive(client.id, isActive);
      setClient(response.data);
      deactivateDialog.onClose();
      showToast(
        isActive ? 'Cliente reativado' : 'Cliente desativado',
        isActive
          ? `As chaves válidas de "${client.name}" voltaram a funcionar.`
          : `Todas as chaves de "${client.name}" estão bloqueadas.`,
        'success',
      );
      // Key statuses depend on the client's state.
      const keysResponse = await getClientKeys(client.id);
      setKeys(keysResponse.data);
    } catch (err) {
      showToast(
        'Erro ao alterar situação do cliente',
        apiErrorMessage(err, 'Tente novamente.'),
        'error',
      );
    } finally {
      setTogglingActive(false);
    }
  }

  function addIssuedKey(key: ApiKeyResponse) {
    setKeys((prev) => [key, ...prev]);
    setClient((prev) =>
      prev
        ? {
            ...prev,
            total_keys: prev.total_keys + 1,
            active_keys:
              prev.active_keys + (key.status === ApiKeyStatus.ACTIVE ? 1 : 0),
          }
        : prev,
    );
  }

  function handleIssued(key: ApiKeyCreatedResponse) {
    issueModal.onClose();
    setCreatedKey(key);
    // Never keep the plaintext in the list state.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key: _plaintext, ...stored } = key;
    addIssuedKey(stored);
  }

  function handleIssuedViaLink(created: ApiKeyLinkCreatedResponse) {
    issueModal.onClose();
    setCreatedLink(created);
    addIssuedKey(created.key);
  }

  function handleLinkChange(link: ApiKeyDeliveryLinkResponse) {
    setKeys((prev) =>
      prev.map((k) =>
        k.delivery_link?.id === link.id ? { ...k, delivery_link: link } : k,
      ),
    );
  }

  function handleLinkFinish(
    created: ApiKeyLinkCreatedResponse,
    invalidated: boolean,
  ) {
    setCreatedLink(undefined);
    if (invalidated) {
      // Invalidating revoked the key: reload its status and the counters.
      fetchData();
      return;
    }
    showToast(
      'Chave emitida',
      `"${created.key.name}" será entregue pelo link, que pode ser aberto uma única vez.`,
      'success',
    );
  }

  function handleOneTimeFinish(key: ApiKeyCreatedResponse) {
    setCreatedKey(undefined);
    showToast(
      'Chave emitida',
      `"${key.name}" está ativa até ${formatDateTime(key.expires_at)}.`,
      'success',
    );
  }

  function handleRevoked(key: ApiKeyResponse) {
    setKeys((prev) => prev.map((k) => (k.id === key.id ? key : k)));
  }

  const columns = getApiKeyColumns({
    handleOpen: openKey,
    handleRevoke: setKeyToRevoke,
    handleCopy: copyPublicId,
  });

  if (!client) {
    return (
      <PageContent>
        {loading ? (
          <Flex direction='column' gap={4}>
            <Skeleton h='40px' w='360px' />
            <Skeleton h='20px' w='520px' />
            <Skeleton h='200px' />
          </Flex>
        ) : (
          <LoadError
            title='Não foi possível carregar o cliente de API'
            description={clientError}
            onRetry={fetchData}
          />
        )}
      </PageContent>
    );
  }

  const showKeysEmpty = !loading && !keysError && keys.length === 0;
  const showKeysTable = loading || (!keysError && keys.length > 0);

  return (
    <PageContent>
      <ApiClientModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        selectedClient={client}
        onSaved={(saved) => {
          setClient(saved);
          showToast(
            'Cliente atualizado',
            `As informações de "${saved.name}" foram salvas.`,
            'success',
          );
        }}
      />
      <IssueKeyModal
        isOpen={issueModal.isOpen}
        onClose={issueModal.onClose}
        client={client}
        onIssued={handleIssued}
        onIssuedViaLink={handleIssuedViaLink}
      />
      <DeliveryLinkModal
        key={createdLink?.key.id ?? 'none'}
        created={createdLink}
        client={client}
        onLinkChange={handleLinkChange}
        onFinish={handleLinkFinish}
      />
      <OneTimeKeyModal
        key={createdKey?.id ?? 'none'}
        createdKey={createdKey}
        onFinish={handleOneTimeFinish}
      />
      <RevokeKeyModal
        apiKey={keyToRevoke}
        onClose={() => setKeyToRevoke(undefined)}
        onRevoked={handleRevoked}
      />
      <DeactivateClientDialog
        isOpen={deactivateDialog.isOpen}
        onClose={deactivateDialog.onClose}
        clientName={client.name}
        activeKeys={activeCount}
        loading={togglingActive}
        onConfirm={() => changeActive(false)}
      />

      <Flex direction='column' gap={5}>
        <Flex justify='space-between' align='flex-start' gap={4} wrap='wrap'>
          <Flex direction='column' gap='6px' minW={0}>
            <Flex align='center' gap={3} wrap='wrap'>
              <Text fontSize='4xl' overflowWrap='anywhere'>
                {client.name}
              </Text>
              <ClientStatusBadge isActive={client.is_active} />
            </Flex>
            <Flex gap={6} wrap='wrap' fontSize='15px'>
              <Field label='Organização'>{client.organization || '—'}</Field>
              <Field label='Contato'>
                {client.contact_name} ·{' '}
                <Link href={`mailto:${client.contact_email}`}>
                  {client.contact_email}
                </Link>
              </Field>
              <Field label='Criado em'>
                {formatDateTime(client.created_at)}
              </Field>
            </Flex>
            {client.description && (
              <Text maxW='760px' lineHeight={1.5} color='uspolis.black'>
                {client.description}
              </Text>
            )}
          </Flex>
          <Flex align='center' gap={4}>
            <FormControl display='flex' alignItems='center' gap={2.5} w='auto'>
              <Switch
                id='client-active'
                colorScheme='blue'
                isChecked={client.is_active}
                isDisabled={togglingActive}
                onChange={() =>
                  client.is_active
                    ? deactivateDialog.onOpen()
                    : changeActive(true)
                }
              />
              <FormLabel htmlFor='client-active' mb={0} fontWeight='medium'>
                Cliente ativo
              </FormLabel>
            </FormControl>
            <Button
              variant='outline'
              leftIcon={<BsFillPenFill />}
              onClick={editModal.onOpen}
            >
              Editar
            </Button>
          </Flex>
        </Flex>

        {!client.is_active && (
          <Alert status='warning' borderRadius='md'>
            <AlertIcon />
            <AlertDescription>
              <strong>Cliente desativado.</strong> Todas as chaves deste cliente
              estão bloqueadas, mas não foram revogadas — reative o cliente para
              liberá-las novamente.
            </AlertDescription>
          </Alert>
        )}

        <Flex direction='column' gap='5px'>
          <Flex
            justify='space-between'
            align='center'
            gap={3}
            wrap='wrap'
            mb='11px'
          >
            <Flex align='baseline' gap={3}>
              <Text fontSize='2xl' fontWeight='bold'>
                Chaves de API
              </Text>
              <Text color='uspolis.textMuted'>
                {activeCount} ativas de {keys.length}
              </Text>
            </Flex>
            <Button
              colorScheme='blue'
              leftIcon={<LuKeyRound />}
              onClick={issueModal.onOpen}
            >
              Emitir chave
            </Button>
          </Flex>

          {keysError && !loading && (
            <LoadError
              title='Não foi possível carregar as chaves'
              description={keysError}
              onRetry={fetchData}
            />
          )}

          {showKeysEmpty && (
            <EmptyState
              title='Este cliente ainda não tem chaves'
              description='Emita uma chave para que o parceiro possa acessar a API. Você pode emitir várias — por exemplo, uma por ambiente — e revogá-las individualmente.'
              action={
                <Button
                  colorScheme='blue'
                  leftIcon={<LuKeyRound />}
                  onClick={issueModal.onOpen}
                >
                  Emitir primeira chave
                </Button>
              }
            />
          )}

          {showKeysTable && !isMobile && (
            <DataTable
              loading={loading}
              data={sortedKeys}
              columns={columns}
              columnPinning={{ left: ['name'], right: ['options'] }}
            />
          )}

          {showKeysTable && isMobile && (
            <Box
              border='1px solid'
              borderColor='uspolis.blue'
              borderRadius='lg'
              overflow='hidden'
            >
              {loading && <Progress size='xs' isIndeterminate />}
              {sortedKeys.map((k) => {
                const revoked = k.status === ApiKeyStatus.REVOKED;
                return (
                  <Flex
                    key={k.id}
                    p='14px 16px'
                    borderBottom='1px solid'
                    borderColor='uspolis.lightGray'
                    direction='column'
                    gap={2.5}
                    opacity={revoked ? 0.7 : 1}
                  >
                    <Flex justify='space-between' align='flex-start' gap={2}>
                      <Link
                        fontWeight='medium'
                        fontSize='17px'
                        onClick={() => openKey(k)}
                      >
                        {k.name}
                      </Link>
                      <KeyStatusBadge status={k.status} />
                    </Flex>
                    <Flex align='center' gap={1} minW={0}>
                      <Code
                        bg='transparent'
                        fontSize='12px'
                        whiteSpace='nowrap'
                        overflow='hidden'
                        textOverflow='ellipsis'
                      >
                        {k.masked_key}
                      </Code>
                      <IconButton
                        aria-label={`Copiar ID público (${k.public_id})`}
                        size='sm'
                        variant='ghost'
                        icon={<LuCopy />}
                        onClick={() => copyPublicId(k)}
                      />
                    </Flex>
                    <DeliveryLinkNote link={k.delivery_link} />
                    <PrefixChips prefixes={k.allowed_path_prefixes} />
                    <Grid
                      templateColumns='repeat(2, minmax(0, 1fr))'
                      gap='10px 16px'
                      fontSize='sm'
                    >
                      <Box>
                        <MobileLabel>Validade</MobileLabel>
                        <ExpiryCell apiKey={k} />
                      </Box>
                      <Box>
                        <MobileLabel>Limites</MobileLabel>
                        <LimitsCell apiKey={k} />
                      </Box>
                      <Box>
                        <MobileLabel>Último uso</MobileLabel>
                        <Text color='uspolis.textMuted'>
                          {k.last_used_at
                            ? formatDateTime(k.last_used_at)
                            : 'Nunca usada'}
                        </Text>
                      </Box>
                    </Grid>
                    <Flex gap={2}>
                      <Button
                        flex={1}
                        variant='outline'
                        leftIcon={revoked ? <BsEyeFill /> : <BsFillPenFill />}
                        onClick={() => openKey(k)}
                      >
                        {revoked ? 'Ver detalhes' : 'Ver / editar'}
                      </Button>
                      {!revoked && (
                        <Button
                          flex={1}
                          variant='outline'
                          colorScheme='red'
                          leftIcon={<LuBan />}
                          onClick={() => setKeyToRevoke(k)}
                        >
                          Revogar
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                );
              })}
            </Box>
          )}

          {showKeysTable && !loading && (
            <Text>
              {plural(keys.length, 'chave', 'chaves')} · mais recentes primeiro
            </Text>
          )}
        </Flex>
      </Flex>
    </PageContent>
  );
}

export default ApiClientDetail;
