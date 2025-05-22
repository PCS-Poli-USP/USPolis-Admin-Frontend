import { Row } from '@tanstack/react-table';
import moment from 'moment';

function getPeriodFromString(value: string): string[] {
  const regex = /(\d{2}\/\d{2}\/\d{4})/g;
  return [...value.matchAll(regex).map((val) => val[0])];
}

export function SortPeriodFn(
  rowA: Row<any>,
  rowB: Row<any>,
  columnId: string,
): number {
  const str: string = rowA.getValue(columnId);
  const str2: string = rowB.getValue(columnId);
  const periodA = getPeriodFromString(str);
  const periodB = getPeriodFromString(str2);
  const startA = moment(periodA[0], 'DD/MM/YYYY').toDate();
  const startB = moment(periodB[0], 'DD/MM/YYYY').toDate();
  const endA = moment(periodA[1], 'DD/MM/YYYY').toDate();
  const endB = moment(periodB[1], 'DD/MM/YYYY').toDate();
  if (startA < startB) return -1;
  if (startA > startB) return 1;
  if (endA < endB) return -1;
  if (endA > endB) return 1;
  return 0;
}
