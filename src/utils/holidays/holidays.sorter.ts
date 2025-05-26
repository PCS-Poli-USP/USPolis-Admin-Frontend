import { HolidayResponse } from '../../models/http/responses/holiday.response.models';

export function sortHolidaysResponse(A: HolidayResponse, B: HolidayResponse) {
  if (A.category > B.category) return 1;
  if (A.category < B.category) return -1;
  if (A.date > B.date) return 1;
  if (A.date < B.date) return -1;
  return 0;
}

export function sortDates(A: string, B: string) {
  const A_DATE = new Date(A);
  const B_DATE = new Date(B);
  if (A_DATE < B_DATE) return -1;
  if (A_DATE > B_DATE) return 1;
  return 0;
}
