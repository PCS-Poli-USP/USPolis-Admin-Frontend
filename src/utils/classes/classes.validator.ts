export function isEmpty(value: string) {
  return value.length <= 0;
}

export function isInvalidClassCode(code: string) {
  return code.length < 7;
}

export function isInvalidSubjectCode(code: string) {
  return code.length < 7;
}

export function isInvalidSubjectName(name: string) {
  return name.length <= 0;
}

export function isInvalidOfering(pendings: number, subscribers: number) {
  if (pendings > subscribers) {
    return true;
  }
  return false;
}

export function isInvalidClassType(type: string) {
  return type.length <= 0;
}

export function isInvalidProfessor(professor: string) {
  return professor.length < 3;
}

export function isInvalidProfessorList(professors: string[]) {
  return true;
}

export function isInvalidPeriod(start: string, end: string) {
  if (start.length === 0 || end.length === 0) return true;
  const startPeriodObj = new Date(start);
  const endPeriodObj = new Date(end);

  if (startPeriodObj <= endPeriodObj) {
    return false;
  }
  return true;
}

export function isInvalidTime(start_time: string, end_time: string) {
  if (start_time.length === 0 || end_time.length === 0) return true;
  const [startHour, startMinute] = start_time.split(':').map(Number);
  const [endHour, endMinute] = end_time.split(':').map(Number);

  if (
    startHour < endHour ||
    (startHour === endHour && startMinute < endMinute)
  ) {
    return false;
  }
  return true;
}

export function isInvalidTimeList(
  start_times: string[],
  end_times: string[],
): boolean {
  return start_times.length <= 0 || end_times.length <= 0;
}

export function isInvalidWeekDayList(week_days: string[]) {
  return week_days.length <= 0;
}

export function isInvalidEditedTimeList(
  start_times: string[],
  end_times: string[],
) {
  const indexes: number[] = [];
  for (let i = 0; i < start_times.length; i++) {
    if (isInvalidTime(start_times[i], end_times[i])) {
      indexes.push(i);
    }
  }
  return indexes;
}
