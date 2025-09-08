import { AudiovisualType } from '../../../utils/enums/audiovisualType.enum';
import { MonthWeek } from '../../../utils/enums/monthWeek.enum';
import { Recurrence } from '../../../utils/enums/recurrence.enum';
import { WeekDay } from '../../../utils/enums/weekDays.enum';

export interface CreateClassroom {
  name: string;
  building_id: number;
  group_ids: number[];
  floor: number;
  capacity: number;
  air_conditioning: boolean;
  audiovisual: AudiovisualType;
  accessibility: boolean;
  observation: string;
  reservable: boolean;
  remote: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateClassroom extends CreateClassroom {}

export interface ClassroomConflictParams{
  start_time: string;
  end_time: string;
  recurrence: Recurrence;
  dates?: string[];
  start_date?: string;
  end_date?: string;
  week_day?: WeekDay;
  month_week?: MonthWeek;
}
