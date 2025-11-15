import { BugPriority, BugType } from '../../../utils/enums/bugReport.enum';

export interface CreateBugReport {
  priority: BugPriority;
  type: BugType;
  description: string;
  evidences: File[];
}
