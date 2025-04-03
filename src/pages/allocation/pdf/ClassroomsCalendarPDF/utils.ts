import { RecurrenceRule } from 'models/http/responses/allocation.response.models';
import { ScheduleResponse } from 'models/http/responses/schedule.response.models';
import moment from 'moment';
import { WeekDay } from 'utils/enums/weekDays.enum';

interface MergedScheduleResponse extends ScheduleResponse {
  titles: string[];
  subjects_codes: string[];
  classes_codes: string[];
}

interface MergedData {
  titles: string[];
  subjects_codes: string[];
  classes_codes: string[];
}

export interface MergedEventExtendedProps {
  merged_data?: MergedData;
}

export interface MergedEvent {
  id: string;
  title: string;
  start: string; // Must be YYYY-MM-DDTHH:mm:ss
  end: string; // Must be YYYY-MM-DDTHH:mm:ss

  classroom_id?: number;
  classroom?: string;
  classroom_capacity?: number;
  rrule?: RecurrenceRule; // Used when is unallocated
  allDay: boolean;

  resourceId: string;
  extendedProps: MergedEventExtendedProps;
}

function getStartForEvent(week_day: WeekDay): string {
  const start = moment()
    .startOf('week')
    .add(week_day + 1, 'days')
    .format('YYYY-MM-DD');
  return start;
}

function getSchedulessByWeekDay(
  schedules: ScheduleResponse[],
): Map<WeekDay, ScheduleResponse[]> {
  const weekDayMap: Map<WeekDay, ScheduleResponse[]> = new Map();
  schedules.forEach((schedule) => {
    if (schedule.week_day !== undefined) {
      const current = weekDayMap.get(schedule.week_day);
      if (current) {
        current.push(schedule);
        weekDayMap.set(schedule.week_day, current);
      } else {
        weekDayMap.set(schedule.week_day, [schedule]);
      }
    }
  });
  return weekDayMap;
}

function mergeSchedules(
  schedules: ScheduleResponse[],
): MergedScheduleResponse[] {
  const merged: MergedScheduleResponse[] = [];
  const weekDayMap = getSchedulessByWeekDay(schedules);
  weekDayMap.forEach((weekdaySchedules, week_day) => {
    const mergedMap: Map<string, MergedScheduleResponse> = new Map();
    weekdaySchedules.forEach((schedule) => {
      const key: string = `${schedule.start_time}-${schedule.end_time}`;
      const current = mergedMap.get(key);
      if (current) {
        if (schedule.reservation) current.titles.push(schedule.reservation);
        if (schedule.subject_code)
          current.subjects_codes.push(schedule.subject_code);
        if (schedule.class_code)
          current.classes_codes.push(schedule.class_code);
        mergedMap.set(key, current);
      } else {
        mergedMap.set(key, {
          ...schedule,
          titles: schedule.reservation ? [schedule.reservation] : [],
          subjects_codes: schedule.subject_code ? [schedule.subject_code] : [],
          classes_codes: schedule.class_code ? [schedule.class_code] : [],
        });
      }
    });
    mergedMap.forEach((schedule) => {
      merged.push(schedule);
    });
  });
  return merged;
}

export function ClassroomCalendarEventsFromSchedules(
  schedules: ScheduleResponse[],
): MergedEvent[] {
  const mergedSchedules = mergeSchedules(schedules);
  const events = mergedSchedules.reduce<MergedEvent[]>((acc, schedule) => {
    const title = 'Evento mesclado';
    acc.push({
      id: String(schedule.id), // Must be unique por every occurence
      title: title,
      start: `${
        schedule.week_day !== undefined
          ? getStartForEvent(schedule.week_day)
          : schedule.start_date
      }T${schedule.start_time}`,
      end: `${
        schedule.week_day !== undefined
          ? getStartForEvent(schedule.week_day)
          : schedule.end_date
      }T${schedule.end_time}`,
      // rrule: scheduleToRRule(schedule),
      classroom_id: schedule.classroom_id,
      classroom: schedule.classroom,
      allDay: schedule.all_day,
      resourceId: `${schedule.building}-${schedule.classroom}`,
      extendedProps: {
        merged_data: {
          titles: schedule.titles,
          subjects_codes: schedule.subjects_codes,
          classes_codes: schedule.classes_codes,
        },
      },
    });
    return acc;
  }, []);
  return events;
}
