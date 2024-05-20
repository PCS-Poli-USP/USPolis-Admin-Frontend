import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';

export function sortHolidaysCategoriesResponse(
  A: HolidayCategoryResponse,
  B: HolidayCategoryResponse,
) {
  if (A.name < B.name) return -1;
  if (A.name > B.name) return 1;
  return 0;
}
