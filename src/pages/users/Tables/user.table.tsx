import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { UserResponse } from 'models/http/responses/user.response.models';
import moment from 'moment';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import {
  FilterBoolean,
  FilterString,
} from 'utils/tanstackTableHelpers/tableFiltersFns';

interface UsersColumnsProps {
  handleEditClick: (data: UserResponse) => void;
  handleDeleteClick: (data: UserResponse) => void;
}

export const getUsersColumns = (
  props: UsersColumnsProps,
): ColumnDef<UserResponse>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'is_admin',
    header: 'Admin',
    meta: { isBoolean: true },
    filterFn: FilterBoolean,
  },
  {
    accessorKey: 'updated_at',
    header: 'Atualizado em',
    filterFn: FilterString,
    accessorFn: (row) => moment(row.updated_at).format('DD/MM/YYYY [às] HH:mm'),
    cell: ({ row }) => (
      <Box>
        <Text>{`${moment(row.original.updated_at).format(
          'DD/MM/YYYY [às] HH:mm',
        )}`}</Text>
      </Box>
    ),
  },
  {
    accessorKey: 'last_visited',
    header: 'último acesso',
    filterFn: FilterString,
    accessorFn: (row) =>
      moment(row.last_visited).format('DD/MM/YYYY [às] HH:mm'),
    cell: ({ row }) => (
      <Box>
        <Text>{`${moment(row.original.last_visited).format(
          'DD/MM/YYYY [às] HH:mm',
        )}`}</Text>
      </Box>
    ),
  },
  {
    accessorKey: 'created_by',
    header: 'Criado por',
  },
  {
    accessorFn: (row) => row.buildings?.map((b) => b.name).join(', '),
    header: 'Prédios',
    meta: {
      isSelectable: true,
    },
  },
  {
    id: 'options',
    header: 'Opções',
    cell: ({ row }) => (
      <HStack spacing='0px' width='fit-content'>
        <Tooltip label='Editar'>
          <IconButton
            colorScheme='yellow'
            size='xs'
            variant='ghost'
            aria-label='editar-usuaio'
            icon={<BsFillPenFill />}
            onClick={() => props.handleEditClick(row.original)}
          />
        </Tooltip>

        <Tooltip label='Deletar'>
          <IconButton
            colorScheme='red'
            size='xs'
            variant='ghost'
            aria-label='deletar-usuario'
            icon={<BsFillTrashFill />}
            onClick={() => props.handleDeleteClick(row.original)}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
