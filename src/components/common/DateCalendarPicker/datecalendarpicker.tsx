import { DateCalendar, DayCalendarSkeleton } from '@mui/x-date-pickers';
import ServerDay from './ServerDay/serverday';
import moment, { Moment } from 'moment';
import { sortDates } from 'utils/holidays/holidays.sorter';
import { DateCalendarPickerProps } from './datecalendarpicker.interface';
import { useDateCalendarPicker } from './hooks/useDateCalendarPicker';

function DateCalendarPicker(props: DateCalendarPickerProps) {
  const { selectedDates, setSelectedDates, highlightedDays, setHighlightedDays, ocuppedDays } =
    useDateCalendarPicker();

  return (
    <DateCalendar
      renderLoading={() => <DayCalendarSkeleton />}
      showDaysOutsideCurrentMonth
      slots={{
        day: ServerDay,
      }}
      slotProps={{
        day: {
          highlightedDays,
          ocuppedDays,
        } as any,
      }}
      onChange={(newValue: Moment) => {
        const newDates = [...selectedDates];
        const newHighlightedDays = [...highlightedDays];
        const date = moment(newValue).format('YYYY-MM-DDTHH:mm:ss');
        const index = newDates.findIndex((value) => value === date);
        if (index >= 0) {
          newDates.splice(index, 1);
          const highlightIndex = newHighlightedDays.findIndex((val) => {
            const parsedDate = moment(val);
            return (
              parsedDate.date() === newValue.date() &&
              parsedDate.month() === newValue.month()
            );
          });
          newHighlightedDays.splice(highlightIndex, 1);
        } else {
          newDates.push(date);
          newHighlightedDays.push(newValue.format('YYYY-MM-DDTHH:mm:ss'));
        }
        setHighlightedDays(newHighlightedDays);
        setSelectedDates(newDates.sort(sortDates));
      }}
    />
  );
}

export default DateCalendarPicker;
