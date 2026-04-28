export interface UserAbsenceResponse {
  id: number;
  user_schedule_id: number;
  schedule_id: number;

  absence_date: string;
  note: string;

  updated_at: string;
  created_at: string;
}
