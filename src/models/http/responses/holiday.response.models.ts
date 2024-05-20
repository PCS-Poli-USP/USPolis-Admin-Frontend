import { HolidaysTypes } from "utils/enums/holidays.enums";

export interface HolidayResponse {
  id: string;
  category: string;
  date: string;
  type: HolidaysTypes;
  updated_at: string;
  created_by: string;
}
