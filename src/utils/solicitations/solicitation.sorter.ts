import { SolicitationResponse } from '../../models/http/responses/solicitation.response.models';
import moment from 'moment';
import { ReservationStatus } from '../enums/reservations.enum';

export function sortSolicitationResponse(
  A: SolicitationResponse,
  B: SolicitationResponse,
) {
  const A_closed = A.status != ReservationStatus.PENDING;
  const B_closed = B.status != ReservationStatus.PENDING;

  if (!A_closed && B_closed) return -1;
  if (A_closed && !B_closed) return 1;
  if (A_closed && B_closed) {
    const updatedA = moment(A.updated_at);
    const updatedB = moment(B.updated_at);
    if (updatedA.isBefore(updatedB)) return 1;
    if (updatedA.isAfter(updatedB)) return -1;
    return 0;
  }
  
  const createdA = moment(A.created_at);
  const createdB = moment(B.created_at);
  if (createdA.isBefore(createdB)) return -1;
  if (createdA.isAfter(createdB)) return 1;
  return 0;
}
