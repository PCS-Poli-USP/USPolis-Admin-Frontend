export enum ReservationType {
  EXAM = 'exam',
  MEETING = 'meeting',
  EVENT = 'event',
  OTHER = 'other',
}

export namespace ReservationType {
  const translations: { [key in ReservationType]: string } = {
    [ReservationType.EXAM]: 'Prova',
    [ReservationType.MEETING]: 'Reunião',
    [ReservationType.EVENT]: 'Evento',
    [ReservationType.OTHER]: 'Outro',
  };

  export function translate(type: ReservationType): string {
    return translations[type];
  }

  export function getValues(): ReservationType[] {
    return [
      ReservationType.EXAM,
      ReservationType.MEETING,
      ReservationType.EVENT,
      ReservationType.OTHER,
    ];
  }
}
