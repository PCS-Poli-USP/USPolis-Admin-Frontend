import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const USPOLIS_SERVER_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

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
    );
    return response;
  }

  async refreshToken(
    refresh_token: string,
  ): Promise<AxiosResponse<RefreshTokenResponse>> {
    const response = await this.http.get(
      `/refresh-token?refresh_token=${encodeURIComponent(refresh_token)}`,
    );
    return response;
  }
}

export { AuthHttpService };
