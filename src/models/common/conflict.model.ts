import { OccurrenceResponse } from 'models/http/responses/occurrence.response.model';

export default interface Conflict {
  id: number;
  name: string;
  conflicts: ByClassroomConflict[];
}

interface ByClassroomConflict {
  id: number;
  name: string;
  conflicts: OccurrenceResponse[][];
}
