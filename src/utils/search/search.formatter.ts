import moment, { Moment } from 'moment';
import {
  SearchClassPayload,
  SearchClassSchedule,
  SearchItemResponse,
  SearchReservationPayload,
} from '../../models/http/responses/search.response.models';
import { classNumberFromClassCode } from '../classes/classes.formatter';
import { SearchEntityType } from '../enums/searchEntityType.enum';
import { WeekDay } from '../enums/weekDays.enum';
import { datetimeToDate } from '../formatters';

export interface HighlightPart {
  text: string;
  match: boolean;
}

export type ClassPeriodStatus = 'current' | 'upcoming' | 'past';

/** Lower-case and strip accents, same idea as the backend f_unaccent(lower()). */
export function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/**
 * Split `text` into parts, flagging the ones that match a query token.
 * Matching ignores case and accents ("calculo" highlights "Cálculo").
 * Tokens shorter than 2 characters are ignored to avoid highlighting noise.
 */
export function highlightMatches(text: string, query: string): HighlightPart[] {
  const tokens = normalizeForSearch(query)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length >= 2);
  if (!text || tokens.length === 0) return [{ text, match: false }];

  // Normalize char by char so indexes in `normalized` map back to `text`.
  const chars = Array.from(text);
  const normalizedChars = chars.map((c) => normalizeForSearch(c));
  const normalized = normalizedChars.join('');
  const offsetToChar: number[] = [];
  normalizedChars.forEach((n, i) => {
    for (let k = 0; k < n.length; k++) offsetToChar.push(i);
  });

  const marked = new Array<boolean>(chars.length).fill(false);
  for (const token of tokens) {
    let from = normalized.indexOf(token);
    while (from !== -1) {
      for (let k = from; k < from + token.length; k++) {
        marked[offsetToChar[k]] = true;
      }
      from = normalized.indexOf(token, from + token.length);
    }
  }

  const parts: HighlightPart[] = [];
  chars.forEach((c, i) => {
    const last = parts[parts.length - 1];
    if (last && last.match === marked[i]) last.text += c;
    else parts.push({ text: c, match: marked[i] });
  });
  return parts;
}

export function sortSearchSchedules(
  schedules: SearchClassSchedule[],
): SearchClassSchedule[] {
  return [...schedules].sort((a, b) => {
    const dayA = a.week_day ?? 7;
    const dayB = b.week_day ?? 7;
    if (dayA !== dayB) return dayA - dayB;
    return a.start_time.localeCompare(b.start_time);
  });
}

/** "Segunda 13:10–14:50 · A1-02 (Biênio)" */
export function formatSearchSchedule(schedule: SearchClassSchedule): string {
  const day =
    schedule.week_day !== null && schedule.week_day !== undefined
      ? WeekDay.translate(schedule.week_day)
      : 'Sem dia definido';
  const place = schedule.classroom
    ? `${schedule.classroom}${schedule.building ? ` (${schedule.building})` : ''}`
    : 'Sala não alocada';
  return `${day} ${schedule.start_time}–${schedule.end_time} · ${place}`;
}

export function getClassPeriodStatus(
  startDate: string,
  endDate: string,
  today: Moment = moment(),
): ClassPeriodStatus {
  if (today.isBefore(moment(startDate), 'day')) return 'upcoming';
  if (today.isAfter(moment(endDate), 'day')) return 'past';
  return 'current';
}

export type ClassLiveStatus =
  | 'now' // class happening right now
  | 'later_today' // has class today, not started yet
  | 'done_today' // had class today, already over
  | 'no_class_today' // period running, but no schedule on today's weekday
  | 'upcoming' // period not started
  | 'past'; // period over

export interface ClassLiveStatusInfo {
  status: ClassLiveStatus;
  label: string;
  color: string;
}

/**
 * Status of a class at `now`. Being inside the class period (start/end date)
 * is not enough for "Em andamento": it also needs a schedule on today's
 * weekday whose start <= now < end.
 */
export function getClassLiveStatus(
  payload: Pick<SearchClassPayload, 'start_date' | 'end_date' | 'schedules'>,
  now: Moment = moment(),
): ClassLiveStatusInfo {
  const period = getClassPeriodStatus(
    payload.start_date,
    payload.end_date,
    now,
  );
  if (period === 'past') {
    return { status: 'past', label: 'Turma encerrada', color: 'gray' };
  }
  if (period === 'upcoming') {
    return {
      status: 'upcoming',
      label: `Começa em ${moment(payload.start_date).format('DD/MM')}`,
      color: 'yellow',
    };
  }

  // WeekDay is 0 (Monday) .. 6 (Sunday); isoWeekday is 1 (Monday) .. 7.
  const today = (now.isoWeekday() - 1) as WeekDay;
  const time = now.format('HH:mm'); // zero-padded, so string comparison works
  const todays = sortSearchSchedules(
    payload.schedules.filter((s) => s.week_day === today),
  );
  if (todays.length === 0) {
    return { status: 'no_class_today', label: 'Sem aula hoje', color: 'gray' };
  }
  if (todays.some((s) => s.start_time <= time && time < s.end_time)) {
    return { status: 'now', label: 'Em andamento', color: 'green' };
  }
  const next = todays.find((s) => time < s.start_time);
  if (next) {
    return {
      status: 'later_today',
      label: `Hoje às ${next.start_time}`,
      color: 'yellow',
    };
  }
  return { status: 'done_today', label: 'Encerrada hoje', color: 'red' };
}

const RESERVATION_TYPES: SearchEntityType[] = [
  SearchEntityType.EXAM,
  SearchEntityType.EVENT,
  SearchEntityType.MEETING,
];

export function isReservationItem(
  item: SearchItemResponse,
): item is Extract<SearchItemResponse, { payload: SearchReservationPayload }> {
  return RESERVATION_TYPES.includes(item.type);
}

/** Monitorias have no type of their own yet: they are events or meetings
 * whose title says so. */
export function isMonitoria(item: SearchItemResponse): boolean {
  return (
    isReservationItem(item) &&
    normalizeForSearch(item.title).includes('monitori')
  );
}

const eventTypeLabels: { [key: string]: string } = {
  talk: 'Palestra',
  workshop: 'Workshop',
  selection_process: 'Processo seletivo',
};

/**
 * Status of an exam/event/meeting at `now`, from its actual occurrence dates:
 * happening now, later today, over today, next date, or over. Without
 * occurrences (not allocated), falls back to the schedule's date range.
 */
export function getReservationLiveStatus(
  payload: SearchReservationPayload,
  now: Moment = moment(),
): ClassLiveStatusInfo {
  const today = now.format('YYYY-MM-DD');
  const time = now.format('HH:mm');
  const occurrences = payload.occurrences;

  if (occurrences.length === 0) {
    if (payload.start_date && payload.start_date > today) {
      return {
        status: 'upcoming',
        label: `Em ${moment(payload.start_date).format('DD/MM')}`,
        color: 'yellow',
      };
    }
    if (payload.end_date && payload.end_date < today) {
      return { status: 'past', label: 'Encerrada', color: 'gray' };
    }
    return { status: 'no_class_today', label: 'Sem data hoje', color: 'gray' };
  }

  const todays = occurrences.filter((o) => o.date === today);
  if (todays.some((o) => o.start_time <= time && time < o.end_time)) {
    return { status: 'now', label: 'Acontecendo agora', color: 'green' };
  }
  const nextToday = todays.find((o) => time < o.start_time);
  if (nextToday) {
    return {
      status: 'later_today',
      label: `Hoje às ${nextToday.start_time}`,
      color: 'yellow',
    };
  }
  const next = occurrences.find((o) => o.date > today);
  if (next) {
    return {
      status: 'upcoming',
      label: `Próxima: ${moment(next.date).format('DD/MM')}`,
      color: 'yellow',
    };
  }
  if (todays.length > 0) {
    return { status: 'done_today', label: 'Encerrada hoje', color: 'red' };
  }
  return { status: 'past', label: 'Encerrada', color: 'gray' };
}

/** Live status badge for classes and reservations; null for other types. */
export function getSearchItemLiveStatus(
  item: SearchItemResponse,
  now: Moment = moment(),
): ClassLiveStatusInfo | null {
  if (item.type === SearchEntityType.CLASS) {
    return getClassLiveStatus(item.payload, now);
  }
  if (isReservationItem(item))
    return getReservationLiveStatus(item.payload, now);
  return null;
}

/** "24/08/2026 · 11:00–13:00" or "16 datas · 24/08/2026 a 07/12/2026 · 11:00–13:00" */
export function formatReservationDates(
  payload: SearchReservationPayload,
): string | null {
  const occurrences = payload.occurrences;
  const first = occurrences[0]?.date ?? payload.start_date;
  const last = occurrences[occurrences.length - 1]?.date ?? payload.end_date;
  if (!first) return null;
  const startTime = occurrences[0]?.start_time ?? payload.start_time;
  const endTime = occurrences[0]?.end_time ?? payload.end_time;
  const time = startTime && endTime ? ` · ${startTime}–${endTime}` : '';
  if (!last || last === first) return `${datetimeToDate(first)}${time}`;
  const count =
    occurrences.length > 1
      ? `${plural(occurrences.length, 'data', 'datas')} · `
      : '';
  return `${count}${datetimeToDate(first)} a ${datetimeToDate(last)}${time}`;
}

/** Display title: class codes use the short class number ("Turma 02"). */
export function formatSearchItemTitle(item: SearchItemResponse): string {
  if (item.type === SearchEntityType.CLASS) {
    return `${item.payload.subject_code} · Turma ${classNumberFromClassCode(
      item.payload.code,
    )}`;
  }
  return item.title;
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function formatFloor(floor: number): string {
  return floor === 0 ? 'Térreo' : `${floor}º andar`;
}

/** Short detail lines shown under a result's title, per entity type. */
export function describeSearchItem(item: SearchItemResponse): string[] {
  switch (item.type) {
    case SearchEntityType.SUBJECT:
      return [
        plural(item.payload.class_count, 'turma', 'turmas'),
        ...(item.payload.professors.length > 0
          ? [item.payload.professors.filter((p) => p.trim()).join(', ')]
          : []),
      ];
    case SearchEntityType.CLASS:
      return [
        item.payload.professors.join(', ') || 'Sem professor',
        `Período: ${datetimeToDate(item.payload.start_date)} a ${datetimeToDate(
          item.payload.end_date,
        )}`,
        ...sortSearchSchedules(item.payload.schedules).map(
          formatSearchSchedule,
        ),
      ];
    case SearchEntityType.CLASSROOM: {
      const features = [
        item.payload.accessibility ? 'acessível' : null,
        item.payload.air_conditioning ? 'ar-condicionado' : null,
      ].filter((f): f is string => f !== null);
      return [
        `${item.payload.building} · ${formatFloor(item.payload.floor)}`,
        `Capacidade: ${item.payload.capacity}${
          features.length > 0 ? ` · ${features.join(', ')}` : ''
        }`,
      ];
    }
    case SearchEntityType.BUILDING:
      return [plural(item.payload.classroom_count, 'sala', 'salas')];
    case SearchEntityType.EXAM:
    case SearchEntityType.EVENT:
    case SearchEntityType.MEETING: {
      const lines: string[] = [];
      const dates = formatReservationDates(item.payload);
      if (dates) lines.push(dates);
      if (item.payload.subjects.length > 0) {
        lines.push(
          item.payload.subjects.map((s) => `${s.code} - ${s.name}`).join(', '),
        );
      }
      const eventType = item.payload.event_type
        ? eventTypeLabels[item.payload.event_type]
        : undefined;
      if (eventType) lines.push(eventType);
      return lines;
    }
    case SearchEntityType.PROFESSOR:
      return [
        `${plural(item.payload.subject_count, 'disciplina', 'disciplinas')} · ${plural(
          item.payload.class_count,
          'turma',
          'turmas',
        )}`,
      ];
  }
}
