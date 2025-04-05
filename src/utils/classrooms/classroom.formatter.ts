import { ClassroomWithConflictCount } from 'models/common/classroom.model';
import { ClassroomWithConflictCount as ClassroomWithConflictCountNew } from 'models/http/responses/classroom.response.models';

export function formatClassroomForSelection(
  classroom: ClassroomWithConflictCount | ClassroomWithConflictCountNew,
): string {
  return classroom.conflicts > 0
    ? `⚠️ ${classroom.name} [${classroom.capacity}] (${classroom.conflicts} conflitos)`
    : `${classroom.name} [${classroom.capacity}]`;
}
