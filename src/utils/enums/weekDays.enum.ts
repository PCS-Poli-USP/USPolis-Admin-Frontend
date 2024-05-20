export enum WeekDays {
  Sunday = 'dom',
  Monday = 'seg',
  Tuesday = 'ter',
  Wednesday = 'qua',
  Thursday = 'qui',
  Friday = 'sex',
  Saturday = 'sab',
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
export type WeekDaysShortText = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';
