import { RateLimitRequest } from '../../../models/http/requests/apiKey.request.models';

export interface KeyConfigForm {
  name: string;
  expires_on: string; // YYYY-MM-DD
  prefixes: string[];
}

export interface KeyLimitsForm {
  use_default_limits: boolean;
  rate_limits: RateLimitRequest[];
}

export type IssueKeyForm = KeyConfigForm & KeyLimitsForm;
