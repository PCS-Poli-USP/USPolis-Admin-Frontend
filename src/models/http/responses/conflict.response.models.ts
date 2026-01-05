export interface OccurrenceConflict {
  id: number;
  start_time: Date;
  end_time: Date;
  date: string;
  subject_code?: string;
  class_code?: string;
  class_id: number;
  reservation_title?: string;
  reservation_id?: number;
}

export default interface Conflict {
  id: number;
  name: string;
  total_conflicts: number;
  conflicts: ByClassroomConflict[];
}

interface ByClassroomConflict {
  id: number;
  name: string;
  total_classroom_conflicts: number;
  conflicts: { [key: string]: OccurrenceConflict[][] };
}

export interface ClassroomIntentionalConflictMap {
  classroom_id: number;
  classroom: string;
  conflicts: IntentionalConflictResponse[];
}

export interface BuildingIntentionalConflictMap {
  building_id: number;
  building: string;
  classroom_maps: ClassroomIntentionalConflictMap[];
}

export interface IntentionalConflictOccurrenceResponse {
  id: number;
  label: string;
  start_time: string;
  end_time: string;
}

export interface IntentionalConflictResponse {
  id: number;
  classroom_id: number;
  classroom: string;
  date: string;

  first: IntentionalConflictOccurrenceResponse;
  second: IntentionalConflictOccurrenceResponse;
}
