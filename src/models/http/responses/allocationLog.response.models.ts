export interface AllocationLogResponse {
  id: number;
  schedule_id: number;
  user_email: string;
  modified_by: string;
  modified_at: string;
  action: string;
  old_classroom: string;
  old_building: string;
  new_classroom: string;
  new_building: string;
}
