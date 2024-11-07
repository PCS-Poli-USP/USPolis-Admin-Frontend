export interface CreateHoliday {
  category_id: number;
  date: string;
  name: string;
}

export interface CreateManyHolidays {
  category_id: number;
  dates: string[];
  name: string;
}

export interface UpdateHoliday extends CreateHoliday {}
