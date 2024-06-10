import { SubjectsTypes } from 'utils/enums/subjects.enum';
import { BuildingResponse } from './building.response.models';

export interface SubjectResponse {
  id: number;
  code: string;
  name: string;
  buildings?: BuildingResponse[];
  professors: string[];
  type: SubjectsTypes;
  class_credit: number;
  work_credit: number;
  activation: string;
  desactivation?: string;
}
