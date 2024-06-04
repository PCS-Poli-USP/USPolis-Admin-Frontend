import { HolidayCategory } from "./holidayCategory.common.models";

export interface Calendar {
  id: number;
  name: string;
  categories: HolidayCategory[];
}
