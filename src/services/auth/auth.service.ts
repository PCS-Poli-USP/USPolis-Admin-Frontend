import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { JSONResponse } from '../../models/http/responses/common.response.models';

const USPOLIS_SERVER_URL = import.meta.env.VITE_USPOLIS_API_ENDPOINT;

// The session lives in the httpOnly `session` cookie set by /auth/get-tokens;
// the tokens in the body are ignored and never stored.
interface GetTokensReponse {
  access_token: string;
  refresh_token: string;
}

class AuthHttpService {
  private http: AxiosInstance;

  constructor(options: AxiosRequestConfig = {}) {
    const baseURL = `${USPOLIS_SERVER_URL}/auth`;
    this.http = axios.create({ baseURL, ...options });
  }

  async getTokens(authCode: string): Promise<AxiosResponse<GetTokensReponse>> {
    const response = await this.http.get(
      `/get-tokens?auth_code=${encodeURIComponent(authCode)}`,
      { withCredentials: true },
    );
    return response;
  }

  async logout(): Promise<AxiosResponse<JSONResponse>> {
    return await this.http.post('/logout', null, { withCredentials: true });
  }
}

export { AuthHttpService };
