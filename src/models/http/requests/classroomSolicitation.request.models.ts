export interface CreateClassroomSolicitation {
  classroom_id: number;
  building_id: number;
  date: string;
  reason: string;
  email: string;
  start_time: string;
  end_time: string;
  capacity: number;
}
