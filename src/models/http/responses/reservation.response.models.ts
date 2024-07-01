export interface ReservationResponseBase {
  id: number;
  name: string;
  type: string;
  description: string;
  updated_at: string;
}

export interface ReservationResponse extends ReservationResponseBase {
  classroom_id: number;
  classroom_name: string;

  schedule_id: number;
  created_by_id: number;
  created_by: string;
}
