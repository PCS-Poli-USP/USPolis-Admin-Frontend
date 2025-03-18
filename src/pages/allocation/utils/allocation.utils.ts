import { ClassFullResponse } from 'models/http/responses/class.response.models';
import {
  Event,
  RecurrenceRule,
  Resource,
} from '../interfaces/allocation.interfaces';
import {
  ReservationFullResponse,
  ReservationResponse,
} from 'models/http/responses/reservation.response.models';
import { AllocationEnum } from 'utils/enums/allocation.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { ScheduleResponse } from 'models/http/responses/schedule.response.models';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { ReservationType } from 'utils/enums/reservations.enum';
import moment from 'moment';
import { ClassroomResponse } from 'models/http/responses/classroom.response.models';
import { BuildingResponse } from 'models/http/responses/building.response.models';

function scheduleToRRule(schedule: ScheduleResponse): RecurrenceRule {
  const byweekday: string[] = [];
  if (schedule.week_day) byweekday.push(WeekDay.toRRule(schedule.week_day));
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
export function EventsFromClasses(classes: ClassFullResponse[]): Event[] {
  const events: Event[] = [];
  classes.forEach((cls) => {
    const classEvents: Event[] = [];
    cls.schedules.forEach((schedule) => {
      if (schedule.occurrences.length > 0) {
        classEvents.push(
          ...schedule.occurrences.map<Event>((occur) => ({
            id: String(occur.id),
            title: cls.subject_code,
            start: `${occur.date}T${occur.start_time}`,
            end: `${occur.date}T${occur.end_time}`,
            allDay: schedule.all_day,
            resourceId: schedule.building
              ? schedule.classroom
                ? `${schedule.building}-${schedule.classroom}`
                : AllocationEnum.UNALLOCATED_CLASSROOM_ID
              : AllocationEnum.UNALLOCATED_CLASSROOM_ID,
            extendedProps: {
              class_data: {
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
                subscribers: cls.subscribers,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
              },
            },
          })),
        );
      } else {
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
              subscribers: cls.subscribers,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              start_date: schedule.start_date,
              end_date: schedule.end_date,
            },
          },
        });
      }
    });
    events.push(...classEvents);
  });
  return events;
}

// See docs https://fullcalendar.io/docs/v5/event-parsing
export function EventsFromReservations(
  reservations: ReservationFullResponse[],
): Event[] {
  const events = reservations.reduce<Event[]>(
    (acc, reservation) =>
      acc.concat(
        reservation.schedule.occurrences.map<Event>((occur) => ({
          id: String(occur.id), // Must be unique por every occurence
          title: `Reserva - ${reservation.title}`,
          start: `${occur.date}T${occur.start_time}`,
          end: `${occur.date}T${occur.end_time}`,
          allDay: reservation.schedule.all_day,
          resourceId: `${reservation.building_name}-${reservation.classroom_name}`,
          extendedProps: {
            reservation_data: {
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
              description: reservation.reason,
              created_by: reservation.created_by,
            },
          },
        })),
      ),
    [],
  );
  return events;
}

// See docs https://fullcalendar.io/docs/v5/resource-parsing
export function AllocationResourcesFromClasses(
  classes: ClassFullResponse[],
): Resource[] {
  const buildingResources: Resource[] = [];
  const classroomResources: Resource[] = [];
  classes.forEach((cls) => {
    cls.schedules.forEach((schedule) => {
      buildingResources.push({
        id: schedule.building
          ? schedule.building
          : AllocationEnum.UNALLOCATED_BUILDING_ID,
        title: schedule.building
          ? schedule.building
          : AllocationEnum.UNALLOCATED_BUILDING_ID,
      });
      classroomResources.push({
        id: schedule.building
          ? schedule.classroom
            ? `${schedule.building}-${schedule.classroom}`
            : AllocationEnum.UNALLOCATED_CLASSROOM_ID
          : AllocationEnum.UNALLOCATED_CLASSROOM_ID,
        parentId: schedule.building
          ? schedule.building
          : AllocationEnum.UNALLOCATED_BUILDING_ID,
        title: schedule.classroom
          ? schedule.classroom
          : AllocationEnum.UNALLOCATED_CLASSROOM_ID,
      });
    });
  });
  const uniqueBuildingResources = Array.from(
    new Map(buildingResources.map((obj) => [obj.id, obj])).values(),
  );
  const uniqueClassroomResources = Array.from(
    new Map(classroomResources.map((obj) => [obj.id, obj])).values(),
  );
  return [...uniqueBuildingResources, ...uniqueClassroomResources];
}

// See docs https://fullcalendar.io/docs/v5/resource-parsing
export function AllocationResourcesFromReservations(
  reservations: ReservationFullResponse[],
): Resource[] {
  const buildingResources: Resource[] = [];
  const classroomResources: Resource[] = [];
  reservations.forEach((reservation) => {
    buildingResources.push({
      id: reservation.building_name,
      title: reservation.building_name,
      eventTextColor: 'red.300',
    });
    classroomResources.push({
      id: `${reservation.building_name}-${reservation.classroom_name}`,
      parentId: reservation.building_name,
      title: reservation.classroom_name,
    });
  });
  const uniqueBuildingResources = Array.from(new Set(buildingResources));
  const uniqueClassroomResources = Array.from(new Set(classroomResources));
  return [...uniqueBuildingResources, ...uniqueClassroomResources];
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
      logs: [],
    },
  };
}
