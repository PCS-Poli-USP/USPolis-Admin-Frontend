import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { UserResponse } from '../../../models/http/responses/user.response.models';
import moment from 'moment';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import {
  FilterBoolean,
  FilterNumber,
  FilterString,
} from '../../../utils/tanstackTableHelpers/tableFiltersFns';

interface UsersColumnsProps {
  handleEditClick: (data: UserResponse) => void;
  handleDeleteClick: (data: UserResponse) => void;
  isLoading: boolean;
}

export const getUsersColumns = (
  props: UsersColumnsProps,
): ColumnDef<UserResponse>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    filterFn: FilterNumber,
  },
  {
    filterFn: FilterString,
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    filterFn: FilterString,
    accessorKey: 'email',
    header: 'Email',
  },
  {
    filterFn: FilterString,
    accessorFn: (row) =>
      row.buildings
        ? row.buildings.length > 0
          ? row.buildings.map((b) => b.name).join(', ')
          : ''
        : '',
    header: 'Prédios',
    cell: ({ row }) => (
      <Box>
        {row.original.buildings ? (
          row.original.buildings.map((b, index) => (
            <Text key={index}>{`${b.name}`}</Text>
          ))
        ) : (
          <Text></Text>
        )}
      </Box>
    ),
  },
  {
    filterFn: FilterString,
    accessorFn: (row) =>
      row.groups.length > 0 ? row.groups.map((g) => g.name).join(', ') : '',
    header: 'Grupos',
    cell: ({ row }) => (
      <Box>
        {row.original.groups.length ? (
          row.original.groups.map((b, index) => (
            <Text key={index}>{`${b.name}`}</Text>
          ))
        ) : (
          <Text></Text>
        )}
      </Box>
    ),
  },
  {
    accessorKey: 'is_admin',
    header: 'Admin',
    meta: { isBoolean: true, isSelectable: true },
    maxSize: 120,
    filterFn: FilterBoolean,
  },
  {
    accessorKey: 'created_by',
    header: 'Criado por',
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
            isLoading={props.isLoading}
            disabled={props.isLoading}
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
            isLoading={props.isLoading}
            disabled={props.isLoading}
            onClick={() => props.handleDeleteClick(row.original)}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
