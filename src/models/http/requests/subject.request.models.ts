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

export interface UpdateSubject extends CreateSubject {}