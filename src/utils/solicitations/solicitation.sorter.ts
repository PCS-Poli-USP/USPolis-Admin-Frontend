import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import moment from 'moment';

export function sortClassroomSolicitationResponse(
  A: ClassroomSolicitationResponse,
  B: ClassroomSolicitationResponse,
) {
  if (!A.closed && B.closed) return -1;
  if (A.closed && !B.closed) return 1;
  if (A.closed && B.closed) {
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
