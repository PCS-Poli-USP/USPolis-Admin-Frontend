import Class, { CreateClassEvents, SClass } from 'models/common/class.model';
import Event, { EventByClassrooms } from 'models/common/event.model';
import { Classrooms } from 'utils/enums/clasrooms.enum';
import { ClassCodeText } from 'utils/mappers/allocation.mapper';
import { Building } from 'models/common/building.model';
import { Capitalize } from 'utils/formatters';
import { ClassType } from 'utils/enums/classes.enum';

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
      ignore_to_allocate: form.ignore_to_allocate,
    };

    if (form.classrooms) {
      event.classroom = form.classrooms[i];
    }
    events.push(event);
  }

  return events;
}

export function EventToEventByClassroom(data: Event): EventByClassrooms {
  const event: EventByClassrooms = {
    subject_code: data.subject_code,
    class_code: data.class_code,
    classroom: data.classroom ? data.classroom : Classrooms.UNALLOCATED,
    building: data.building ? data.building : Classrooms.UNALLOCATED,
    has_to_be_allocated: data.has_to_be_allocated,
    professors: data.professors ? data.professors : [],
    start_time: data.start_time,
    end_time: data.end_time,
    week_day: data.week_day,
    class_code_text: ClassCodeText(data.class_code),
    subscribers: data.subscribers,
  };
  return event;
}

export function ClassToEventByClassroom(
  data: Class,
  buildings: Building[],
): EventByClassrooms[] {
  const events: EventByClassrooms[] = [];
  for (let i = 0; i < data.week_days.length; i++) {
    const event: EventByClassrooms = {
      subject_code: data.subject_code,
      classroom: data.classrooms ? data.classrooms[0] : Classrooms.UNALLOCATED,
      building:
        buildings.filter((it) => it.id === data.preferences.building_id)[0]
          .name || Classrooms.UNALLOCATED,
      has_to_be_allocated: data.has_to_be_allocated,
      class_code: data.class_code,
      professors: data.professors || [],
      start_time: data.start_time[i],
      end_time: data.end_time[i],
      week_day: data.week_days[i],
      id: data.events_ids[i],
      class_code_text: ClassCodeText(data.class_code),
      subscribers: data.subscribers,
    };
    events.push(event);
  }
  return events;
}

export function ClassToSClass(data: Class[]): SClass[] {
  const formatedData: SClass[] = [];
  for (let cl of data) {
    const formatedClass: SClass = { ...cl, selected: false };
    formatedData.push(formatedClass);
  }
  return formatedData;
}

export function weekDaysFormatter(week_day: string): string {
  switch (week_day) {
    case 'seg':
      return 'Segunda';
    case 'ter':
      return 'Terça';
    case 'qua':
      return 'Quarta';
    case 'qui':
      return 'Quinta';
    case 'sex':
      return 'Sexta';
    case 'sab':
      return 'Sábado';
    case 'dom':
      return 'Domingo';
    default:
      return '';
  }
}

export function getClassScheduleText(data: Class): string[] {
  const schedule: string[] = [];
  for (let i = 0; i < data.week_days.length; i++) {
    schedule.push(
      `${weekDaysFormatter(data.week_days[i])}, ${data.start_time[i]} às ${
        data.end_time[i]
      } na ${data.classrooms ? data.classrooms[i] : 'NÃO ALOCADA'}`,
    );
  }
  return schedule;
}

export function getClassScheduleShortText(data: Class): string {
  let text = '';
  for (let i = 0; i < data.week_days.length; i++) {
    text += `${Capitalize(data.week_days[i])} (${data.start_time[i]} - ${
      data.end_time[i]
    }) - ${
      !data.has_to_be_allocated && data.classrooms ? data.classrooms[i] : 'NA'
    }, `;
  }
  return text.replace(/,\s*$/, '');
}

export const classTypeFormatter = (value: string): string => {
  switch (value) {
    case ClassType.PRACTIC:
      return 'Prática';
    case ClassType.THEORIC:
      return 'Teórica';
    case ClassType.VINCULATED_PRACTIC:
      return 'Prática Vinculada';
    case ClassType.VINCULATED_THEORIC:
      return 'Teórica Vinculada';
    default:
      return 'Tipo desconhecido';
  }
};
