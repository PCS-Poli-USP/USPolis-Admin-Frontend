import { HolidayResponse } from './holiday.response.models';

export interface HolidayCategoryResponse {
  id: number;
  owner_id: number;
  name: string;
  created_by: string;
  holidays: HolidayResponse[];
}
