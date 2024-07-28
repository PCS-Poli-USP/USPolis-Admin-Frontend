export enum Recurrence {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  BIWEEKLY = 'Biweekly',
  MONTHLY = 'Monthly',
  CUSTOM = 'Custom',
}

export namespace Recurrence {
  const translations: { [key in Recurrence]: string } = {
    [Recurrence.DAILY]: 'Dia útil',
    [Recurrence.WEEKLY]: 'Semanal',
    [Recurrence.BIWEEKLY]: 'Quinzenal',
    [Recurrence.MONTHLY]: 'Mensal',
    [Recurrence.CUSTOM]: 'Sem recorrência',
  };

  export function translate(recurrence: Recurrence): string {
    return translations[recurrence];
  }

  export function toRRule(recurrence: Recurrence) {
    if (recurrence === Recurrence.MONTHLY) return 'monthly';
    return 'weekly';
  }

  export function toRRuleInterval(recurrence: Recurrence): number {
    if (recurrence === Recurrence.BIWEEKLY) return 2;
    return 1;
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
