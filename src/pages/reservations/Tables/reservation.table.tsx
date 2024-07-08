import { ColumnDef } from '@tanstack/react-table';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';

interface ReservationsColumnsProps {
  handleEditClick: (data: ReservationResponse) => void;
  handleDeleteClick: (data: ReservationResponse) => void;
}

export const getReservationsColumns = (
  props: ReservationsColumnsProps,
): ColumnDef<ReservationResponse>[] => [
  {
    accessorKey: 'building_name',
    header: 'Prédio'
  },
  {
    accessorKey: 'classroom_name',
    header: 'Sala'
  },
  {
    accessorKey: 'name',
    header: 'Nome'
  },
  {
    accessorKey: 'type',
    header: 'Tipo'
  },
  {
    accessorKey: 'schedule.recurrence',
    header: 'Recorrência'
  },
  {
    accessorKey: 'description',
    header: 'Descrição'
  },
];
