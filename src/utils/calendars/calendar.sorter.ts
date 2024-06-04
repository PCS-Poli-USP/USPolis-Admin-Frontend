import { CalendarResponse } from 'models/http/responses/calendar.responde.models';

export function sortCalendarResponse(A: CalendarResponse, B: CalendarResponse) {
  if (A.name < B.name) return -1;
  if (A.name > B.name) return 1;
  return 0;
}
