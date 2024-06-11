import { SubjectType } from 'utils/enums/subjects.enum';
import { BuildingResponse } from './building.response.models';
import { ClassUnfetchResponse } from './class.response.models';

export interface SubjectResponseBase {
  id: number;
  code: string;
  name: string;
  professors: string[];
  type: SubjectType;
  class_credit: number;
  work_credit: number;
  activation: string;
  desactivation?: string;
}

export interface SubjectResponse extends SubjectResponseBase {
  buildings?: BuildingResponse[];
  classes?: ClassUnfetchResponse[];
}

export interface SubjectUnfetchResponse {
  id: number;
  name: string;
  code: string;
  professors: string[];
  type: SubjectType;
  class_credit: number;
  work_credit: number;
  activation: string;
  desactivation?: string;
}
