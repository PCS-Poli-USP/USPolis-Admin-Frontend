import { Badge } from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Moment } from "moment";

function ServerDay(
  props: PickersDayProps<Moment> & {
    highlightedDays?: [number, number][];
    ocuppedDays?: [number, number][];
  },
) {
  const {
    highlightedDays = [],
    ocuppedDays = [],
    day,
    outsideCurrentMonth,
    ...other
  } = props;

  const isSelected = !!highlightedDays.find(
    (val) => val[0] === props.day.date() && val[1] === props.day.month(),
  );
  const isOcupped = !!ocuppedDays.find(
    (val) => val[0] === props.day.date() && val[1] === props.day.month(),
  );

  return (
    <Badge
      key={props.day.toString()}
      overlap='circular'
      badgeContent={isSelected ? '✔️' : undefined}
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