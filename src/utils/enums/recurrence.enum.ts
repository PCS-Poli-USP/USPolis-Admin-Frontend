export enum Recurrence {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  BIWEEKLY = 'Biweekly',
  MONTHLY = 'Monthly',
  CUSTOM = 'Custom',
}

export namespace Recurrence {
  const translations: { [key in Recurrence]: string } = {
    [Recurrence.DAILY]: 'Diária',
    [Recurrence.WEEKLY]: 'Semanal',
    [Recurrence.BIWEEKLY]: 'Quinzenal',
    [Recurrence.MONTHLY]: 'Mensal',
    [Recurrence.CUSTOM]: 'Sem recorrência',
  };

  export function translate(recurrence: Recurrence): string {
    return translations[recurrence];
  }

  export function getValues(): Recurrence[] {
    return [
      Recurrence.DAILY,
      Recurrence.WEEKLY,
      Recurrence.BIWEEKLY,
      Recurrence.MONTHLY,
      Recurrence.CUSTOM,
    ];
  }
}
