import { ReservationResponse } from 'models/http/responses/reservation.response.models';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { ReservationType } from 'utils/enums/reservations.enum';
import moment from 'moment';
import { ClassroomResponse } from 'models/http/responses/classroom.response.models';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import { ClassResponse } from 'models/http/responses/class.response.models';
import { Event } from '../interfaces/allocation.interfaces';
import { RecurrenceRule } from 'models/http/responses/allocation.response.models';
import { ScheduleResponse } from 'models/http/responses/schedule.response.models';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { AllocationEnum } from 'utils/enums/allocation.enum';

export function scheduleToRRule(schedule: ScheduleResponse): RecurrenceRule {
  const byweekday: string[] = [];
  if (schedule.week_day !== undefined)
    byweekday.push(WeekDay.toRRule(schedule.week_day));
  if (schedule.recurrence === Recurrence.DAILY)
    byweekday.push('MO', 'TH', 'WE', 'TU', 'FR');

  return {
    dtstart: `${schedule.start_date}T${schedule.start_time}`,
    until: `${schedule.end_date}T${schedule.end_time}`,
    freq: Recurrence.toRRule(schedule.recurrence),
    interval: Recurrence.toRRuleInterval(schedule.recurrence),
    byweekday: byweekday,
    bysetpos: schedule.month_week ? schedule.month_week : undefined,
  };
}

// See docs https://fullcalendar.io/docs/v5/event-parsing
export function EventsFromClasses(classes: ClassResponse[]): Event[] {
  const events: Event[] = [];
  classes.forEach((cls) => {
    const classEvents: Event[] = [];
    cls.schedules.forEach((schedule) => {
      classEvents.push({
        id: String(schedule.id),
        title: cls.subject_code,
        start: `${schedule.start_date}T${schedule.start_time}`,
        end: `${schedule.end_date}T${schedule.end_time}`,
        rrule: scheduleToRRule(schedule),
        allDay: schedule.all_day,
        resourceId: schedule.building
          ? schedule.classroom
            ? `${schedule.building}-${schedule.classroom}`
            : AllocationEnum.UNALLOCATED_CLASSROOM_ID
          : AllocationEnum.UNALLOCATED_CLASSROOM_ID,
        extendedProps: {
          class_data: {
            schedule_id: schedule.id,
            building: schedule.building
              ? schedule.building
              : AllocationEnum.UNALLOCATED,
            classroom: schedule.classroom
              ? schedule.classroom
              : AllocationEnum.UNALLOCATED,
            code: cls.code,
            subject_code: cls.subject_code,
            subject_name: cls.subject_name,
            allocated: schedule.allocated,
            recurrence: schedule.recurrence,
            week_day: schedule.week_day,
            month_week: schedule.month_week,
            professors: cls.professors,
            vacancies: cls.vacancies,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            start_date: schedule.start_date,
            end_date: schedule.end_date,
          },
        },
      });
    });
    events.push(...classEvents);
  });
  return events;
}

// See docs https://fullcalendar.io/docs/v5/event-parsing
export function EventsFromReservations(
  reservations: ReservationResponse[],
): Event[] {
  const events = reservations.reduce<Event[]>((acc, reservation) => {
    const schedule = reservation.schedule;
    acc.push({
      id: String(schedule.id), // Must be unique por every occurence
      title: `Reserva - ${reservation.title}`,
      start: `${schedule.start_date}T${schedule.start_time}`,
      end: `${schedule.end_date}T${schedule.end_time}`,
      rrule: scheduleToRRule(schedule),
      classroom_id: reservation.classroom_id,
      classroom: reservation.classroom_name,
      allDay: reservation.schedule.all_day,
      resourceId: `${reservation.building_name}-${reservation.classroom_name}`,
      extendedProps: {
        reservation_data: {
          schedule_id: reservation.schedule_id,
          building: reservation.schedule.building
            ? reservation.schedule.building
            : AllocationEnum.UNALLOCATED,
          classroom: reservation.schedule.classroom
            ? reservation.schedule.classroom
            : AllocationEnum.UNALLOCATED,
          title: reservation.title,
          type: reservation.type,
          recurrence: reservation.schedule.recurrence,
          week_day: reservation.schedule.week_day,
          month_week: reservation.schedule.month_week,
          start_time: reservation.schedule.start_time,
          end_time: reservation.schedule.end_time,
          start_date: reservation.schedule.start_date,
          end_date: reservation.schedule.end_date,
          created_by: reservation.created_by,
        },
      },
    });
    return acc;
  }, []);
  return events;
}

export function EventsFromSchedules(schedules: ScheduleResponse[]): Event[] {
  const events = schedules.reduce<Event[]>((acc, schedule) => {
    const title = schedule.reservation
      ? schedule.reservation
      : schedule.class_code
      ? schedule.class_code
      : 'Sem título';
    acc.push({
      id: String(schedule.id), // Must be unique por every occurence
      title: title,
      start: `${schedule.start_date}T${schedule.start_time}`,
      end: `${schedule.end_date}T${schedule.end_time}`,
      rrule: scheduleToRRule(schedule),
      classroom_id: schedule.classroom_id,
      classroom: schedule.classroom,
      allDay: schedule.all_day,
      resourceId: `${schedule.building}-${schedule.classroom}`,
      extendedProps: {},
    });
    return acc;
  }, []);
  return events;
}

export function loadReservationForDataClick(
  classroom: string,
  building: string,
  date: string,
  classrooms: ClassroomResponse[],
  buildings: BuildingResponse[],
): ReservationResponse {
  return {
    id: 0,
    title: '',
    type: ReservationType.OTHER,
    updated_at: '',
    building_id:
      buildings.find((building_) => building_.name === building)?.id || 0,
    building_name: building,
    classroom_id:
      classrooms.find((classroom_) => classroom_.name === classroom)?.id || 0,
    classroom_name: classroom,
    schedule_id: 0,
    created_by_id: 0,
    created_by: '',
    has_solicitation: false,
    solicitation_id: undefined,
    schedule: {
      id: 0,
      week_day: undefined,
      month_week: undefined,
      start_date: moment(date).format('YYYY-MM-DD'),
      end_date: moment(date).format('YYYY-MM-DD'),
      start_time: moment(date).format('HH:mm'),
      end_time: moment(date).add(1, 'hour').format('HH:mm'),
      allocated: true,
      all_day: false,
      recurrence: Recurrence.CUSTOM,
      occurrences: [
        {
          id: 0,
          date: moment(date).format('YYYY-MM-DD'),
          start_time: moment(date).format('HH:mm'),
          end_time: moment(date).add(1, 'hour').format('HH:mm'),
          classroom_id: 0,
          classroom: classroom,
        },
      ],
      last_log: undefined,
    },
  };
}
