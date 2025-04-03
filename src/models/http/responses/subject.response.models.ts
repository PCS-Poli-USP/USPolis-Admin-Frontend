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
}

export interface SubjectResponse extends SubjectResponseBase {
  building_ids: number[];
  buildings: BuildingResponse[];
  classes?: ClassUnfetchResponse[];
}

export interface SubjectUnfetchResponse extends SubjectResponseBase {}

export interface SubjectCrawlResponse {
  codes: string[];
  sucess: string[];
  failed: string[];
  errors: string[];
  update: boolean;
}
