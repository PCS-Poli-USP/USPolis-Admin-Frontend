import {
  BugPriority,
  BugStatus,
  BugType,
} from '../../../utils/enums/bugReport.enum';

export interface BugReportResponse {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;

  priority: BugPriority;
  type: BugType;
  status: BugStatus;
  description: string;
  created_at: string;
  resolved_at: string | undefined;

  evidences_ids: number[];
  mime_types: string[];
}
