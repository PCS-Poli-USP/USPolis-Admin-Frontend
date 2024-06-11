export interface CreateClass {
  subject_id: number;
  code: string;
  semester: number;
}

export interface UpdateClass extends CreateClass {}
