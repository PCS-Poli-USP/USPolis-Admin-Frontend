import { Row } from '@tanstack/react-table';
import { ClassResponse } from '../../models/http/responses/class.response.models';
import { ReservationResponse } from '../../models/http/responses/reservation.response.models';
import { classNumberFromClassCode } from '../../utils/classes/classes.formatter';
import { filterString, filterStringArray } from '../../utils/filters';
import { normalizeString } from '../../utils/formatters';

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
    normalizeString(it).includes(normalizeString(value)),
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
    normalizeString('Não alocada').includes(normalizeString(value))
  )
    return true;
  return filterStringArray(arrayValue, value);
}

export function FilterBuilding(row: Row<any>, columnId: string, value: string) {
  const arrayValue: string[] = row.getValue(columnId);
  if (
    arrayValue.length === 0 &&
    'Não alocada'.toLowerCase().includes(value.toLowerCase())
  )
    return true;
  return filterStringArray(arrayValue, value);
}

export function FilterClassCode(
  row: Row<ClassResponse>,
  columnId: string,
  value: string,
) {
  const code: string = classNumberFromClassCode(row.getValue(columnId));
  if (code.length === 0) return true;
  return code.includes(value.toLowerCase());
}

export function FilterString(row: Row<any>, columnId: string, value: string) {
  const str: string = row.getValue(columnId);
  return filterString(str, value);
}

export function FilterRequester(
  row: Row<ReservationResponse>,
  columnId: string,
  value: string,
) {
  const requester: string = row.getValue(columnId);
  if (!requester) {
    return filterString(row.original.created_by, value);
  }
  return filterString(requester, value);
}
