import { ApiKeyLinkStatus } from '../../../utils/enums/apiKeyLinkStatus.enum';
import { ApiKeyStatus } from '../../../utils/enums/apiKeyStatus.enum';

export interface RateLimitResponse {
  max_requests: number;
  window_seconds: number;
}

export interface ApiClientResponse {
  id: number;
  name: string;
  organization: string | null;
  contact_name: string;
  contact_email: string;
  description: string;
  is_active: boolean;
  active_keys: number;
  total_keys: number;
  created_by_id: number;
  created_at: string;
  updated_at: string;
}

// A one-time delivery link as the admin sees it: never the token.
export interface ApiKeyDeliveryLinkResponse {
  id: number;
  link_id: string;
  status: ApiKeyLinkStatus;
  expires_at: string;
  created_by_id: number;
  created_at: string;
  consumed_at: string | null;
  consumed_ip: string | null;
  invalidated_at: string | null;
  invalidated_by_id: number | null;
  emailed_at: string | null;
  emailed_to: string | null;
}

export interface ApiKeyResponse {
  id: number;
  client_id: number;
  name: string;
  public_id: string;
  masked_key: string;
  status: ApiKeyStatus;
  allowed_path_prefixes: string[];
  expires_at: string;
  // Limits actually enforced: the key's own rules, or the defaults when
  // uses_default_limits is true.
  rate_limits: RateLimitResponse[];
  uses_default_limits: boolean;
  last_used_at: string | null;
  revoked_at: string | null;
  revoked_by_id: number | null;
  revoked_reason: string | null;
  created_by_id: number;
  created_at: string;
  updated_at: string;
  // Set when the key was issued for delivery by a one-time link.
  delivery_link: ApiKeyDeliveryLinkResponse | null;
}

// Only returned on creation: the plaintext key is never shown again.
export interface ApiKeyCreatedResponse extends ApiKeyResponse {
  key: string;
}

// Issued for delivery by link: the plaintext key is never returned. `token`
// is the only copy of the link's secret, and `url` already contains it.
export interface ApiKeyLinkCreatedResponse {
  key: ApiKeyResponse;
  link: ApiKeyDeliveryLinkResponse;
  token: string;
  url: string;
}

// Public: what the partner's page shows before revealing. No secret.
export interface ApiKeyLinkPublicResponse {
  status: ApiKeyLinkStatus;
  // Pending, and its key can still be used.
  available: boolean;
  expires_at: string;
  client_name: string;
  key_name: string;
}

export interface ApiKeyRevealedResponse {
  key: string;
  key_name: string;
  client_name: string;
  expires_at: string;
  allowed_path_prefixes: string[];
}
