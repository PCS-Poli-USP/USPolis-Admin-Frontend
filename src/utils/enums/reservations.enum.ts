/* eslint-disable @typescript-eslint/no-namespace */
export enum ReservationType {
  EXAM = 'exam',
  MEETING = 'meeting',
  EVENT = 'event',
}

export namespace ReservationType {
  const translations: { [key in ReservationType]: string } = {
    [ReservationType.EXAM]: 'Prova',
    [ReservationType.MEETING]: 'Reunião',
    [ReservationType.EVENT]: 'Evento',
  };

  export function translate(type: ReservationType): string {
    return translations[type];
  }

  export function getValues(): ReservationType[] {
    return [
      ReservationType.EXAM,
      ReservationType.MEETING,
      ReservationType.EVENT,
    ];
  }
}

export enum ReservationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DENIED = 'denied',
  CANCELLED = 'cancelled',
  DELETED = 'deleted',
}

export namespace ReservationStatus {
  export function getValues(): ReservationStatus[] {
    return [
      ReservationStatus.PENDING,
      ReservationStatus.APPROVED,
      ReservationStatus.DENIED,
      ReservationStatus.CANCELLED,
      ReservationStatus.DELETED,
    ];
  }

  const translations: { [key in ReservationStatus]: string } = {
    [ReservationStatus.PENDING]: 'Pendente',
    [ReservationStatus.APPROVED]: 'Aprovada',
    [ReservationStatus.DENIED]: 'Negada',
    [ReservationStatus.CANCELLED]: 'Cancelada',
    [ReservationStatus.DELETED]: 'Removida',
  };
  export function translate(status: ReservationStatus): string {
    return translations[status];
  }

  export function getColor(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'yellow.500';
      case ReservationStatus.APPROVED:
        return 'green.500';
      case ReservationStatus.DENIED:
        return 'red.500';
      case ReservationStatus.CANCELLED:
        return 'orange.500';
      case ReservationStatus.DELETED:
        return 'gray.500';
      default:
        return 'gray.500';
    }
  }
}
