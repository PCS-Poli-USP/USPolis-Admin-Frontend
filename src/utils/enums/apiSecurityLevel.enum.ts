/* eslint-disable @typescript-eslint/no-namespace */
export enum ApiSecurityLevel {
  PUBLIC = 'public',
  AUTHENTICATED = 'authenticated',
  RESTRICTED = 'restricted',
  ADMIN = 'admin',
  UNKNOWN = 'unknown',
}

export namespace ApiSecurityLevel {
  export function values(): ApiSecurityLevel[] {
    return [
      ApiSecurityLevel.PUBLIC,
      ApiSecurityLevel.AUTHENTICATED,
      ApiSecurityLevel.RESTRICTED,
      ApiSecurityLevel.ADMIN,
      ApiSecurityLevel.UNKNOWN,
    ];
  }

  const translations: Record<ApiSecurityLevel, string> = {
    [ApiSecurityLevel.PUBLIC]: 'Público',
    [ApiSecurityLevel.AUTHENTICATED]: 'Autenticado',
    [ApiSecurityLevel.RESTRICTED]: 'Restrito',
    [ApiSecurityLevel.ADMIN]: 'Admin',
    [ApiSecurityLevel.UNKNOWN]: 'Desconhecido',
  };

  export function translate(level: ApiSecurityLevel): string {
    return translations[level] || level;
  }
}
