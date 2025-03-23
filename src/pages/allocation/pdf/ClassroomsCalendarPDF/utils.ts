import { ScheduleResponse } from 'models/http/responses/schedule.response.models';
import { EventExtendedProps } from 'models/http/responses/allocation.response.models';
import { AllocationEnum } from 'utils/enums/allocation.enum';
import { ReservationType } from 'utils/enums/reservations.enum';
import { Event } from 'pages/allocation/interfaces/allocation.interfaces';
import moment from 'moment';
import { WeekDay } from 'utils/enums/weekDays.enum';

function getExtendedPropsFromSchedule(
  schedule: ScheduleResponse,
): EventExtendedProps {
  if (schedule.class_code) {
    return {
      class_data: {
        schedule_id: schedule.id,
        code: schedule.class_code,
        subject_code: schedule.subject_code || '',
        subject_name: schedule.subject || '',
        building: schedule.building || AllocationEnum.UNALLOCATED,
        classroom: schedule.classroom || AllocationEnum.UNALLOCATED,
        allocated: schedule.allocated,
        professors: [],
        subscribers: 0,
        week_day: schedule.week_day,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        start_date: schedule.start_date,
        end_date: schedule.end_date,
        recurrence: schedule.recurrence,
        month_week: schedule.month_week,
      },
    };
  } else {
    return {
      reservation_data: {
        schedule_id: schedule.id,
        building: schedule.building || AllocationEnum.UNALLOCATED,
        classroom: schedule.classroom || AllocationEnum.UNALLOCATED,
        title: schedule.reservation || '',
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        start_date: schedule.start_date,
        end_date: schedule.end_date,
        recurrence: schedule.recurrence,
        month_week: schedule.month_week,
        created_by: '',
        type: ReservationType.OTHER,
      },
    };
  }
}

function getStartForEvent(week_day: WeekDay): string {
  const start = moment()
    .startOf('week')
    .add(week_day + 1, 'days')
    .format('YYYY-MM-DD');
  return start;
}

export function ClassroomCalendarEventsFromSchedules(
  schedules: ScheduleResponse[],
): Event[] {
  const events = schedules.reduce<Event[]>((acc, schedule) => {
    const title = schedule.reservation
      ? schedule.reservation
      : schedule.subject_code
      ? schedule.subject_code
      : 'Sem título';
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
      extendedProps: getExtendedPropsFromSchedule(schedule),
    });
    return acc;
  }, []);
  return events;
}
