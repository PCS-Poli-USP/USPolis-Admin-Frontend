import { HolidayResponse } from 'models/http/responses/holiday.response.models';

export function sortHolidaysResponse(A: HolidayResponse, B: HolidayResponse) {
  if (A.category > B.category) return 1;
  if (A.category < B.category) return -1;
  if (A.date > B.date) return 1;
  if (A.date < B.date) return -1;
  return 0;
}
