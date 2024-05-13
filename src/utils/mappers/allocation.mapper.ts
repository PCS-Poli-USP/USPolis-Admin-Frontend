import { EventRenderRange } from '@fullcalendar/react';
import { Classrooms } from 'models/enums/clasrooms.enum';
import { WeekDays } from 'models/enums/weekDays.enum';
import Event, { EventByClassrooms } from 'models/database/event.model';

export function AllocationEventsMapper(allocation: Event[]) {
  return allocation.map((it) => ({
    title: it.subject_code,
    daysOfWeek: [WeekDayInt(it.week_day)],
    startTime: it.start_time,
    endTime: it.end_time,
    startRecur: it.start_period,
    endRecur: it.end_period,
    resourceId: it.classroom || Classrooms.UNALLOCATED,
    extendedProps: {
      id: it.id,
      building: it.building,
      class_code: it.class_code,
      subject_code: it.subject_code,
      subject_name: it.subject_name,
      classroom: it.classroom || Classrooms.UNALLOCATED,
      has_to_be_allocated: it.has_to_be_allocated,
      professors: it.professors,
      start_time: it.start_time,
      end_time: it.end_time,
      week_day: it.week_day,
      class_code_text: ClassCodeText(it.class_code),
      subscribers: it.subscribers,
    },
  }));
}

export function WeekDayInt(weekDay: string) {
  switch (weekDay) {
    default:
    case WeekDays.Sunday:
      return 0;
    case WeekDays.Monday:
      return 1;
    case WeekDays.Tuesday:
      return 2;
    case WeekDays.Wednesday:
      return 3;
    case WeekDays.Thursday:
      return 4;
    case WeekDays.Friday:
      return 5;
    case WeekDays.Saturday:
      return 6;
  }
}

export function ClassCodeText(classCode: string) {
  const classCodeInt = parseInt(classCode.slice(-2));
  return `Turma ${classCodeInt}`;
}

export function AllocationResourcesFromEventsMapper(allocation: Event[]) {
  return Array.from(
    new Set(
      allocation.map((it) => ({
        building: it.building,
        id: it.classroom || Classrooms.UNALLOCATED,
      })),
    ),
  );
}

function EventsRenderRangeEventsByClassroomsMapper(
  events: EventRenderRange[],
): EventByClassrooms[] {
  return events.map(({ def: { title, extendedProps, resourceIds } }) => {
    return {
      subject_code: title,
      id: extendedProps?.id,
      subject_name: extendedProps?.subject_name,
      classroom: resourceIds?.at(0) as string,
      building: extendedProps?.building,
      has_to_be_allocated: extendedProps?.has_to_be_allocated,
      class_code: extendedProps?.class_code,
      professors: extendedProps?.professors,
      start_time: extendedProps?.start_time,
      end_time: extendedProps?.end_time,
      week_day: extendedProps?.week_day,
      class_code_text: extendedProps?.class_code_text,
      subscribers: extendedProps?.subscribers,
    };
  });
}

export function EventsByClassroomMapper(events: EventRenderRange[]) {
  const mapData = EventsRenderRangeEventsByClassroomsMapper(events).reduce(
    (group: Map<string, EventByClassrooms[]>, event) => {
      const { classroom } = event;
      const classroomClasses = group.get(classroom);
      classroomClasses
        ? group.set(classroom, classroomClasses.concat(event))
        : group.set(classroom, [event]);

      return group;
    },
    new Map(),
  );

  // order events by day/time
  mapData.forEach((value) =>
    value.sort((a, b) => {
      const firstMinusSecond = WeekDayInt(a.week_day) - WeekDayInt(b.week_day);
      if (firstMinusSecond > 0) {
        return 1;
      } else if (firstMinusSecond === 0) {
        return a.start_time > b.end_time ? 1 : -1;
      } else return -1; // firstMinusSecond < 0
    }),
  );

  const orderedByEventsCount = Array.from(mapData).sort(
    ([_classroomA, dataA], [_classroomB, dataB]) => dataB.length - dataA.length,
  );
  return orderedByEventsCount;
}

export function ClassEventsMapper(
  events: EventRenderRange[],
  classCode: string,
  subjectCode: string,
) {
  return EventsRenderRangeEventsByClassroomsMapper(events).filter(
    (it) => it.class_code === classCode && it.subject_code === subjectCode,
  );
}

export function FirstEventDate(events: Event[]) {
  return events.reduce((acc, cur) => {
    const accDate = Date.parse(acc);
    const curDate = Date.parse(cur.start_period);
    if (accDate < curDate) return cur.start_period;
    return acc;
  }, new Date().toISOString());
}

export function WeekDayText(weekDay: string) {
  switch (weekDay) {
    default:
    case WeekDays.Sunday:
      return 'Domingo';
    case WeekDays.Monday:
      return 'Segunda';
    case WeekDays.Tuesday:
      return 'Terça';
    case WeekDays.Wednesday:
      return 'Quarta';
    case WeekDays.Thursday:
      return 'Quinta';
    case WeekDays.Friday:
      return 'Sexta';
    case WeekDays.Saturday:
      return 'Sábado';
  }
}

export function EventsByWeekDay(
  events: EventByClassrooms[],
): EventByClassrooms[][] {
  const eventsByWeekDay: EventByClassrooms[][] = [[], [], [], [], [], [], []];
  for (let i = 0; i < events.length; i++) {
    if (events[i].week_day === WeekDays.Monday)
      eventsByWeekDay[0].push(events[i]);
    if (events[i].week_day === WeekDays.Tuesday)
      eventsByWeekDay[1].push(events[i]);
    if (events[i].week_day === WeekDays.Wednesday)
      eventsByWeekDay[2].push(events[i]);
    if (events[i].week_day === WeekDays.Thursday)
      eventsByWeekDay[3].push(events[i]);
    if (events[i].week_day === WeekDays.Friday)
      eventsByWeekDay[4].push(events[i]);
    if (events[i].week_day === WeekDays.Saturday)
      eventsByWeekDay[5].push(events[i]);
    if (events[i].week_day === WeekDays.Sunday)
      eventsByWeekDay[6].push(events[i]);
  }
  return eventsByWeekDay;
}
