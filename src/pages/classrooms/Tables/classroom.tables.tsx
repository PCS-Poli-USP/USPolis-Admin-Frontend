import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { appContext } from 'context/AppContext';
import { ClassroomResponse } from 'models/http/responses/classroom.response.models';
import moment from 'moment';
import { useContext } from 'react';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import {
  FilterBoolean,
  FilterNumber,
} from 'utils/tanstackTableHelpers/tableFiltersFns';

interface ClassroomColumnsProps {
  handleEditClick: (data: ClassroomResponse) => void;
  handleDeleteClick: (data: ClassroomResponse) => void;
}

export function getClassroomColumns(
  props: ClassroomColumnsProps,
): ColumnDef<ClassroomResponse>[] {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loggedUser } = useContext(appContext);
  const columns: ColumnDef<ClassroomResponse>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'building',
      header: 'Prédio',
      meta: { isSelectable: true },
    },
    {
      accessorKey: 'floor',
      header: 'Andar',
      meta: { isSelectable: true },
      filterFn: FilterNumber,
    },
    {
      accessorKey: 'capacity',
      header: 'Capacidade',
      meta: { isSelectable: true },
      filterFn: FilterNumber,
    },
    {
      accessorKey: 'ignore_to_allocate',
      header: 'Ignorar',
      meta: { isBoolean: true, isSelectable: true },
      filterFn: FilterBoolean,
    },
    {
      accessorKey: 'air_conditioning',
      header: 'Ar condicionado',
      meta: { isBoolean: true, isSelectable: true },
      filterFn: FilterBoolean,
    },
    {
      accessorKey: 'projector',
      header: 'Projetor',
      meta: { isBoolean: true, isSelectable: true },
      filterFn: FilterBoolean,
    },
    {
      accessorKey: 'accessibility',
      header: 'Acessibilidade',
      meta: { isBoolean: true, isSelectable: true },
      filterFn: FilterBoolean,
    },
    {
      accessorKey: 'updated_at',
      header: 'Atualizado em',
      cell: ({ row }) => (
        <Box>
          <Text>
            {moment(row.original.updated_at).format('DD/MM/YYYY HH:mm')}
          </Text>
        </Box>
      ),
    },
    {
      id: 'options',
      header: 'Opções',
      cell: ({ row }) => (
        <HStack spacing='0px'>
          <Tooltip label='Editar'>
            <IconButton
              colorScheme='yellow'
              size='xs'
              variant='ghost'
              aria-label='editar-sala'
              icon={<BsFillPenFill />}
              onClick={() => props.handleEditClick(row.original)}
            />
          </Tooltip>

          <Tooltip label='Remover'>
            <IconButton
              colorScheme='red'
              size='xs'
              variant='ghost'
              aria-label='remover-sala'
              icon={<BsFillTrashFill />}
              onClick={() => props.handleDeleteClick(row.original)}
            />
          </Tooltip>
        </HStack>
      ),
    },
  ];
  if (loggedUser && loggedUser.is_admin) {
    columns.unshift({
      accessorKey: 'created_by',
      header: 'Usuário',
    });
  }
  return columns;
}
