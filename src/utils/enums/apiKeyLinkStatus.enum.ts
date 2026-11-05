/* eslint-disable @typescript-eslint/no-namespace */
export enum ApiKeyLinkStatus {
  CONSUMED = 'consumed',
  INVALIDATED = 'invalidated',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

export namespace ApiKeyLinkStatus {
  const translations: Record<ApiKeyLinkStatus, string> = {
    [ApiKeyLinkStatus.CONSUMED]: 'Aberto',
    [ApiKeyLinkStatus.INVALIDATED]: 'Invalidado',
    [ApiKeyLinkStatus.EXPIRED]: 'Expirado',
    [ApiKeyLinkStatus.PENDING]: 'Aguardando abertura',
  };

  export function translate(status: ApiKeyLinkStatus): string {
    return translations[status] || status;
  }
}
