import {
  Box,
  Code,
  Flex,
  HStack,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { BsEyeFill, BsFillPenFill } from 'react-icons/bs';
import { LuBan, LuCopy, LuTriangleAlert } from 'react-icons/lu';
import { ApiKeyResponse } from '../../../models/http/responses/apiKey.response.models';
import { ApiKeyStatus } from '../../../utils/enums/apiKeyStatus.enum';
import {
  expiryNote,
  formatDateTime,
  limitsShort,
} from '../../../utils/apiKeys/apiKeys.formatter';
import {
  DeliveryLinkNote,
  KeyStatusBadge,
  LimitsBadge,
  PrefixChips,
} from '../components/badges';

interface ApiKeyColumnsProps {
  handleOpen: (key: ApiKeyResponse) => void;
  handleRevoke: (key: ApiKeyResponse) => void;
  handleCopy: (key: ApiKeyResponse) => void;
}

export function ExpiryCell({ apiKey }: { apiKey: ApiKeyResponse }) {
  const note = expiryNote(apiKey.expires_at);
  return (
    <Box whiteSpace='nowrap'>
      <Text>{formatDateTime(apiKey.expires_at)}</Text>
      {apiKey.status !== ApiKeyStatus.REVOKED && (
        <Flex
          fontSize='13px'
          align='center'
          gap={1}
          color={note.warn ? 'orange.600' : 'uspolis.textMuted'}
          fontWeight={note.warn ? 'semibold' : 'normal'}
        >
          {note.warn && <LuTriangleAlert />}
          {note.text}
        </Flex>
      )}
    </Box>
  );
}

export function LimitsCell({ apiKey }: { apiKey: ApiKeyResponse }) {
  return (
    <Box whiteSpace='nowrap'>
      <LimitsBadge usesDefault={apiKey.uses_default_limits} />
      <Text fontSize='13px' color='uspolis.textMuted' mt='3px'>
        {limitsShort(apiKey.rate_limits)}
      </Text>
    </Box>
  );
}

export const getApiKeyColumns = ({
  handleOpen,
  handleRevoke,
  handleCopy,
}: ApiKeyColumnsProps): ColumnDef<ApiKeyResponse>[] => [
  {
    accessorKey: 'name',
    header: 'Nome',
    enableColumnFilter: false,
    cell: ({ row }) => (
      <Text
        as='button'
        fontWeight='medium'
        whiteSpace='nowrap'
        _hover={{ textDecoration: 'underline' }}
        onClick={() => handleOpen(row.original)}
      >
        {row.original.name}
      </Text>
    ),
  },
  {
    accessorKey: 'masked_key',
    header: 'Chave',
    enableColumnFilter: false,
    cell: ({ row }) => (
      <Flex align='center' gap={1}>
        <Code bg='transparent' fontSize='13px' whiteSpace='nowrap'>
          {row.original.masked_key}
        </Code>
        <Tooltip label={`Copiar ID público (${row.original.public_id})`}>
          <IconButton
            size='xs'
            variant='ghost'
            aria-label='copiar-id-publico'
            icon={<LuCopy />}
            onClick={() => handleCopy(row.original)}
          />
        </Tooltip>
      </Flex>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableColumnFilter: false,
    cell: ({ row }) => (
      <>
        <KeyStatusBadge status={row.original.status} />
        <DeliveryLinkNote link={row.original.delivery_link} />
      </>
    ),
  },
  {
    accessorKey: 'allowed_path_prefixes',
    header: 'Escopo',
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <PrefixChips prefixes={row.original.allowed_path_prefixes} />
    ),
  },
  {
    accessorKey: 'expires_at',
    header: 'Validade',
    enableColumnFilter: false,
    cell: ({ row }) => <ExpiryCell apiKey={row.original} />,
  },
  {
    id: 'limits',
    header: 'Limites',
    cell: ({ row }) => <LimitsCell apiKey={row.original} />,
  },
  {
    accessorKey: 'last_used_at',
    header: 'Último uso',
    enableColumnFilter: false,
    cell: ({ row }) => (
      <Text color='uspolis.textMuted' whiteSpace='nowrap'>
        {row.original.last_used_at
          ? formatDateTime(row.original.last_used_at)
          : 'Nunca usada'}
      </Text>
    ),
  },
  {
    id: 'options',
    header: 'Opções',
    cell: ({ row }) => {
      const revoked = row.original.status === ApiKeyStatus.REVOKED;
      return (
        <HStack spacing='0px'>
          <Tooltip label={revoked ? 'Ver detalhes' : 'Ver / editar'}>
            <IconButton
              colorScheme='yellow'
              size='xs'
              variant='ghost'
              aria-label='abrir-chave'
              icon={revoked ? <BsEyeFill /> : <BsFillPenFill />}
              onClick={() => handleOpen(row.original)}
            />
          </Tooltip>
          {!revoked && (
            <Tooltip label='Revogar'>
              <IconButton
                colorScheme='red'
                size='xs'
                variant='ghost'
                aria-label='revogar-chave'
                icon={<LuBan />}
                onClick={() => handleRevoke(row.original)}
              />
            </Tooltip>
          )}
        </HStack>
      );
    },
  },
];
