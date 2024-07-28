export interface OccurrenceResponse {
  id: number;
  start_time: string;
  end_time: string;
  date: string;
  classroom_id?: number;
  classroom?: string;
}
