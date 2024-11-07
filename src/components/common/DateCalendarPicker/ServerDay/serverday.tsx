import { Badge } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';

function ServerDay(
  props: PickersDayProps<Moment> & {
    selectedDays?: string[];
    highlightedDays?: string[];
    occupiedDays?: string[];
    selectIcon?: string;
    highlightIcon?: string;
  },
) {
  const {
    selectedDays = [],
    highlightedDays = [],
    occupiedDays = [],
    selectIcon = undefined,
    highlightIcon = undefined,
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
  const isHighlight = !!highlightedDays.find((val) => {
    const parsedDate = moment(val);
    return (
      parsedDate.date() === props.day.date() &&
      parsedDate.month() === props.day.month()
    );
  })
  const isOcupped = !!occupiedDays.find((val) => {
    const parsedDate = moment(val);
    return (
      parsedDate.date() === props.day.date() &&
      parsedDate.month() === props.day.month()
    );
  });
  
  const sIcon = selectIcon ? selectIcon : '✔️'
  const hIcon = highlightIcon ? highlightIcon : '📅'

  return (
    <Badge
      key={props.day.toString()}
      overlap='circular'
      badgeContent={isSelected ? sIcon : isHighlight ? hIcon : undefined}
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
