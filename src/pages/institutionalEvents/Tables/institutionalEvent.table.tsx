import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { InstitutionalEventResponse } from 'models/http/responses/instituionalEvent.response.models';
import moment from 'moment';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { periodFormatter } from 'utils/institutionalEvents/institutionalEvents.formatter';

interface InstitutionalEventsColumnsProps {
  handleEditInstitutionalEvent: (data: InstitutionalEventResponse) => void;
  handleDeleteInstitutionalEvent: (data: InstitutionalEventResponse) => void;
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
    header: 'Opções',
    cell: ({ row }) => (
      <HStack spacing='0px'>
        <Tooltip label='Editar Evento'>
          <IconButton
            colorScheme='yellow'
            size='xs'
            variant='ghost'
            aria-label='editar-evento'
            icon={<BsFillPenFill />}
            onClick={() => props.handleEditInstitutionalEvent(row.original)}
          />
        </Tooltip>

        <Tooltip label='Excluir Disciplina'>
          <IconButton
            colorScheme='red'
            size='xs'
            variant='ghost'
            aria-label='excluir-turma'
            icon={<BsFillTrashFill />}
            onClick={() => props.handleDeleteInstitutionalEvent(row.original)}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
