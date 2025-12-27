import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { RiPassExpiredLine } from 'react-icons/ri';
import { FilterString } from '../../../utils/tanstackTableHelpers/tableFiltersFns';
import { UserSessionResponse } from '../../../models/http/responses/userSession.response.models';

import moment from 'moment/min/moment-with-locales';
import 'moment/locale/pt-br';
moment.locale('pt-br');

interface UserSessionsColumnsProps {
  handleDeleteClick: (data: UserSessionResponse) => void;
  isLoading: boolean;
}

export const getUserSessionsColumns = (
  props: UserSessionsColumnsProps,
): ColumnDef<UserSessionResponse>[] => [
  {
    filterFn: FilterString,
    accessorKey: 'user_name',
    header: 'Nome',
  },
  {
    filterFn: FilterString,
    accessorKey: 'user_email',
    header: 'Email',
  },
  {
    filterFn: FilterString,
    accessorKey: 'browser',
    header: 'Navegador',
    meta: {
      isSelectable: true,
    },
  },
  {
    filterFn: FilterString,
    accessorKey: 'os',
    header: 'Sistema Operacional',
    meta: {
      isSelectable: true,
    },
  },
  {
    filterFn: FilterString,
    accessorKey: 'device',
    header: 'Dispositivo',
    meta: {
      isSelectable: false,
    },
  },
  {
    filterFn: FilterString,
    accessorKey: 'ip_address',
    header: 'Endereço IP',
    meta: {
      isSelectable: false,
    },
  },

  //   {
  //     filterFn: FilterString,
  //     accessorFn: (row) =>
  //       row.group_names.length > 0 ? row.group_names.join(', ') : '',
  //     header: 'Grupos',
  //     cell: ({ row }) => (
  //       <Box>
  //         {row.original.group_names.length ? (
  //           row.original.group_names.map((name, index) => (
  //             <Text key={index}>{`${name}`}</Text>
  //           ))
  //         ) : (
  //           <Text></Text>
  //         )}
  //       </Box>
  //     ),
  //   },

  {
    accessorKey: 'created_at',
    header: 'Criado em',
    filterFn: FilterString,
    accessorFn: (row) => moment(row.created_at).format('DD/MM/YYYY [às] HH:mm'),
    cell: ({ row }) => (
      <Box>
        <Text>{`${moment(row.original.created_at).format(
          'DD/MM/YYYY [às] HH:mm',
        )}`}</Text>
      </Box>
    ),
  },
  {
    accessorKey: 'expired_at',
    header: 'Expira em',
    filterFn: FilterString,
    accessorFn: (row) => moment(row.expires_at).fromNow(true),
    cell: ({ row }) => (
      <Box>
        <Text>{`${moment(row.original.expires_at).fromNow(true)}`}</Text>
      </Box>
    ),
  },
  {
    id: 'options',
    header: 'Opções',
    cell: ({ row }) => (
      <HStack spacing='0px' width='fit-content'>
        <Tooltip label='Remover sessão'>
          <IconButton
            colorScheme='red'
            size='sm'
            variant='ghost'
            aria-label='editar-usuaio'
            isLoading={props.isLoading}
            disabled={props.isLoading}
            icon={<RiPassExpiredLine />}
            onClick={() => props.handleDeleteClick(row.original)}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
