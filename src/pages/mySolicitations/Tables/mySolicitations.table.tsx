import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { ClassroomSolicitationResponse } from '../../../models/http/responses/classroomSolicitation.response.models';
import moment from 'moment';
import { ReservationType } from '../../../utils/enums/reservations.enum';
import {
  FilterArray,
  FilterNumber,
  FilterString,
} from '../../../utils/tanstackTableHelpers/tableFiltersFns';
import { SolicitationStatus } from '../../../utils/enums/solicitationStatus.enum';
import { TbCalendarCancel } from 'react-icons/tb';

interface MySolicitationsColumnsProps {
  handleCancelClick: (data: ClassroomSolicitationResponse) => void;
}

export const getMySolicitationsColumns = (
  props: MySolicitationsColumnsProps,
): ColumnDef<ClassroomSolicitationResponse>[] => [
  {
    id: 'status',
    accessorFn: (val) => SolicitationStatus.translate(val.status),
    header: 'Situação',
    meta: { isSelectable: true },
    cell: ({ row }) => (
      <Text>{SolicitationStatus.translate(row.original.status)}</Text>
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
            disabled={row.original.status !== SolicitationStatus.PENDING}
            onClick={() => {
              props.handleCancelClick(row.original);
            }}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
