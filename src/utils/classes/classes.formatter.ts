import Class, { CreateClassEvents } from "models/class.model";
import { EventByClassrooms } from "models/event.model";
import { Classrooms } from 'models/enums/clasrooms.enum';
import { ClassCodeText } from "utils/mappers/allocation.mapper";
import { Building } from "models/building.model";

export function breakClassFormInEvents(form: Class) {
  const events: CreateClassEvents[] = [];
  for (let i = 0; i < form.week_days.length; i++) {
    const event: CreateClassEvents = {
      class_code: form.class_code,
      subject_code: form.subject_code,
      subject_name: form.subject_name,
      professors: form.professors,
      start_period: form.start_period,
      end_period: form.end_period,
      start_time: form.start_time[i],
      end_time: form.end_time[i],
      week_day: form.week_days[i],
      class_type: form.class_type,
      vacancies: form.vacancies,
      subscribers: form.subscribers,
      pendings: form.pendings,
      preferences: form.preferences,
      has_to_be_allocated: form.has_to_be_allocated,
    };
    events.push(event);
  }

  return events;
}

export function ClassToEventByClassroom(data: Class, buildings: Building[]): EventByClassrooms[] {
  const events: EventByClassrooms[] = [];
  for (let i = 0; i < data.week_days.length; i++) {
    const event: EventByClassrooms = {
      subjectCode: data.subject_code,
      classroom: data.classrooms ? data.classrooms[0] : Classrooms.UNALLOCATED,
      building: buildings.filter((it) => it.id === data.preferences.building_id)[0].name || Classrooms.UNALLOCATED,
      classCode: data.class_code,
      professors: data.professors || [],
      startTime: data.start_time[i],
      endTime: data.end_time[i],
      weekday: data.week_days[i],
      classCodeText: ClassCodeText(data.class_code),
      subscribers: data.subscribers,
    };
    events.push(event);
  }
  return events;
}

export function weekDaysFormatter(week_day: string): string {
  switch (week_day) {
    case 'seg':
      return 'Segunda'
    case 'ter':
      return 'Terça'
    case 'qua':
      return 'Quarta'
    case 'qui':
      return 'Quinta'
    case 'sex':
      return 'Sexta'
    case 'sab':
      return 'Sábado'
    case 'dom':
      return 'Domingo'
    default:
      return ''
  }
}

export function getClassScheduleText(data: Class): string[] {
  const schedule: string[] = [];
  for (let i = 0; i < data.week_days.length; i++) {
    schedule.push(`${weekDaysFormatter(data.week_days[i])}, ${data.start_time[i]} às ${data.end_time[i]} na ${data.classrooms ? data.classrooms[i] : 'NÃO ALOCADA'}`);
  }
  return schedule;
}
