export interface OccurrenceConflict {
  id: number;
  start_time: Date;
  end_time: Date;
  date: string;
  subject_code?: string;
  class_code?: string;
  class_id: number;
  reservation_name?: string;
  reservation_id?: number;
}

export default interface Conflict {
  id: number;
  name: string;
  conflicts: ByClassroomConflict[];
}

interface ByClassroomConflict {
  id: number;
  name: string;
  conflicts: { [key: string]: OccurrenceConflict[][] };
}
