import moment from 'moment';
import { ClassroomSolicitationResponse } from '../../models/http/responses/classroomSolicitation.response.models';
import { SolicitationStatus } from '../enums/solicitationStatus.enum';

export function getSolicitationStatusText(
  solicitation: ClassroomSolicitationResponse,
) {
  if (solicitation.status === SolicitationStatus.APPROVED) {
    return `Situação: Aprovado por ${solicitation.closed_by} às ${moment(solicitation.updated_at).format('DD/MM/YYYY, HH:mm')}`;
  }
  if (solicitation.status === SolicitationStatus.DENIED) {
    return `Situação: Negado por ${solicitation.closed_by} às ${moment(solicitation.updated_at).format('DD/MM/YYYY, HH:mm')}`;
  }
  if (solicitation.status === SolicitationStatus.DELETED) {
    return `Situação: Removida por ${solicitation.deleted_by} às ${moment(solicitation.updated_at).format('DD/MM/YYYY, HH:mm')}`;
  }
  if (solicitation.status === SolicitationStatus.PENDING) {
    return 'Situação: Pendente';
  }
  if (solicitation.status === SolicitationStatus.CANCELLED) {
    return `Situação: Cancelada`;
  }
  return 'Situação: Desconhecida';
}

export function getRequesterText(solicitation: ClassroomSolicitationResponse) {
  if (solicitation.status === SolicitationStatus.PENDING) {
    return `Solicitante: ${solicitation.user} às ${moment(
      solicitation.created_at,
    ).format('DD/MM/YYYY, HH:mm')}`;
  }
  return `Solicitante: ${solicitation.user} às ${moment(
    solicitation.updated_at,
  ).format('DD/MM/YYYY, HH:mm')}`;
}
