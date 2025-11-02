/* eslint-disable @typescript-eslint/no-namespace */
export enum EventType {
  TALK = 'talk',
  WORKSHOP = 'workshop',
  SELECTION_PROCESS = 'selection_process',
  OTHER = 'other',
}

export namespace EventType {
  const translations: { [key in EventType]: string } = {
    [EventType.TALK]: 'Palestra',
    [EventType.WORKSHOP]: 'Oficina',
    [EventType.SELECTION_PROCESS]: 'Processo Seletivo',
    [EventType.OTHER]: 'Outro',
  };

  export function translate(type: EventType): string {
    return translations[type];
  }

  export function values(): EventType[] {
    return Object.values(EventType).filter(
      (value) => typeof value === 'string',
    ) as EventType[];
  }
}
