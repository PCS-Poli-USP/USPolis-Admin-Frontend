import { HolidayCategoryResponse } from './holidayCategory.response.models';

export interface CalendarResponse {
  id: number;
  name: string;
  categories: HolidayCategoryResponse[];
  created_by: string;
}
