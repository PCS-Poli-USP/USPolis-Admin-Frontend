import { Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import moment from 'moment';
import { ReservationType } from 'utils/enums/reservations.enum';
import {
  FilterArray,
  FilterNumber,
} from 'utils/tanstackTableHelpers/tableFiltersFns';

interface MySolicitationsColumnsProp {}

export const getMySolicitationsColumns = (
  props: MySolicitationsColumnsProp,
): ColumnDef<ClassroomSolicitationResponse>[] => [
  {
    accessorFn: (row) =>
      row.closed ? (row.approved ? 'Aprovada' : 'Negada') : 'Pendente',
    header: 'Situação',
    meta: { isSelectable: true },
    cell: ({ row }) => (
      <Text>
        {row.original.closed
          ? row.original.approved
            ? 'Aprovada'
            : 'Negada'
          : 'Pendente'}
      </Text>
    ),
  },
  {
    accessorKey: 'reservation_title',
    header: 'Título',
    maxSize: 250,
    cell: ({ row }) => (
      <Tooltip label={row.original.reservation_title}>
        <Text overflowX={'hidden'} textOverflow={'ellipsis'}>
          {row.original.reservation_title}
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
        {row.original.classroom ? row.original.classroom : 'Não informada'}
      </Text>
    ),
  },
  {
    accessorFn: (row) => {
      const start = row.start_time;
      const end = row.end_time;
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
      const start = row.original.start_time;
      const end = row.original.end_time;
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
      row.dates.map((date) => moment(date).format('DD/MM/YYYY')),
    accessorKey: 'dates',
    header: 'Datas',
    maxSize: 250,
    cell: ({ row }) => (
      <Tooltip
        label={row.original.dates
          .map((date) => moment(date).format('DD/MM/YYYY'))
          .join(', ')}
      >
        <Text overflowX={'hidden'} textOverflow={'ellipsis'}>
          {row.original.dates
            .map((date) => moment(date).format('DD/MM/YYYY'))
            .join(', ')}
        </Text>
      </Tooltip>
    ),
  },
  {
    accessorFn: (row) => ReservationType.translate(row.reservation_type),
    accessorKey: 'reservation_type',
    header: 'Tipo',
    cell: ({ row }) => (
      <Text>{ReservationType.translate(row.original.reservation_type)}</Text>
    ),
  },
  // {
  //   accessorFn: (row) => (row.reason ? row.reason : 'Não informado'),
  //   accessorKey: 'reason',
  //   header: 'Motivo',
  //   cell: ({ row }) => (
  //     <Text>{row.original.reason ? row.original.reason : 'Não informado'}</Text>
  //   ),
  // },
  {
    filterFn: FilterNumber,
    accessorKey: 'capacity',
    header: 'Capacidade',
  },
  {
    accessorKey: 'updated_at',
    header: 'Atualizada em',
    cell: ({ row }) => (
      <Text>{moment(row.original.updated_at).format('DD/MM/YYYY HH:mm')}</Text>
    ),
  },
];
