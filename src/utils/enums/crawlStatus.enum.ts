/* eslint-disable @typescript-eslint/no-namespace */
export enum CrawlStatus {
  WARNING = 'warning',
  ERROR = 'error',
  FAILURE = 'failure',
  SUCCESS = 'success',
}

export namespace CrawlStatus {
  export function getValues(): CrawlStatus[] {
    return [
      CrawlStatus.SUCCESS,
      CrawlStatus.WARNING,
      CrawlStatus.ERROR,
      CrawlStatus.FAILURE,
    ];
  }

  export function getColor(status: CrawlStatus): string {
    switch (status) {
      case CrawlStatus.SUCCESS:
        return 'uspolis.blue';
      case CrawlStatus.WARNING:
        return 'uspolis.yellow';
      case CrawlStatus.ERROR:
      case CrawlStatus.FAILURE:
        return 'uspolis.red';
      default:
        return 'uspolis.gray';
    }
  }

  export function isError(status: CrawlStatus): boolean {
    return status === CrawlStatus.ERROR || status === CrawlStatus.FAILURE;
  }

  // O backend usa um enum próprio (CrawlerStatus) cujos valores nem sempre
  // coincidem com os status aceitos pelo componente Alert do Chakra
  // ('info' | 'warning' | 'success' | 'error') — passar o valor cru pode
  // quebrar o Chakra em runtime, por isso sempre convertemos por aqui.
  export function toAlertStatus(
    status: CrawlStatus,
  ): 'info' | 'warning' | 'success' | 'error' {
    switch (status) {
      case CrawlStatus.SUCCESS:
        return 'success';
      case CrawlStatus.WARNING:
        return 'warning';
      default:
        return 'error';
    }
  }

  const translations: Record<CrawlStatus, string> = {
    [CrawlStatus.SUCCESS]: 'Sucesso',
    [CrawlStatus.WARNING]: 'Aviso',
    [CrawlStatus.ERROR]: 'Erro',
    [CrawlStatus.FAILURE]: 'Falha',
  };

  export function translate(status: CrawlStatus): string {
    return translations[status] || 'Desconecido';
  }
}
