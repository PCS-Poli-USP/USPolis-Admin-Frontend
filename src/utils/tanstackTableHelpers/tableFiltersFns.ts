import { Row } from '@tanstack/react-table';

export function FilterBoolean(row: Row<any>, columnId: string, value: string) {
  const booleanFromStringValue = value === 'true';
  return row.getValue(columnId) === booleanFromStringValue;
}

export function FilterNumber(row: Row<any>, columnId: string, value: string) {
  const numberFromStringValue = parseInt(value);
  return row.getValue(columnId) === numberFromStringValue;
}

export function FilterArray(row: Row<any>, columnId: string, value: string) {
  const arrayValue: string[] = row.getValue(columnId);
  return arrayValue.some((it) => it.toLowerCase().includes(value.toLowerCase()));
}
