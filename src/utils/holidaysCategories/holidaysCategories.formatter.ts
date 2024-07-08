import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import moment from 'moment';
import { sortHolidaysUnfetchResponse } from 'utils/holidays/holidays.sorter';

export function holidayCategoryToString(
  category: HolidayCategoryResponse,
): string {
  if (category.holidays.length > 0) {
    category.holidays.sort(sortHolidaysUnfetchResponse);
    const dates = category.holidays.map((holiday) =>
      moment(holiday.date).format('DD/MM/YYYY'),
    );
    const datesString = dates.join(', ');
    return `${category.name} - ${datesString}`;
  }
  return `${category.name} - Nenhum feriado adicionado`;
}
