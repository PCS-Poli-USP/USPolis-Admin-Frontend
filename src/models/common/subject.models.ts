import { SubjectsTypes } from 'utils/enums/subjects.enum';
import { Building } from './building.model';
import { Department } from './department.model';

export interface Subject {
  id: string;
  code: string;
  name: string;
  professors: Array<string>;
  type: SubjectsTypes;
  class_credit: number;
  work_credit: number;
  activation: string;
  desactivation?: string;

  department: Department;
  buildings?: Building[];
}

export interface UnfetchSubject {
  id: string;
  code: string;
  name: string;
  professors: Array<string>;
  type: SubjectsTypes;
  class_credit: number;
  work_credit: number;
  activation: string;
  desactivation?: string;
  department_id: number;
}
