import { CreateClassEvents, CreateClassForm } from "models/class.model";

export function breakClassFormInEvents(form: CreateClassForm) {
  const events: CreateClassEvents[] = [];
  const week_days = form.week_days;
  const start_times = form.start_times;
  const end_times = form.end_times;
  
  for (let i = 0; i < form.week_days.length; i++) {
    const event: CreateClassEvents = {...form, week_day: week_days[i], start_time: start_times[i], end_time: end_times[i]};
    events.push(event);
  }

  return events;
}