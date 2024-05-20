export interface CreateHoliday {
  category_id: string;
  date: string;
  type: string;
}

export interface UpdateHoliday extends CreateHoliday {}
