import { HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { BsEyeFill, BsFillPenFill } from 'react-icons/bs';
import { ApiClientResponse } from '../../../models/http/responses/apiKey.response.models';
import { formatDateTime } from '../../../utils/apiKeys/apiKeys.formatter';
import { ClientStatusBadge } from '../components/badges';

interface ApiClientColumnsProps {
  handleOpen: (client: ApiClientResponse) => void;
  handleEdit: (client: ApiClientResponse) => void;
}

export const getApiClientColumns = ({
  handleOpen,
  handleEdit,
}: ApiClientColumnsProps): ColumnDef<ApiClientResponse>[] => [
  {
    accessorKey: 'name',
    header: 'Nome',
    enableColumnFilter: false,
    cell: ({ row }) => (
      <Text
        as='button'
        fontWeight='medium'
        textAlign='left'
        _hover={{ textDecoration: 'underline' }}
        onClick={() => handleOpen(row.original)}
      >
        {row.original.name}
      </Text>
    ),
  },
  {
    accessorKey: 'organization',
    header: 'Organização',
    enableColumnFilter: false,
    cell: ({ row }) => row.original.organization || '—',
  },
  {
    accessorKey: 'contact_name',
    header: 'Contato',
    enableColumnFilter: false,
    cell: ({ row }) => (
      <>
        <Text>{row.original.contact_name}</Text>
        <Text fontSize='sm' color='uspolis.textMuted'>
          {row.original.contact_email}
        </Text>
      </>
    ),
  },
  {
    accessorKey: 'is_active',
    header: 'Situação',
    enableColumnFilter: false,
    cell: ({ row }) => <ClientStatusBadge isActive={row.original.is_active} />,
  },
  {
    accessorKey: 'active_keys',
    header: 'Chaves ativas / total',
    enableColumnFilter: false,
    meta: { isNumeric: true },
    cell: ({ row }) => (
      <Text whiteSpace='nowrap'>
        <strong>{row.original.active_keys}</strong> / {row.original.total_keys}
      </Text>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Criado em',
    enableColumnFilter: false,
    cell: ({ row }) => formatDateTime(row.original.created_at),
  },
  {
    id: 'options',
    header: 'Opções',
    cell: ({ row }) => (
      <HStack spacing='0px'>
        <Tooltip label='Ver detalhes'>
          <IconButton
            colorScheme='blue'
            size='xs'
            variant='ghost'
            aria-label='ver-cliente'
            icon={<BsEyeFill />}
            onClick={() => handleOpen(row.original)}
          />
        </Tooltip>
        <Tooltip label='Editar'>
          <IconButton
            colorScheme='yellow'
            size='xs'
            variant='ghost'
            aria-label='editar-cliente'
            icon={<BsFillPenFill />}
            onClick={() => handleEdit(row.original)}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
