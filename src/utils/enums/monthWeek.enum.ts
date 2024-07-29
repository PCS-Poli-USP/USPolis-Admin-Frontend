export enum MonthWeek {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  LAST = -1,
}

// Classe de exceção personalizada
export class NoSuchMonthWeek extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoSuchMonthWeek';
  }
}

// Função de mapeamento dentro de um namespace
export namespace MonthWeek {
  const stringMapping: { [key in MonthWeek]: string } = {
    [MonthWeek.FIRST]: 'First',
    [MonthWeek.SECOND]: 'Second',
    [MonthWeek.THIRD]: 'Third',
    [MonthWeek.LAST]: 'Last',
  };

  const stringOrdinalMapping: { [key in MonthWeek]: string } = {
    [MonthWeek.FIRST]: '1º',
    [MonthWeek.SECOND]: '2º',
    [MonthWeek.THIRD]: '3º',
    [MonthWeek.LAST]: '4º',
  };

  const intMapping: { [key in MonthWeek]: number } = {
    [MonthWeek.FIRST]: 1,
    [MonthWeek.SECOND]: 2,
    [MonthWeek.THIRD]: 3,
    [MonthWeek.LAST]: -1,
  };

  const translations: { [key in MonthWeek]: string } = {
    [MonthWeek.FIRST]: 'Primeira',
    [MonthWeek.SECOND]: 'Segunda',
    [MonthWeek.THIRD]: 'Terceira',
    [MonthWeek.LAST]: 'Última',
  };

  export function translate(day: MonthWeek): string {
    return translations[day];
  }

  export function toString(day: MonthWeek): string {
    return stringMapping[day];
  }

  export function toInt(day: MonthWeek): number {
    return intMapping[day];
  }

  export function toOrdinal(day: MonthWeek): string {
    return stringOrdinalMapping[day];
  }

  export function getValues(): MonthWeek[] {
    return [MonthWeek.FIRST, MonthWeek.SECOND, MonthWeek.THIRD, MonthWeek.LAST];
  }
}
