export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const MONTH_LETTERS = [
  'J',
  'F',
  'M',
  'A',
  'M',
  'J',
  'J',
  'A',
  'S',
  'O',
  'N',
  'D',
];

export const WEEKDAY_LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export const WEEKDAY_SHORT_NAMES = [
  'dom',
  'seg',
  'ter',
  'qua',
  'qui',
  'sex',
  'sáb',
];

function pad(value: number) {
  return String(value).padStart(2, '0');
}

/**
 * Monta uma data ISO (YYYY-MM-DD) a partir de ano, mês (0-11) e dia.
 */
export function toISODate(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/**
 * Lê partes de uma data ISO sem passar por `new Date(string)`, evitando o
 * deslocamento de fuso horário que faria um feriado "voltar" um dia.
 */
export function getISOParts(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month: month - 1, day };
}

export function getISOMonth(date: string) {
  return getISOParts(date).month;
}

export function getISODay(date: string) {
  return getISOParts(date).day;
}

/**
 * Dia da semana (0 = domingo) de uma data ISO, calculado no fuso local.
 */
export function getISOWeekday(date: string) {
  const { year, month, day } = getISOParts(date);
  return new Date(year, month, day).getDay();
}

export function isoToBRDate(date: string) {
  const { year, month, day } = getISOParts(date);
  return `${pad(day)}/${pad(month + 1)}/${year}`;
}

export interface MonthCell {
  key: string;
  label: string;
  date?: string;
}

/**
 * Células de um mês para grades de calendário: começa com espaços em branco
 * até o primeiro dia da semana e segue até o último dia do mês.
 */
export function buildMonthCells(year: number, month: number): MonthCell[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: MonthCell[] = [];

  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ key: `blank-${month}-${i}`, label: '' });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = toISODate(year, month, day);
    cells.push({ key: date, label: String(day), date });
  }
  return cells;
}
