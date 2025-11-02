import moment from 'moment';
import { SolicitationResponse } from '../../models/http/responses/solicitation.response.models';
import { ReservationStatus } from '../enums/reservations.enum';

export function getSolicitationStatusText(solicitation: SolicitationResponse) {
  if (solicitation.status === ReservationStatus.APPROVED) {
    return `Situação: Aprovado por ${solicitation.closed_by} às ${moment(solicitation.updated_at).format('DD/MM/YYYY, HH:mm')}`;
  }
  if (solicitation.status === ReservationStatus.DENIED) {
    return `Situação: Negado por ${solicitation.closed_by} às ${moment(solicitation.updated_at).format('DD/MM/YYYY, HH:mm')}`;
  }
  if (solicitation.status === ReservationStatus.DELETED) {
    return `Situação: Removida por ${solicitation.deleted_by} às ${moment(solicitation.updated_at).format('DD/MM/YYYY, HH:mm')}`;
  }
  if (solicitation.status === ReservationStatus.PENDING) {
    return 'Situação: Pendente';
  }
  if (solicitation.status === ReservationStatus.CANCELLED) {
    return `Situação: Cancelada`;
  }
  return 'Situação: Desconhecida';
}

export function getRequesterText(solicitation: SolicitationResponse) {
  if (solicitation.status === ReservationStatus.PENDING) {
    return `Solicitante: ${solicitation.user} às ${moment(
      solicitation.created_at,
    ).format('DD/MM/YYYY, HH:mm')}`;
  }
  return `Solicitante: ${solicitation.user} às ${moment(
    solicitation.updated_at,
  ).format('DD/MM/YYYY, HH:mm')}`;
}
