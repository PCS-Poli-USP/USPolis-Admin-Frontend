import { DateCalendar, DayCalendarSkeleton } from "@mui/x-date-pickers";
import ServerDay from "./ServerDay";
import { useState } from "react";
import moment, { Moment } from "moment";
import { sortDates } from "utils/holidays/holidays.sorter";


function DateCalendarPicker(props: any) {
  const [isMultipleHolidays, setIsMultipleHolidays] = useState(false);
  const [dates, setDates] = useState<string[]>([]);
  const [highlightedDays, setHighlightedDays] = useState<[number, number][]>(
    [],
  );
  const [ocuppedDays, setOcuppedDays] = useState<[number, number][]>([]);

  return (<DateCalendar
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
      const newDates = [...dates];
      const newHighlightedDays = [...highlightedDays];
      const date = moment(newValue).format(
        'YYYY-MM-DDTHH:mm:ss',
      );
      const index = newDates.findIndex(
        (value) => value === date,
      );
      if (index >= 0) {
        newDates.splice(index, 1);
        const highlightIndex = newHighlightedDays.findIndex(
          (val) =>
            val[0] === newValue.date() &&
            val[1] === newValue.month(),
        );
        newHighlightedDays.splice(highlightIndex, 1);
      } else {
        newDates.push(date);
        newHighlightedDays.push([
          newValue.date(),
          newValue.month(),
        ]);
      }
      setHighlightedDays(newHighlightedDays);
      setDates(newDates.sort(sortDates));
    }}
  />);
}

export default DateCalendarPicker;