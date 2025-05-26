export enum WeekDay {
  MONDAY = 0,
  TUESDAY = 1,
  WEDNESDAY = 2,
  THURSDAY = 3,
  FRIDAY = 4,
  SATURDAY = 5,
  SUNDAY = 6,
}

// Classe de exceção personalizada
export class NoSuchWeekDay extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoSuchWeekDay';
  }
}

// Função de mapeamento dentro de um namespace
export namespace WeekDay {
  export type typeValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;

  const mapping: { [key: string]: WeekDay } = {
    seg: WeekDay.MONDAY,
    ter: WeekDay.TUESDAY,
    qua: WeekDay.WEDNESDAY,
    qui: WeekDay.THURSDAY,
    sex: WeekDay.FRIDAY,
    sab: WeekDay.SATURDAY,
    dom: WeekDay.SUNDAY,
  };

  const stringMapping: { [key in WeekDay]: string } = {
    [WeekDay.MONDAY]: 'Monday',
    [WeekDay.TUESDAY]: 'Tuesday',
    [WeekDay.WEDNESDAY]: 'Wednesday',
    [WeekDay.THURSDAY]: 'Thursday',
    [WeekDay.FRIDAY]: 'Friday',
    [WeekDay.SATURDAY]: 'Saturday',
    [WeekDay.SUNDAY]: 'Sunday',
  };

  const translations: { [key in WeekDay]: string } = {
    [WeekDay.MONDAY]: 'Segunda',
    [WeekDay.TUESDAY]: 'Terça',
    [WeekDay.WEDNESDAY]: 'Quarta',
    [WeekDay.THURSDAY]: 'Quinta',
    [WeekDay.FRIDAY]: 'Sexta',
    [WeekDay.SATURDAY]: 'Sábado',
    [WeekDay.SUNDAY]: 'Domingo',
  };

  export function translate(day: WeekDay): string {
    return translations[day];
  }

  export function toString(day: WeekDay): string {
    return stringMapping[day];
  }

  export function toInt(day: WeekDay) {
    // In moment Sunday = 0, Monday = 1, ...
    const fixed = Number(day) + 1;
    if (fixed === 7) return 0;
    return fixed;
  }

  export function toRRule(day: WeekDay) {
    switch (day) {
      case WeekDay.MONDAY:
        return 'MO';
      case WeekDay.TUESDAY:
        return 'TU';
      case WeekDay.WEDNESDAY:
        return 'WE';
      case WeekDay.THURSDAY:
        return 'TH';
      case WeekDay.FRIDAY:
        return 'FR';
      case WeekDay.SATURDAY:
        return 'SA';
      case WeekDay.SUNDAY:
        return 'SU';
    }
  }

  export function getValues(): WeekDay[] {
    return [
      WeekDay.MONDAY,
      WeekDay.TUESDAY,
      WeekDay.WEDNESDAY,
      WeekDay.THURSDAY,
      WeekDay.FRIDAY,
      WeekDay.SATURDAY,
      WeekDay.SUNDAY,
    ];
  }

  export function getShortValues(): WeekDay[] {
    return [
      WeekDay.MONDAY,
      WeekDay.TUESDAY,
      WeekDay.WEDNESDAY,
      WeekDay.THURSDAY,
      WeekDay.FRIDAY,
    ];
  }

  export function fromStr(dayStr: string): WeekDay {
    const day = mapping[dayStr.toLowerCase()];
    if (!day) {
      throw new NoSuchWeekDay(
        `No such week day: ${dayStr}. Valid week days: ${Object.keys(
          mapping,
        ).join(', ')}`,
      );
    }
    return day;
  }

  export function fromInt(dayInt: number): string {
    const dayStr = stringMapping[dayInt as WeekDay];
    if (dayStr === undefined) {
      throw new NoSuchWeekDay(
        `No such week day: ${dayInt}. Valid week days: ${Object.keys(
          stringMapping,
        ).join(', ')}`,
      );
    }
    return dayStr;
  }
}

export const WeekDaysDict = {
  0: 'Segunda',
  1: 'Terça',
  2: 'Quarta',
  3: 'Quinta',
  4: 'Sexta',
  5: 'Sábado',
  6: 'Domingo',
};

export const WeekDaysShortDict = {
  0: 'seg',
  1: 'ter',
  2: 'qua',
  3: 'qui',
  4: 'sex',
  5: 'sab',
  6: 'dom',
};

export type WeekDaysKeyNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type WeekDaysShortText =
  | 'seg'
  | 'ter'
  | 'qua'
  | 'qui'
  | 'sex'
  | 'sab'
  | 'dom';
