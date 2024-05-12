import { BuildingRef } from './building.model';

export interface Subject {
  buildings?: Array<BuildingRef>;
  id: string;
  code: string;
  name: string;
  professors: Array<string>;
  type: string;
  class_credit: number;
  work_credit: number;
  activation: string;
  desactivation?: string;
}

export interface CreateSubject {
  code: string;
  name: string;
  professors: Array<string>;
  type: string;
  class_credit: number;
  work_credit: number;
  activation: string;
  desactivation?: string;
}

export interface UpdateSubject extends CreateSubject {
  id: string;
}
