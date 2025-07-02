/* eslint-disable @typescript-eslint/no-namespace */
export enum SolicitationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DENIED = 'denied',
  CANCELLED = 'cancelled',
  DELETED = 'deleted',
}

export namespace SolicitationStatus {
  export function getValues(): SolicitationStatus[] {
    return [
      SolicitationStatus.PENDING,
      SolicitationStatus.APPROVED,
      SolicitationStatus.DENIED,
      SolicitationStatus.CANCELLED,
      SolicitationStatus.DELETED,
    ];
  }

  const translations: { [key in SolicitationStatus]: string } = {
    [SolicitationStatus.PENDING]: 'Pendente',
    [SolicitationStatus.APPROVED]: 'Aprovada',
    [SolicitationStatus.DENIED]: 'Negada',
    [SolicitationStatus.CANCELLED]: 'Cancelada',
    [SolicitationStatus.DELETED]: 'Removida',
  };
  export function translate(status: SolicitationStatus): string {
    return translations[status];
  }

  export function getColor(status: SolicitationStatus): string {
    switch (status) {
      case SolicitationStatus.PENDING:
        return 'yellow.500';
      case SolicitationStatus.APPROVED:
        return 'green.500';
      case SolicitationStatus.DENIED:
        return 'red.500';
      case SolicitationStatus.CANCELLED:
        return 'orange.500';
      case SolicitationStatus.DELETED:
        return 'gray.500';
      default:
        return 'gray.500';
    }
  }
}
