export interface CreateCalendar {
  name: string;
  year: number;
  categories_ids?: number[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateCalendar extends CreateCalendar {}
