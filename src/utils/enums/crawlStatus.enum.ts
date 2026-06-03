/* eslint-disable @typescript-eslint/no-namespace */
export enum CrawlStatus {
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}

export namespace CrawlStatus {
  export function getValues(): CrawlStatus[] {
    return [CrawlStatus.SUCCESS, CrawlStatus.WARNING, CrawlStatus.ERROR];
  }

  export function getColor(status: CrawlStatus): string {
    switch (status) {
      case CrawlStatus.SUCCESS:
        return 'uspolis.blue';
      case CrawlStatus.WARNING:
        return 'uspolis.yellow';
      case CrawlStatus.ERROR:
        return 'uspolis.red';
      default:
        return 'uspolis.gray';
    }
  }
  const translations: Record<CrawlStatus, string> = {
    [CrawlStatus.SUCCESS]: 'Sucesso',
    [CrawlStatus.WARNING]: 'Aviso',
    [CrawlStatus.ERROR]: 'Erro',
  };

  export function translate(status: CrawlStatus): string {
    return translations[status] || 'Desconecido';
  }
}
