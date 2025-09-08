import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import moment from 'moment';
import { ReservationType } from '../../../utils/enums/reservations.enum';
import {
  FilterArray,
  FilterNumber,
  FilterString,
} from '../../../utils/tanstackTableHelpers/tableFiltersFns';
import { ReservationStatus } from '../../../utils/enums/reservations.enum';
import { TbCalendarCancel } from 'react-icons/tb';

interface MySolicitationsColumnsProps {
  handleCancelClick: (data: SolicitationResponse) => void;
}

export const getMySolicitationsColumns = (
  props: MySolicitationsColumnsProps,
): ColumnDef<SolicitationResponse>[] => [
  {
    id: 'status',
    accessorFn: (val) => ReservationStatus.translate(val.status),
    header: 'Situação',
    meta: { isSelectable: true },
    cell: ({ row }) => (
      <Text>{ReservationStatus.translate(row.original.status)}</Text>
    ),
  },
  {
    accessorKey: 'reservation_title',
    header: 'Título',
    maxSize: 250,
    cell: ({ row }) => (
      <Tooltip label={row.original.reservation.title}>
        <Text overflowX={'hidden'} textOverflow={'ellipsis'}>
          {row.original.reservation.title}
        </Text>
      </Tooltip>
    ),
  },
  {
    accessorKey: 'building',
    header: 'Prédio',
  },
  {
    accessorKey: 'classroom',
    header: 'Sala',
    cell: ({ row }) => (
      <Text>
        {row.original.reservation.classroom
          ? row.original.reservation.classroom
          : 'Não informada'}
      </Text>
    ),
  },
  {
    accessorFn: (row) => {
      const start = row.reservation.schedule.start_time;
      const end = row.reservation.schedule.end_time;
      if (start && end) {
        return `${moment(start, 'HH:mm').format('HH:mm')} ~ ${moment(
          end,
          'HH:mm',
        ).format('HH:mm')}`;
      }
      return 'Não informado';
    },
    header: 'Horário',
    cell: ({ row }) => {
      const start = row.original.reservation.schedule.start_time;
      const end = row.original.reservation.schedule.end_time;
      return (
        <Text>{`${
          start ? moment(start, 'HH:mm').format('HH:mm') : 'Não informado'
        }${end ? ' ~ ' + moment(end, 'HH:mm').format('HH:mm') : ''}`}</Text>
      );
    },
  },
  {
    filterFn: FilterArray,
    accessorFn: (row) =>
      row.reservation.schedule.occurrences
        ? row.reservation.schedule.occurrences.map((occ) =>
            moment(occ.date).format('DD/MM/YYYY'),
          )
        : [],
    accessorKey: 'dates',
    header: 'Datas',
    maxSize: 250,
    cell: ({ row }) => {
      const occurrences = row.original.reservation.schedule.occurrences || [];
      return (
        <Tooltip
          label={occurrences
            .map((occ) => moment(occ.date).format('DD/MM/YYYY'))
            .join(', ')}
        >
          <Text overflowX={'hidden'} textOverflow={'ellipsis'}>
            {occurrences
              .map((occ) => moment(occ.date).format('DD/MM/YYYY'))
              .join(', ')}
          </Text>
        </Tooltip>
      );
    },
  },
  {
    accessorFn: (row) => ReservationType.translate(row.reservation.type),
    accessorKey: 'reservation_type',
    header: 'Tipo',
    cell: ({ row }) => (
      <Text>{ReservationType.translate(row.original.reservation.type)}</Text>
    ),
  },
  {
    filterFn: FilterNumber,
    accessorKey: 'capacity',
    header: 'Capacidade',
  },
  {
    accessorKey: 'updated_at',
    header: 'Atualizada em',
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
    id: 'options',
    header: 'Opções',
    cell: ({ row }) => (
      <HStack spacing='0px'>
        <Tooltip label='Cancelar Solicitação'>
          <IconButton
            colorScheme='red'
            size='lg'
            variant='ghost'
            aria-label='cancelar-solicitacao'
            icon={<TbCalendarCancel />}
            disabled={row.original.status !== ReservationStatus.PENDING}
            onClick={() => {
              props.handleCancelClick(row.original);
            }}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
