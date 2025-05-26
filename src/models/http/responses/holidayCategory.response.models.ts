import { HolidayResponse } from './holiday.response.models';

export interface HolidayCategoryResponse {
  id: number;
  owner_id: number;
  name: string;
  year: number;
  created_by: string;
  holidays: HolidayResponse[];
}
