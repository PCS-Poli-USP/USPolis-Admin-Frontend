import { DateCalendar, DayCalendarSkeleton } from '@mui/x-date-pickers';
import ServerDay from './ServerDay/serverday';
import moment, { Moment } from 'moment';
import { DateCalendarPickerProps } from './datecalendarpicker.interface';

function DateCalendarPicker(props: DateCalendarPickerProps) {
  const currentYear = moment().year();
  const minDate = moment({ year: currentYear, month: 0, day: 1 }); // Janeiro 1º do ano atual
  const maxDate = moment({ year: currentYear, month: 11, day: 31 }); // Dezembro 31 do ano atual
  return (
    <DateCalendar
      minDate={minDate}
      maxDate={maxDate}
      views={['day']}
      renderLoading={() => <DayCalendarSkeleton />}
      showDaysOutsideCurrentMonth
      slots={{
        day: ServerDay,
      }}
      slotProps={{
        day: {
          selectedDays: props.selectedDays,
          occupiedDays: props.occupiedDays,
        } as any,
      }}
      onChange={(newValue: Moment) => {
        if (!!props.isVisualization) return;
        const date = moment(newValue).format('YYYY-MM-DD');
        props.dayClick(date);
      }}
    />
  );
}

export default DateCalendarPicker;
