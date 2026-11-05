/* eslint-disable @typescript-eslint/no-namespace */
export enum ApiKeyStatus {
  REVOKED = 'revoked',
  CLIENT_INACTIVE = 'client_inactive',
  EXPIRED = 'expired',
  ACTIVE = 'active',
}

export namespace ApiKeyStatus {
  const translations: Record<ApiKeyStatus, string> = {
    [ApiKeyStatus.REVOKED]: 'Revogada',
    [ApiKeyStatus.CLIENT_INACTIVE]: 'Cliente desativado',
    [ApiKeyStatus.EXPIRED]: 'Expirada',
    [ApiKeyStatus.ACTIVE]: 'Ativa',
  };

  export function translate(status: ApiKeyStatus): string {
    return translations[status] || status;
  }
}
