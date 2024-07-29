import { HolidayCategoryResponse } from 'models/http/responses/holidayCategory.response.models';
import moment from 'moment';

export function holidayCategoryToString(
  category: HolidayCategoryResponse,
): string {
  if (category.holidays.length > 0) {
    const dates = category.holidays.map((holiday) =>
      `${holiday.name} - ${moment(holiday.date).format('DD/MM/YYYY')}`,
    );
    const datesString = dates.join(', ');
    return `${category.name}: ${datesString}`;
  }
  return `${category.name}: Nenhum feriado adicionado`;
}
