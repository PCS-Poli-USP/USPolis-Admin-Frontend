import { ApiSecurityLevel } from '../../../utils/enums/apiSecurityLevel.enum';

export interface ApiAccessLogResponse {
  id: number;
  security_level: ApiSecurityLevel;
  endpoint: string;
  method: string;
  status_code: number;
  timestamp: string;
  ip_address: string | null;
  user_agent: string | null;
  response_time_ms: number | null;
  tags: string[];
  user_id: number | null;
  user_email: string | null;
  detail: string | null;
  request_body: string | null;
}

export interface StatusCodeCount {
  status_code: number;
  count: number;
}

export interface ApiAccessLogSummaryResponse {
  since_days: number;
  total_errors: number;
  by_status_code: StatusCodeCount[];
}
