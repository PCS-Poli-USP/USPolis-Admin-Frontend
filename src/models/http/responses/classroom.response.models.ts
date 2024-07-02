export interface ClassroomResponse {
  id: number;
  name: string;
  capacity: number;
  floor: number;
  ignore_to_allocate: boolean;
  accessibility: boolean;
  projector: boolean;
  air_conditioning: boolean;
  updated_at: string;
  created_by_id: number;
  created_by: string;
  building_id: number;
  building: string;
}
