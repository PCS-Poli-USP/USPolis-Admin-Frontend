import { ClassroomWithConflictCount } from '../../models/http/responses/classroom.response.models';

export function formatClassroomForSelection(
  classroom: ClassroomWithConflictCount,
): string {
  return classroom.conflicts > 0
    ? `⚠️ ${classroom.name} [${classroom.capacity}] (${classroom.conflicts} conflitos)`
    : `${classroom.name} [${classroom.capacity}]`;
}
