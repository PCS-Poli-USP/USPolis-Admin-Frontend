export interface UserSessionResponse {
  id: string;
  user_id: number;
  user_email: string;
  user_name: string;
  user_agent: string;

  browser: string;
  os: string;
  device: string;

  ip_address: string;
  expires_at: string;
  created_at: string;
}
