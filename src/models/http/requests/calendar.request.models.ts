export interface CreateCalendar {
  name: string;
  categories_ids?: number[];
}

export interface UpdateCalendar extends CreateCalendar {}
