import moment from 'moment';
import { BugReportResponse } from '../../models/http/responses/bugReport.response.models';
import { BugPriority } from '../enums/bugReport.enum';

export function sortReportsResponse(
  A: BugReportResponse,
  B: BugReportResponse,
) {
  if (A.resolved_at && !B.resolved_at) return 1;
  if (!A.resolved_at && B.resolved_at) return -1;
  if (BugPriority.toInt(A.priority) > BugPriority.toInt(B.priority)) return -1;
  if (BugPriority.toInt(A.priority) < BugPriority.toInt(B.priority)) return 1;
  console.log(A.created_at, B.created_at);
  if (moment(A.created_at).isBefore(B.created_at)) return -1;
  if (moment(A.created_at).isAfter(B.created_at)) return 1;
  return 0;
}
