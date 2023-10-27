import Class, { CreateClassEvents } from "models/class.model";

export function breakClassFormInEvents(form: Class) {
  const events: CreateClassEvents[] = [];
  const week_days = form.week_days;
  const start_times = form.start_time;
  const end_times = form.end_time;
  
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