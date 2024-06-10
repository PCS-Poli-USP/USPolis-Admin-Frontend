import { Box, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { InstitutionalEventResponse } from 'models/http/responses/instituionalEvent.response.models';
import moment from 'moment';
import { FaEllipsisV } from 'react-icons/fa';
import { periodFormatter } from 'utils/institutionalEvents/institutionalEvents.formatter';

interface InstitutionalEventsColumnsProps {
  onEditInstitutionalEvent: (data: InstitutionalEventResponse) => void;
  onDeleteInstittuionalEvent: (data: InstitutionalEventResponse) => void;
}


export const getInstitutionalEventsColumns = (
  props: InstitutionalEventsColumnsProps,
): ColumnDef<InstitutionalEventResponse>[] => [
  {
    accessorKey: 'created_at',
    header: 'Criado em',
    cell: ({ row }) =>
      moment(row.original.created_at).format('DD/MM/YYYY HH:mm'),
  },
  {
    accessorKey: 'title',
    header: 'Título',
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => (
      <Box maxWidth='450px'>
        <Text textOverflow='ellipsis' whiteSpace='nowrap' overflow='hidden'>
          {row.original.description}
        </Text>
      </Box>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
  },
  {
    header: 'Local',
    cell: ({ row }) =>
      row.original.building
        ? `${row.original.building} - ${row.original.classroom}`
        : row.original.location,
  },
  {
    header: 'Período',
    cell: ({ row }) => periodFormatter(row.original),
  },
  {
    id: 'options',
    cell: ({ row }) => (
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label='Options'
          icon={<Icon as={FaEllipsisV} />}
          variant='ghost'
        />
        <MenuList>
          <MenuItem
            onClick={() => props.onEditInstitutionalEvent(row.original)}
          >
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => props.onDeleteInstittuionalEvent(row.original)}
          >
            Deletar
          </MenuItem>
        </MenuList>
      </Menu>
    ),
  },
];
