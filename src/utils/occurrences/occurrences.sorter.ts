import { OccurrenceResponse } from 'models/http/responses/occurrence.response.models';
import moment from 'moment';

export function sortOccurrencesResponse(
  A: OccurrenceResponse,
  B: OccurrenceResponse,
) {
  const dateA = moment(A.date);
  const dateB = moment(B.date);
  const startTimeA = moment(A.start_time, 'HH:mm');
  const startTimeB = moment(A.start_time, 'HH:mm');
  const endTimeA = moment(A.start_time, 'HH:mm');
  const endTimeB = moment(A.start_time, 'HH:mm');

  if (dateA.isBefore(dateB)) return -1;
  if (dateA.isAfter(dateB)) return 1;
  if (startTimeA.isBefore(startTimeB)) return -1;
  if (startTimeA.isAfter(startTimeB)) return 1;
  if (endTimeA.isBefore(endTimeB)) return -1;
  if (endTimeA.isAfter(endTimeB)) return 1;
  return 0;
}
