import { CopyIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { appContext } from '../../../context/AppContext';
import { ClassroomResponse } from '../../../models/http/responses/classroom.response.models';
import moment from 'moment';
import { useContext } from 'react';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import {
  FilterBoolean,
  FilterNumber,
  FilterString,
} from '../../../utils/tanstackTableHelpers/tableFiltersFns';
import { AudiovisualType } from '../../../utils/enums/audiovisualType.enum';

interface ClassroomColumnsProps {
  handleDuplicateClick: (data: ClassroomResponse) => void;
  handleEditClick: (data: ClassroomResponse) => void;
  handleDeleteClick: (data: ClassroomResponse) => void;
  isLoading: boolean;
}

export function getClassroomColumns(
  props: ClassroomColumnsProps,
): ColumnDef<ClassroomResponse>[] {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loggedUser } = useContext(appContext);
  const columns: ColumnDef<ClassroomResponse>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      id: 'building',
      accessorKey: 'building',
      header: 'Prédio',
      maxSize: 100,
      meta: { isSelectable: true, isCenter: true },
    },
    {
      filterFn: FilterString,
      accessorFn: (row) => (row.groups.length > 0 ? row.groups.join(', ') : ''),
      header: 'Grupos',
      cell: ({ row }) => (
        <Box>
          {row.original.groups.length ? (
            row.original.groups.map((group, index) => (
              <Text key={index}>{`${group}`}</Text>
            ))
          ) : (
            <Text></Text>
          )}
        </Box>
      ),
    },
    {
      id: 'floor',
      accessorKey: 'floor',
      header: 'Andar',
      maxSize: 100,
      meta: { isCenter: true },
      filterFn: FilterNumber,
    },
    {
      id: 'capacity',
      accessorKey: 'capacity',
      header: 'Capacidade',
      maxSize: 100,
      meta: { isCenter: true },
      filterFn: FilterNumber,
    },

    {
      id: 'air_conditioning',
      accessorKey: 'air_conditioning',
      header: 'Ar cond.',
      maxSize: 120,
      meta: { isBoolean: true, isSelectable: true },
      filterFn: FilterBoolean,
    },
    {
      id: 'audiovisual',
      accessorKey: 'audiovisual',
      header: 'Audiovisual',
      meta: { isSelectable: true, isCenter: true },
      maxSize: 100,
      cell: ({ row }) => AudiovisualType.translate(row.original.audiovisual),
      accessorFn: (row) => AudiovisualType.translate(row.audiovisual),
    },
    {
      id: 'accessibility',
      accessorKey: 'accessibility',
      header: 'Acessibilidade',
      maxSize: 100,
      meta: { isBoolean: true, isSelectable: true, isCenter: true },
      filterFn: FilterBoolean,
    },
    {
      id: 'observation',
      accessorKey: 'observation',
      header: 'Observação',
      maxSize: 200,
      cell: ({ row }) => (
        <Box>
          <Tooltip
            label={
              row.original.observation ? row.original.observation : 'Nenhuma'
            }
          >
            <Text
              textOverflow={'ellipsis'}
              overflowX={'hidden'}
            >{`${row.original.observation ? row.original.observation : 'Nenhuma'}`}</Text>
          </Tooltip>
        </Box>
      ),
    },
    {
      accessorKey: 'updated_at',
      header: 'Atualizado em',
      filterFn: FilterString,
      meta: { isCenter: true },
      maxSize: 150,
      accessorFn: (row) =>
        moment(row.updated_at).format('DD/MM/YYYY [às] HH:mm'),
      cell: ({ row }) => (
        <Box>
          <Text>{`${moment(row.original.updated_at).format(
            'DD/MM/YYYY [às] HH:mm',
          )}`}</Text>
        </Box>
      ),
    },
    {
      id: 'options',
      header: 'Opções',
      cell: ({ row }) => (
        <HStack spacing='0px'>
          <Tooltip label='Duplicar Sala'>
            <IconButton
              colorScheme='cyan'
              size='sm'
              variant='ghost'
              aria-label='duplicar-sala'
              icon={<CopyIcon />}
              onClick={() => props.handleDuplicateClick(row.original)}
              disabled={props.isLoading}
            />
          </Tooltip>
          <Tooltip label='Editar'>
            <IconButton
              colorScheme='yellow'
              size='xs'
              variant='ghost'
              aria-label='editar-sala'
              icon={<BsFillPenFill />}
              onClick={() => props.handleEditClick(row.original)}
              disabled={props.isLoading}
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
      id: 'created_by',
      accessorKey: 'created_by',
      header: 'Usuário',
    });
  }
  return columns;
}
