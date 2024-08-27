import Classroom from 'models/common/classroom.model';
import { ClassroomResponse } from 'models/http/responses/classroom.response.models';

export function sortClassroomResponse(
  A: ClassroomResponse | Classroom,
  B: ClassroomResponse | Classroom,
) {
  if (A.building < B.building) return -1;
  if (A.building > B.building) return 1;
  if (A.name < B.name) return -1;
  if (A.name > B.name) return 1;
  return 0;
}
