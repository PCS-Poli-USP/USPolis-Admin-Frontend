export enum SubjectsResponseCode {
  NOT_FOUND = 404,
  ALREADY_EXISTS = 409,
  METHOD_NOT_ALLOWED = 405,
}

export enum SubjectType {
  BIANNUAL = 'biannual',
  FOUR_MONTHLY = 'four_monthly',
  OTHER = 'other',
}

export enum CrawlerType {
  JANUS = 'janus',
  JUPITER = 'jupiter',
}

export namespace CrawlerType {
  const translations: { [key in CrawlerType]: string } = {
    [CrawlerType.JANUS]: 'Janus',
    [CrawlerType.JUPITER]: 'Júpiter',
  };

  export function translate(type: CrawlerType | undefined): string {
    if (!type) return 'NÃO DEFINIDO';
    return translations[type];
  }
}
