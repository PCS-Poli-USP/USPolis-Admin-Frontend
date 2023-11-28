import { EventRenderRange } from '@fullcalendar/react';
import { Classrooms } from 'models/enums/clasrooms.enum';
import { WeekDays } from 'models/enums/weekDays.enum';
import Event, { EventByClassrooms } from 'models/event.model';

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
      building: it.building,
      classCode: it.class_code,
      subjectCode: it.subject_code,
      classroom: it.classroom || Classrooms.UNALLOCATED,
      professors: it.professors,
      startTime: it.start_time,
      endTime: it.end_time,
      weekday: it.week_day,
      classCodeText: ClassCodeText(it.class_code),
      subscribers: it.subscribers,
    },
  }));
}

function WeekDayInt(weekDay: string) {
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
    new Set(allocation.map((it) => ({ building: it.building, id: it.classroom || Classrooms.UNALLOCATED }))),
  );
}

function EventsRenderRangeEventsByClassroomsMapper(events: EventRenderRange[]): EventByClassrooms[] {
  return events.map(({ def: { title, extendedProps, resourceIds } }) => ({
    subjectCode: title,
    classroom: resourceIds?.at(0) as string,
    building: extendedProps?.building,
    classCode: extendedProps?.classCode,
    professors: extendedProps?.professors,
    startTime: extendedProps?.startTime,
    endTime: extendedProps?.endTime,
    weekday: extendedProps?.weekday,
    classCodeText: extendedProps?.classCodeText,
    subscribers: extendedProps?.subscribers,
  }));
}

export function EventsByClassroomMapper(events: EventRenderRange[]) {
  const mapData = EventsRenderRangeEventsByClassroomsMapper(events).reduce(
    (group: Map<string, EventByClassrooms[]>, event) => {
      const { classroom } = event;
      const classroomClasses = group.get(classroom);
      classroomClasses ? group.set(classroom, classroomClasses.concat(event)) : group.set(classroom, [event]);

      return group;
    },
    new Map(),
  );

  // order events by day/time
  mapData.forEach((value) =>
    value.sort((a, b) => {
      const firstMinusSecond = WeekDayInt(a.weekday) - WeekDayInt(b.weekday);
      if (firstMinusSecond > 0) {
        return 1;
      } else if (firstMinusSecond === 0) {
        return a.startTime > b.endTime ? 1 : -1;
      } else return -1; // firstMinusSecond < 0
    }),
  );

  const orderedByEventsCount = Array.from(mapData).sort(
    ([_classroomA, dataA], [_classroomB, dataB]) => dataB.length - dataA.length,
  );
  return orderedByEventsCount;
}

export function ClassEventsMapper(events: EventRenderRange[], classCode: string, subjectCode: string) {
  return EventsRenderRangeEventsByClassroomsMapper(events).filter(
    (it) => it.classCode === classCode && it.subjectCode === subjectCode,
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

export function EventsByWeekDay(events: EventByClassrooms[]): EventByClassrooms[][] {
  const eventsByWeekDay: EventByClassrooms[][] = [[], [], [], [], [], [], []];
  for (let i = 0; i < events.length; i++) {
    if (events[i].weekday === WeekDays.Monday) eventsByWeekDay[0].push(events[i]);
    if (events[i].weekday === WeekDays.Tuesday) eventsByWeekDay[1].push(events[i]);
    if (events[i].weekday === WeekDays.Wednesday) eventsByWeekDay[2].push(events[i]);
    if (events[i].weekday === WeekDays.Thursday) eventsByWeekDay[3].push(events[i]);
    if (events[i].weekday === WeekDays.Friday) eventsByWeekDay[4].push(events[i]);
    if (events[i].weekday === WeekDays.Saturday) eventsByWeekDay[5].push(events[i]);
    if (events[i].weekday === WeekDays.Sunday) eventsByWeekDay[6].push(events[i]);
  }
  return eventsByWeekDay;
}
