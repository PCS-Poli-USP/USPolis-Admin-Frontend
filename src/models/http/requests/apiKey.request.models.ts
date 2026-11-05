export interface CreateApiClient {
  name: string;
  organization?: string;
  contact_name: string;
  contact_email: string;
  description: string;
}

export type UpdateApiClient = CreateApiClient;

export interface RateLimitRequest {
  max_requests: number;
  window_seconds: number;
}

export interface UpdateApiKey {
  name: string;
  allowed_path_prefixes: string[];
  expires_at: string;
}

export interface UpdateApiKeyRateLimits {
  // Empty = the server's default limits.
  rate_limits: RateLimitRequest[];
}

export interface CreateApiKey extends UpdateApiKey, UpdateApiKeyRateLimits {}

export interface RevokeApiKey {
  reason: string;
}

export type ApiKeyLinkTtlHours = 1 | 24 | 72;

export interface CreateApiKeyViaLink extends CreateApiKey {
  link_ttl_hours: ApiKeyLinkTtlHours;
}

export interface SendApiKeyLinkEmail {
  // Only the admin's screen holds it: the server can't rebuild the link.
  token: string;
  message?: string;
}

export interface RevealApiKeyLink {
  token: string;
}
