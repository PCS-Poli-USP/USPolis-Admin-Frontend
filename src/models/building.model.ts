export interface Building {
  id: string;
  name: string;
  created_by?: string;
  updated_at: string;
}

export interface CreateBuilding {
  name: string;
}

export interface UpdateBuilding {
  name: string;
}
