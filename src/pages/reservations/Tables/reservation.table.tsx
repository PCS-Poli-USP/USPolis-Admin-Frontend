import { CopyIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { ReservationResponse } from '../../../models/http/responses/reservation.response.models';
import moment from 'moment';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { ReservationType } from '../../../utils/enums/reservations.enum';
import { getScheduleString } from '../../../utils/schedules/schedule.formatter';
import {
  FilterRequester,
  FilterString,
} from '../../../utils/tanstackTableHelpers/tableFiltersFns';
import { SortPeriodFn } from '../../../utils/tanstackTableHelpers/tableSortingFns';
import { LuEye } from 'react-icons/lu';

interface ReservationsColumnsProps {
  handleViewClick: (data: ReservationResponse) => void;
  handleDuplicateClick: (data: ReservationResponse) => void;
  handleEditClick: (data: ReservationResponse) => void;
  handleDeleteClick: (data: ReservationResponse) => void;
}

export const getReservationsColumns = (
  props: ReservationsColumnsProps,
): ColumnDef<ReservationResponse>[] => [
  {
    accessorKey: 'building_name',
    header: 'Prédio',
    meta: {
      isSelectable: true,
    },
  },
  {
    accessorKey: 'classroom_name',
    header: 'Sala',
  },
  {
    accessorKey: 'requester',
    filterFn: FilterRequester,
    header: 'Solicitante',
    maxSize: 250,
    cell: ({ row }) => (
      <Box>
        <Tooltip
          label={
            <Text>
              {row.original.requester
                ? row.original.requester
                : row.original.created_by + 'C'}
            </Text>
          }
        >
          <Text maxW={300} overflowX={'hidden'} textOverflow={'ellipsis'}>
            {row.original.requester
              ? row.original.requester
              : row.original.created_by}
          </Text>
        </Tooltip>
      </Box>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Título',
    maxSize: 250,
    cell: ({ row }) => (
      <Box>
        <Tooltip label={<Text>{row.original.title}</Text>}>
          <Text maxW={300} overflowX={'hidden'} textOverflow={'ellipsis'}>
            {row.original.title}
          </Text>
        </Tooltip>
      </Box>
    ),
  },
  {
    accessorFn: (row) => ReservationType.translate(row.type),
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => (
      <Box>
        <Text>{ReservationType.translate(row.original.type)}</Text>
      </Box>
    ),
  },
  {
    accessorKey: 'recurrence',
    header: 'Recorrência',
    cell: ({ row }) => (
      <Box>
        <Text>{getScheduleString(row.original.schedule)}</Text>
      </Box>
    ),
  },
  {
    accessorKey: 'time',
    header: 'Horário',
    cell: ({ row }) => (
      <Box>
        <Text>{`${row.original.schedule.start_time.substring(
          0,
          5,
        )} ~ ${row.original.schedule.end_time.substring(0, 5)}`}</Text>
      </Box>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Período',
    filterFn: FilterString,
    sortingFn: SortPeriodFn,
    accessorFn: (row) =>
      `${moment(row.schedule.start_date).format('DD/MM/YYYY')} até ${moment(
        row.schedule.end_date,
      ).format('DD/MM/YYYY')}`,
    cell: ({ row }) => (
      <Box>
        <Text>{`${moment(row.original.schedule.start_date).format(
          'DD/MM/YYYY',
        )} até ${moment(row.original.schedule.end_date).format(
          'DD/MM/YYYY',
        )}`}</Text>
      </Box>
    ),
  },
  {
    id: 'options',
    header: 'Opções',
    cell: ({ row }) => (
      <HStack spacing='0px'>
        <Tooltip label='Visualizar Reserva'>
          <IconButton
            colorScheme='blackAlpha'
            size='sm'
            variant='ghost'
            aria-label='visualizar-reserva'
            icon={<LuEye />}
            onClick={() => props.handleViewClick(row.original)}
          />
        </Tooltip>
        <Tooltip label='Duplicar Reserva'>
          <IconButton
            colorScheme='cyan'
            size='sm'
            variant='ghost'
            aria-label='duplicar-reserva'
            icon={<CopyIcon />}
            onClick={() => props.handleDuplicateClick(row.original)}
          />
        </Tooltip>
        <Tooltip label='Editar'>
          <IconButton
            colorScheme='yellow'
            size='xs'
            variant='ghost'
            aria-label='editar-reserva'
            icon={<BsFillPenFill />}
            onClick={() => props.handleEditClick(row.original)}
          />
        </Tooltip>

        <Tooltip label='Remover'>
          <IconButton
            colorScheme='red'
            size='xs'
            variant='ghost'
            aria-label='remover-reserva'
            icon={<BsFillTrashFill />}
            onClick={() => props.handleDeleteClick(row.original)}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
