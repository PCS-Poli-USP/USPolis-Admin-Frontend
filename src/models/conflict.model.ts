import Event from './event.model';

export default interface Conflict {
  buildings: ByBuildingConflict[];
}

interface ByBuildingConflict {
  name: string;
  classrooms: ByClassroomConflict[];
}

interface ByClassroomConflict {
  name: string;
  week_days: ByWeekDayConflict[];
}

interface ByWeekDayConflict {
  name: string;
  events: Event[];
}
