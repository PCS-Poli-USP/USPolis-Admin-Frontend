import { SubjectType } from 'utils/enums/subjects.enum';

export interface CrawlSubject {
  subject_codes: string[];
  calendar_ids: number[];
}

export interface UpdateCrawlSubject {
  subject_codes: string[];
}

export interface CreateSubject {
  building_ids: number[];
  code: string;
  name: string;
  professors: Array<string>;
  type: SubjectType;
  class_credit: number;
  work_credit: number;
  activation: string;
  desactivation?: string;
}

export interface UpdateSubject extends CreateSubject {}
