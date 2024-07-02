import { ClassroomResponse } from 'models/http/responses/classroom.response.models';

export function sortClassroomResponse(
  A: ClassroomResponse,
  B: ClassroomResponse,
) {
  if (A.building < B.building) return -1;
  if (A.building > B.building) return 1;
  if (A.name < B.name) return -1;
  if (A.name > B.name) return 1;
  return 0;
}
