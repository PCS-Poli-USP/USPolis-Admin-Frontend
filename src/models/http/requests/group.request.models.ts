export interface GroupRequest {
  name: string;
  abbreviation: string;

  classroom_ids: number[];
  user_ids: number[];
}

export interface GroupUpdate extends GroupRequest {}
