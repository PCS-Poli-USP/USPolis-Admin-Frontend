export interface GroupResponse {
  id: number;
  name: string;

  building_id: number;
  building: string;
  main: boolean;
  classroom_ids: number[];
  classroom_strs: string[];
  user_ids: number[];
  user_strs: string[];
  created_at: string;
  updated_at: string;
}
