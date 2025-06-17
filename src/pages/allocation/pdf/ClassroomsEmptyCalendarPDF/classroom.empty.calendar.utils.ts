import moment from 'moment';
import { WeekDay } from '../../../../utils/enums/weekDays.enum';
import { MergedEvent } from '../ClassroomsCalendarPDF/classroom.calendar.utils';

function groupEventsByWeekday(
  events: MergedEvent[],
): Map<WeekDay, MergedEvent[]> {
  const groupedEvents = new Map<WeekDay, MergedEvent[]>();

  events.forEach((event) => {
    const start = new Date(event.start);
    const weekDay = WeekDay.fromInt(start.getDay() - 1);
    if (!groupedEvents.has(weekDay)) {
      groupedEvents.set(weekDay, []);
    }
    groupedEvents.get(weekDay)?.push(event);
  });

  return groupedEvents;
}

function getStartForEmptyEvent(week_day: WeekDay): string {
  return moment()
    .startOf('week')
    .add(week_day + 1, 'days')
    .hours(7)
    .minutes(30)
    .format('YYYY-MM-DDTHH:mm:ss');
}

function getEndForEmptyEvent(week_day: WeekDay): string {
  return moment()
    .startOf('week')
    .add(week_day + 1, 'days')
    .hours(23)
    .minutes(0)
    .format('YYYY-MM-DDTHH:mm:ss');
}

export function getEmptyEventsFromEvents(events: MergedEvent[]): MergedEvent[] {
  if (!events.length) {
    return [];
  }
  const groupedEvents = groupEventsByWeekday(events);
  const emptyEvents: MergedEvent[] = [];
  const weekDays = WeekDay.getValues();

  weekDays.forEach((day) => {
    const dayEvents = groupedEvents.get(day) || [];
    if (!dayEvents.length) {
      const start = getStartForEmptyEvent(day);
      const end = getEndForEmptyEvent(day);
      emptyEvents.push({
        id: `empty-${day}`,
        start,
        end,
        title: 'Disponível',
        allDay: false,
        resourceId: events[0].resourceId,
        extendedProps: {},
      });
    }
    if (dayEvents.length) {
      let currentStart = new Date(getStartForEmptyEvent(day));
      currentStart.setHours(7, 30);
      dayEvents.sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
      dayEvents.forEach((event) => {
        const eventStart = new Date(event.start);
        const diff = eventStart.getTime() - currentStart.getTime();
        const diffMin = diff / (1000 * 60);
        if (currentStart < eventStart && diffMin >= 30) {
          emptyEvents.push({
            id: `empty-${day}`,
            start: moment(currentStart).format('YYYY-MM-DDTHH:mm:ss'),
            end: event.start,
            title: 'Disponível',
            allDay: false,
            resourceId: event.resourceId,
            extendedProps: {},
          });
        }
        currentStart = new Date(event.end);
      });
      if (currentStart.getHours() < 23) {
        emptyEvents.push({
          id: `empty-${day}`,
          start: moment(currentStart).format('YYYY-MM-DDTHH:mm:ss'),
          end: getEndForEmptyEvent(day),
          title: 'Disponível',
          allDay: false,
          resourceId: events[0].resourceId,
          extendedProps: {},
        });
      }
    }
  });
  return emptyEvents;
}
