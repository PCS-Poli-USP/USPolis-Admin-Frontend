export interface DateCalendarPickerProps {
  selectedDays: string[];
  occupiedDays: string[];
  dayClick: (day: string) => void;
  readOnly?: boolean;
}
