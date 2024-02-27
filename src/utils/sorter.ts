import Class from 'models/class.model';
import { Building } from 'models/building.model';
import Classroom from 'models/classroom.model';
import Event from 'models/event.model';
import { WeekDayInt } from 'utils/mappers/allocation.mapper';

export function sortEventsByClassroom(a: Event, b: Event) {
  if ((a.classroom as string) < (b.classroom as string)) return -1;
  if (a.classroom === b.classroom) return 0;
  return 1;
}

export function sortEventsBySubjectCode(a: Event, b: Event) {
  if (a.subject_code < b.subject_code) return -1;
  if (a.subject_code > b.subject_code) return 1;
  return 0;
}

export function sortEventsByTime(a: Event, b: Event) {
  const weekDayResult = WeekDayInt(a.week_day) - WeekDayInt(b.week_day);
  if (weekDayResult === 0) {
    const d1 = new Date(a.start_time);
    const d2 = new Date(b.start_time);
    return d1.getTime() - d2.getTime();
  }
  return weekDayResult;
}

export function sortEventsByClassroomAndTime(a: Event, b: Event) {
  const classResult = sortEventsByClassroom(a, b);
  if (classResult === 0) {
    return sortEventsByTime(a, b);
  }
  return classResult;
}

export function sortClasses(a: Class, b: Class) {
  if (a.subject_code === b.subject_code) {
    if (a.subject_name < b.subject_name) return -1;
    else if (a.subject_name === b.subject_name) {
      if (a.class_code < b.class_code) return -1;
      else if (a.class_code === b.class_code) return 0;
      else return 1;
    }
    return 1;
  } else if (a.subject_code < b.subject_code) return -1;
  else return 1;
}

export function sortBuildings(a: Building, b: Building) {
  if (a.name < b.name) return -1;
  else if (a.name > b.name) return 1;
  return 0;
}

export function sortClassrooms(a: Classroom, b: Classroom) {
  if (a.classroom_name < b.classroom_name) return -1;
  if (a.classroom_name === b.classroom_name) return 0;
  return 1;
}

export function sortSubjects(a: string, b: string) {
  if (a < b) return -1;
  if (a === b) return 0;
  return 1;
}
