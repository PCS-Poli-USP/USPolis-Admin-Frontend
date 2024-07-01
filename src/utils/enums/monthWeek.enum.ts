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

  export function getValues(): MonthWeek[] {
    return [
      MonthWeek.FIRST,
      MonthWeek.SECOND,
      MonthWeek.THIRD,
      MonthWeek.LAST,
    ];
  }

}
