import { CrawlerType, SubjectType } from '../../../utils/enums/subjects.enum';

export interface CrawlSubject {
  subject_codes: string[];
  calendar_ids: number[];
  type: CrawlerType;
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
}

export interface UpdateSubject extends CreateSubject {}
