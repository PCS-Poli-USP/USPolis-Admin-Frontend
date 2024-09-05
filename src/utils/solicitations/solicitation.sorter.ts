import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import moment from 'moment';

export function sortClassroomSolicitationResponse(
  A: ClassroomSolicitationResponse,
  B: ClassroomSolicitationResponse,
) {
  const dateA = moment(A.created_at);
  const dateB = moment(B.created_at);
  if (dateA.isBefore(dateB)) return -1;
  if (dateA.isBefore(dateB)) return 1;
  return 0;
}
