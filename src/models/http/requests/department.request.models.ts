interface BaseDepartment {
  name: string;
  abbreviation: string;
  professors: string[];
  subjects_ids?: number[];
  classrooms_ids?: number[];
}
export interface CreateDepartment extends BaseDepartment {
  building_id: number;
}

export interface UpdateDepartment extends BaseDepartment {
  building_id?: number;
}
