export interface CreateHolidayCategory {
  name: string;
  year: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateHolidayCategory extends CreateHolidayCategory {}
