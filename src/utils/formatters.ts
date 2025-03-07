import moment from 'moment';

export function Capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function Textify(value: any) {
  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }

  return value?.toString();
}

// 2023-10-01 to 01-10-2023
export function FormatData(data: string) {
  const times = data.split('-');
  const reverseTimes = times.reverse();
  return reverseTimes.join('-');
}

export function datetimeToDate(date: string) {
  return moment(date).format('DD/MM/YYYY');
}

export function normalizeString(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(' ', '_');
}
