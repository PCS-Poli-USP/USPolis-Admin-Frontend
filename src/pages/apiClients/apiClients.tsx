import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Progress,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, ChevronRightIcon, SearchIcon } from '@chakra-ui/icons';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillPenFill } from 'react-icons/bs';
import PageContent from '../../components/common/PageContent';
import DataTable from '../../components/common/DataTable/dataTable.component';
import { appContext } from '../../context/AppContext';
import useApiKeysService from '../../hooks/API/services/useApiKeysService';
import useCustomToast from '../../hooks/useCustomToast';
import { ApiClientResponse } from '../../models/http/responses/apiKey.response.models';
import { apiErrorMessage } from '../../utils/apiKeys/apiKeys.errors';
import { formatDateTime } from '../../utils/apiKeys/apiKeys.formatter';
import ApiClientModal from './ApiClientModal/apiClientModal';
import { getApiClientColumns } from './Tables/apiClient.table';
import { ClientStatusBadge } from './components/badges';
import { EmptyState, LoadError } from './components/states';

function ApiClients() {
  const navigate = useNavigate();
  const showToast = useCustomToast();
  const { isMobile } = useContext(appContext);
  const { getClients } = useApiKeysService();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [clients, setClients] = useState<ApiClientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<ApiClientResponse>();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getClients();
      setClients(response.data);
    } catch (err) {
      setError(
        apiErrorMessage(
          err,
          'O servidor não respondeu. Verifique o Status da API e tente novamente.',
        ),
      );
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => c.name.toLowerCase().includes(q));
  }, [clients, search]);

  function openClient(client: ApiClientResponse) {
    navigate(`/admin/api-clients/${client.id}`, { state: { client } });
  }

  function handleNew() {
    setSelectedClient(undefined);
    onOpen();
  }

  function handleEdit(client: ApiClientResponse) {
    setSelectedClient(client);
    onOpen();
  }

  function handleSaved(client: ApiClientResponse, created: boolean) {
    if (created) {
      showToast(
        'Cliente cadastrado',
        `"${client.name}" foi criado. Agora emita a primeira chave.`,
        'success',
      );
      openClient(client);
      return;
    }
    showToast(
      'Cliente atualizado',
      `As informações de "${client.name}" foram salvas.`,
      'success',
    );
    setClients((prev) => prev.map((c) => (c.id === client.id ? client : c)));
  }

  const columns = getApiClientColumns({
    handleOpen: openClient,
    handleEdit,
  });

  const showEmpty = !loading && !error && clients.length === 0;
  const showTable = loading || (!error && clients.length > 0);
  const noResults = !loading && clients.length > 0 && filtered.length === 0;

  return (
    <PageContent>
      <ApiClientModal
        isOpen={isOpen}
        onClose={onClose}
        selectedClient={selectedClient}
        onSaved={handleSaved}
      />
      <Flex direction='column' gap='5px'>
        <Flex justify='space-between' align='center' gap={3} wrap='wrap' mb={4}>
          <Text fontSize='4xl'>Clientes de API</Text>
          <Flex
            gap={2.5}
            align='center'
            wrap='wrap'
            flex='1 1 320px'
            justify='flex-end'
          >
            <InputGroup flex='1 1 200px' maxW='360px'>
              <InputLeftElement pointerEvents='none'>
                <SearchIcon />
              </InputLeftElement>
              <Input
                placeholder='Buscar por nome'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
            <Button
              colorScheme='blue'
              leftIcon={<AddIcon />}
              onClick={handleNew}
            >
              Novo cliente
            </Button>
          </Flex>
        </Flex>

        {error && !loading && (
          <LoadError
            title='Não foi possível carregar os clientes de API'
            description={error}
            onRetry={fetchClients}
          />
        )}

        {showEmpty && (
          <Flex justify='center' align='center'>
            <EmptyState
              big
              title='Nenhum cliente de API cadastrado'
              description='Um cliente de API é uma organização parceira que consome os dados públicos de alocações do USPolis. Ele não é um usuário do sistema: recebe uma ou mais API keys, que você pode revogar ou bloquear a qualquer momento.'
              action={
                <Button
                  colorScheme='blue'
                  leftIcon={<AddIcon />}
                  onClick={handleNew}
                >
                  Cadastrar primeiro cliente
                </Button>
              }
            />
          </Flex>
        )}

        {showTable && !isMobile && (
          <DataTable
            loading={loading}
            data={filtered}
            columns={columns}
            columnPinning={{ left: ['name'], right: ['options'] }}
          />
        )}

        {showTable && isMobile && (
          <Box
            border='1px solid'
            borderColor='uspolis.blue'
            borderRadius='lg'
            overflow='hidden'
          >
            {loading && <Progress size='xs' isIndeterminate />}
            {filtered.map((c) => (
              <Flex
                key={c.id}
                p='14px 8px 14px 16px'
                borderBottom='1px solid'
                borderColor='uspolis.lightGray'
                gap={2}
                align='center'
                cursor='pointer'
                _active={{ bg: 'uspolis.hover' }}
                onClick={() => openClient(c)}
              >
                <Flex flex={1} minW={0} direction='column' gap={1}>
                  <Flex align='center' gap={2} wrap='wrap'>
                    <Text fontWeight='medium' fontSize='17px'>
                      {c.name}
                    </Text>
                    <ClientStatusBadge isActive={c.is_active} />
                  </Flex>
                  <Text fontSize='sm' color='uspolis.black'>
                    {c.organization || '—'}
                  </Text>
                  <Text fontSize='sm' overflowWrap='anywhere'>
                    {c.contact_name} ·{' '}
                    <Text as='span' color='uspolis.textMuted'>
                      {c.contact_email}
                    </Text>
                  </Text>
                  <Flex
                    gap='4px 16px'
                    fontSize='13px'
                    color='uspolis.textMuted'
                    wrap='wrap'
                  >
                    <Text>
                      <Text as='strong' color='uspolis.text'>
                        {c.active_keys}
                      </Text>{' '}
                      / {c.total_keys} chaves ativas
                    </Text>
                    <Text>Criado em {formatDateTime(c.created_at)}</Text>
                  </Flex>
                </Flex>
                <IconButton
                  aria-label='Editar'
                  title='Editar'
                  variant='ghost'
                  colorScheme='yellow'
                  icon={<BsFillPenFill />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(c);
                  }}
                />
                <ChevronRightIcon boxSize={5} />
              </Flex>
            ))}
          </Box>
        )}

        {noResults && (
          <Text textAlign='center' color='uspolis.textMuted' py={8}>
            Nenhum cliente encontrado para “{search}”.
          </Text>
        )}
      </Flex>
    </PageContent>
  );
}

export default ApiClients;
