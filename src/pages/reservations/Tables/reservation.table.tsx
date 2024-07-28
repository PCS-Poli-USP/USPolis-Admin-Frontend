import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import moment from 'moment';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import { ReservationType } from 'utils/enums/reservations.enum';
import { getReservationRecurrenceText } from 'utils/reservations/reservations.formatter';

interface ReservationsColumnsProps {
  handleEditClick: (data: ReservationResponse) => void;
  handleDeleteClick: (data: ReservationResponse) => void;
}

export const getReservationsColumns = (
  props: ReservationsColumnsProps,
): ColumnDef<ReservationResponse>[] => [
  {
    accessorKey: 'building_name',
    header: 'Prédio',
  },
  {
    accessorKey: 'classroom_name',
    header: 'Sala',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => (
      <Box>
        <Text>{ReservationType.translate(row.original.type)}</Text>
      </Box>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
  },
  {
    accessorKey: 'recurrence',
    header: 'Recorrência',
    cell: ({ row }) => (
      <Box>
        <Text>{getReservationRecurrenceText(row.original)}</Text>
      </Box>
    ),
  },
  {
    accessorKey: 'time',
    header: 'Horário',
    cell: ({ row }) => (
      <Box>
        <Text>{`${row.original.schedule.start_time} ~ ${row.original.schedule.end_time}`}</Text>
      </Box>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Período',
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
