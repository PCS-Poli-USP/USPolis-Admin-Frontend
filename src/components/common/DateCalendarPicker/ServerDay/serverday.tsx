import { Badge } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';

function ServerDay(
  props: PickersDayProps<Moment> & {
    selectedDays?: string[];
    occupiedDays?: string[];
  },
) {
  const {
    selectedDays = [],
    occupiedDays = [],
    day,
    outsideCurrentMonth,
    ...other
  } = props;

  const isSelected = !!selectedDays.find((val) => {
    const parsedDate = moment(val);
    return (
      parsedDate.date() === props.day.date() &&
      parsedDate.month() === props.day.month()
    );
  });
  const isOcupped = !!occupiedDays.find((val) => {
    const parsedDate = moment(val);
    return (
      parsedDate.date() === props.day.date() &&
      parsedDate.month() === props.day.month()
    );
  });

  return (
    <Badge
      key={props.day.toString()}
      overlap='circular'
      badgeContent={isSelected ? '✔️' : isOcupped ? '📅' : undefined}
    >
      <PickersDay
        {...other}
        disabled={isOcupped}
        disableHighlightToday={true}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

export default ServerDay;
