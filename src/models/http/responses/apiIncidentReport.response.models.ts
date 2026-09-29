import { IncidentReportLevel } from '../../../utils/enums/incidentReportLevel.enum';
import { IncidentReportStatus } from '../../../utils/enums/incidentReportStatus.enum';

export interface ApiIncidentReportResponse {
  id: number;
  level: IncidentReportLevel;
  status: IncidentReportStatus;
  description: string;
  access_log_id: number;
  access_log_endpoint: string;
  access_log_status_code: number;
  created_at: string;
  resolved_at: string | null;
}
