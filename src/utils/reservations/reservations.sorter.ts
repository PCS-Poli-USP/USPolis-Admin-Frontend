import { ReservationResponse } from 'models/http/responses/reservation.response.models';

export function sortReservationsResponse(
  A: ReservationResponse,
  B: ReservationResponse,
) {
  if (A.building_name < B.building_name) return -1;
  if (A.building_name > B.building_name) return 1;
  if (A.classroom_name < B.classroom_name) return -1;
  if (A.classroom_name > B.classroom_name) return 1;
  if (A.name < B.name) return -1;
  if (A.name > B.name) return 1;
  return 0;
}
