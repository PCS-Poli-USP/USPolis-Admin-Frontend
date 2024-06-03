export interface CreateHoliday {
  category_id: number;
  date: string;
}

export interface CreateManyHolidays {
  category_id: number;
  dates: string[];
}

export interface UpdateHoliday extends CreateHoliday {}
