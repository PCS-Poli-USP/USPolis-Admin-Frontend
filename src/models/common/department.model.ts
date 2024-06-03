import { Building } from './building.model';
import Classroom from './classroom.model';
import { Subject } from './subject.models';

export interface Department {
  id: number;
  name: string;
  abbreviation: string;
  professors: string[];
  updated_at: string;
  building: Building;
  classrooms?: Classroom[];
  subjects?: Subject[];
}

export interface UnfetchDepartment {
  id: number;
  name: string;
  abbreviation: string;
  professors: string[];
  updated_at: string;
}
