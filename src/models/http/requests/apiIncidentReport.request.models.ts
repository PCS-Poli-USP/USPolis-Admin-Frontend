import { IncidentReportLevel } from '../../../utils/enums/incidentReportLevel.enum';
import { IncidentReportStatus } from '../../../utils/enums/incidentReportStatus.enum';

export interface CreateApiIncidentReport {
  access_log_id: number;
  level: IncidentReportLevel;
  description: string;
}

export interface UpdateApiIncidentReportStatus {
  status: IncidentReportStatus;
}
