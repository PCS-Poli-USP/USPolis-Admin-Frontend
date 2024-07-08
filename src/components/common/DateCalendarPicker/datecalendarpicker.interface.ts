export interface DateCalendarPickerProps {
  selectedDays: string[];
  highlightedDays: string[];
  occupiedDays: string[];
  dayClick: (day: string) => void;
  selectIcon?: string;
  highlightIcon?: string;
  readOnly?: boolean;
  disabled?: boolean;
}
