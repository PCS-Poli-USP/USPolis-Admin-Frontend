import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import { sortHolidaysResponse } from 'utils/holidays/holidays.sorter';

export function sortHolidaysCategoriesResponse(
  A: HolidayCategoryResponse,
  B: HolidayCategoryResponse,
) {
  if (A.name < B.name) return -1;
  if (A.name > B.name) return 1;
  return 0;
}

export function sortAllHolidaysFromHolidaysCategories(
  categories: HolidayCategoryResponse[],
) {
  categories.forEach((category) =>
    category.holidays.sort(sortHolidaysResponse),
  );
}
