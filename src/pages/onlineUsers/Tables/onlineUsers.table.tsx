import { Box, HStack, Text } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment/min/moment-with-locales';
import 'moment/locale/pt-br';
import { OnlineConnection } from '../../../models/http/responses/onlineConnection.response.models';
import { FilterString } from '../../../utils/tanstackTableHelpers/tableFiltersFns';
import PulseDot from '../PulseDot';

moment.locale('pt-br');

export const getOnlineUsersColumns = (): ColumnDef<OnlineConnection>[] => [
  {
    id: 'user',
    accessorFn: (row) => row.name || 'Anônimo',
    filterFn: FilterString,
    header: 'Usuário',
    cell: ({ row }) => (
      <Box>
        <Text fontWeight={'bold'} color={'uspolis.black'}>
          {row.original.name || 'Anônimo'}
        </Text>
        <Text fontSize={'xs'} color={'uspolis.gray'}>
          {row.original.email || row.original.ip_address}
        </Text>
      </Box>
    ),
  },
  {
    accessorKey: 'page',
    filterFn: FilterString,
    header: 'Página atual',
    cell: ({ row }) => (
      <Text
        fontFamily={'ui-monospace, monospace'}
        fontSize={'sm'}
        color={'uspolis.gray'}
      >
        {row.original.page || '-'}
      </Text>
    ),
  },
  {
    id: 'connected_since',
    accessorFn: (row) => moment(row.connected_since).fromNow(),
    header: 'Conectado desde',
    cell: ({ row }) => (
      <Text fontSize={'sm'} color={'uspolis.gray'}>
        {moment(row.original.connected_since).fromNow()}
      </Text>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    meta: {
      isCenter: true,
    },
    cell: () => (
      <HStack
        justify={'center'}
        spacing={2}
        bg={'uspolis.lightBlue'}
        color={'uspolis.darkBlue'}
        fontSize={'xs'}
        fontWeight={'bold'}
        px={'10px'}
        py={'3px'}
        borderRadius={'12px'}
        w={'fit-content'}
      >
        <PulseDot size={'6px'} />
        <Text>AO VIVO</Text>
      </HStack>
    ),
  },
];
