export interface CreateHoliday {
  category_id: number;
  date: string;
}

export interface UpdateHoliday extends CreateHoliday {}
