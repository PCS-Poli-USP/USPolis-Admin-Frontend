/* eslint-disable @typescript-eslint/no-namespace */
export enum SubjectsResponseCode {
  NOT_FOUND = 404,
  ALREADY_EXISTS = 409,
  METHOD_NOT_ALLOWED = 405,
}

export enum SubjectType {
  BIANNUAL = 'biannual',
  FOUR_MONTHLY = 'four_monthly',
  POSTGRADUTE = 'postgraduate',
  OTHER = 'other',
}

export namespace SubjectType {
  const translations: { [key in SubjectType]: string } = {
    [SubjectType.BIANNUAL]: 'Semestral',
    [SubjectType.FOUR_MONTHLY]: 'Quadrimestral',
    [SubjectType.POSTGRADUTE]: 'Pós-Graduação',
    [SubjectType.OTHER]: 'Outro',
  };
  export function translate(type: SubjectType | undefined): string {
    if (!type) return 'NÃO DEFINIDO';
    return translations[type];
  }
  export function values(): SubjectType[] {
    return Object.values(SubjectType).filter(
      (value) => typeof value === 'string',
    ) as SubjectType[];
  }
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

  export function values(): CrawlerType[] {
    return Object.values(CrawlerType).filter(
      (value) => typeof value === 'string',
    ) as CrawlerType[];
  }
}
