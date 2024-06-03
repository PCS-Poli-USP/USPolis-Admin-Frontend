import { UnfetchClassroom } from 'models/common/classroom.model';
import { UnfetchSubject } from 'models/common/subject.models';

export interface DepartmentResponse {
  id: number;
  name: string;
  abbreviation: string;
  professors: string[];
  building: string;
  subjects?: UnfetchSubject[];
  classrooms?: UnfetchClassroom[];
}
