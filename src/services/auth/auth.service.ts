import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { JSONResponse } from '../../models/http/responses/common.response.models';

const USPOLIS_SERVER_URL = import.meta.env.VITE_USPOLIS_API_ENDPOINT;

interface GetTokensReponse {
  access_token: string;
  refresh_token: string;
}

interface RefreshTokenResponse {
  access_token: string;
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

  async refreshToken(
    refresh_token: string,
  ): Promise<AxiosResponse<RefreshTokenResponse>> {
    const response = await this.http.get(
      `/refresh-token?refresh_token=${encodeURIComponent(refresh_token)}`,
      { withCredentials: true },
    );
    return response;
  }

  async logout(): Promise<AxiosResponse<JSONResponse>> {
    return await this.http.post('/logout', null, { withCredentials: true });
  }
}

export { AuthHttpService };
