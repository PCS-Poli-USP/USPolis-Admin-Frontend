export interface Occurrence {
  id: number;
  start_time: string;
  end_time: string;
  date: string;
  schedule_id: number;
  classroom_id?: number;
}
