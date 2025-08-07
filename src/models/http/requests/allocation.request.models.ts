export interface EventUpdate {
  desalocate: boolean;
  all_occurrences: boolean;
  start_time: string;
  end_time: string;
  building: string;
  classroom: string;
  occurrence_id?: number;
  schedule_id: number;
}
