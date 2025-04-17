import { SubjectType } from "../../utils/enums/subjects.enum";

export interface Subject {
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
