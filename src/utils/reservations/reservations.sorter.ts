import { ReservationResponseBase } from 'models/http/responses/reservation.response.models';

export function sortReservationsResponse(
  A: ReservationResponseBase,
  B: ReservationResponseBase,
) {
  if (A.building_name < B.building_name) return -1;
  if (A.building_name > B.building_name) return 1;
  if (A.classroom_name < B.classroom_name) return -1;
  if (A.classroom_name > B.classroom_name) return 1;
  if (A.title < B.title) return -1;
  if (A.title > B.title) return 1;
  return 0;
}
