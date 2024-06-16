export enum WeekDays {
  Sunday = 'dom',
  Monday = 'seg',
  Tuesday = 'ter',
  Wednesday = 'qua',
  Thursday = 'qui',
  Friday = 'sex',
  Saturday = 'sab',
}

export enum WeekDay {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
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
  const mapping: { [key: string]: WeekDay } = {
    seg: WeekDay.MONDAY,
    ter: WeekDay.TUESDAY,
    qua: WeekDay.WEDNESDAY,
    qui: WeekDay.THURSDAY,
    sex: WeekDay.FRIDAY,
    sab: WeekDay.SATURDAY,
    dom: WeekDay.SUNDAY,
  };

  const intMapping: { [key in WeekDay]: number } = {
    [WeekDay.MONDAY]: 1,
    [WeekDay.TUESDAY]: 2,
    [WeekDay.WEDNESDAY]: 3,
    [WeekDay.THURSDAY]: 4,
    [WeekDay.FRIDAY]: 5,
    [WeekDay.SATURDAY]: 6,
    [WeekDay.SUNDAY]: 0,
  };

  const reverseIntMapping: { [key: number]: WeekDay } = {
    0: WeekDay.MONDAY,
    1: WeekDay.TUESDAY,
    2: WeekDay.WEDNESDAY,
    3: WeekDay.THURSDAY,
    4: WeekDay.FRIDAY,
    5: WeekDay.SATURDAY,
    6: WeekDay.SUNDAY,
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

  export function toInt(day: WeekDay): number {
    return intMapping[day];
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
    const dayStr = reverseIntMapping[dayInt];
    if (dayStr === undefined) {
      throw new NoSuchWeekDay(
        `No such week day: ${dayInt}. Valid week days: ${Object.keys(
          reverseIntMapping,
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
