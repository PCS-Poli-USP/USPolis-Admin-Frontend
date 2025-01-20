import { Row } from '@tanstack/react-table';
import { ClassResponse } from 'models/http/responses/class.response.models';
import { ReservationResponse } from 'models/http/responses/reservation.response.models';

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
  return arrayValue.some((it) =>
    it.toLowerCase().includes(value.toLowerCase()),
  );
}

export function FilterClassroom(
  row: Row<any>,
  columnId: string,
  value: string,
) {
  const arrayValue: string[] = row.getValue(columnId);
  if (
    arrayValue.length === 0 &&
    'Não alocada'.toLowerCase().includes(value.toLowerCase())
  )
    return true;
  return arrayValue.some((it) =>
    it.toLowerCase().includes(value.toLowerCase()),
  );
}

export function FilterBuilding(row: Row<any>, columnId: string, value: string) {
  const arrayValue: string[] = row.getValue(columnId);
  if (
    arrayValue.length === 0 &&
    'Não alocada'.toLowerCase().includes(value.toLowerCase())
  )
    return true;
  return arrayValue.some((it) =>
    it.toLowerCase().includes(value.toLowerCase()),
  );
}

export function FilterClassCode(
  row: Row<ClassResponse>,
  columnId: string,
  value: string,
) {
  const code: string = row.getValue(columnId);
  if (code.length === 0) return true;
  return code.slice(-2).toLowerCase().includes(value.toLowerCase());
}

export function FilterRequester(
  row: Row<ReservationResponse>,
  columnId: string,
  value: string,
) {
  const requester: string = row.getValue(columnId);
  if (!requester) {
    return row.original.created_by.toLowerCase().includes(value.toLowerCase());
  }
  return requester.toLowerCase().includes(value.toLowerCase());
}
