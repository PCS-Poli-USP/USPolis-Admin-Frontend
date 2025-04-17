import * as yup from 'yup';
import { ClassThirdForm } from './class.modal.steps.third.interface';
import { Recurrence } from '../../../../../utils/enums/recurrence.enum';
import { ScheduleValidator } from '../../../../../utils/schedules/schedules.validator';

export const classThirdFormFields = {
  schedule_start_date: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-date', 'Data de início inválida', (value) => {
        if (!value) return true;
        return !ScheduleValidator.isInvalidDate(value);
      }),
    defaultValue: '',
  },
  schedule_end_date: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-end-date', 'Data inválida', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidDate(value);
      })
      .test(
        'is-greater',
        'Data de fim não pode ser antes de início',
        function (value) {
          const { schedule_start_date } = this.parent;
          if (!value) return true;
          if (!schedule_start_date) return true;

          return !ScheduleValidator.isInvalidDateOferring(
            schedule_start_date,
            value,
          );
        },
      ),
    defaultValue: '',
  },
  recurrence: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-recurrence', 'Recorrência inválida', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidRecurrence(value);
      }),
    defaultValue: '',
  },
  month_week: {
    validator: yup
      .number()
      .notRequired()
      .transform((curr, orig) => (orig === '' ? undefined : curr)) // Yup treats notRequired as ''
      .test('is-valid-month-week', 'Semana do mês inválido', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidMonthWeek(value);
      }).test('must-have-mont-week-when-recurrence', 'É preciso escolher uma semana do mês', function (value) {
        const { recurrence } = this.parent;
        if (!recurrence) return true;
        if (recurrence !== Recurrence.MONTHLY) return true;
        if (!value) return false;
        return !ScheduleValidator.isInvalidMonthWeek(value);
      }),
    defaultValue: '',
  },
  week_day: {
    validator: yup
      .number()
      .notRequired()
      .transform((curr, orig) => (orig === '' ? undefined : curr)) // Yup treats notRequired as ''
      .test('is-valid-week-day', 'Dia da semana inválido', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidWeekDay(value);
      })
      .test('must-have-week-day-when-recurrence', 'É preciso escolher um dia da semana', function (value) {
        const { recurrence } = this.parent;
        if (!recurrence) return true;
        if (recurrence === Recurrence.CUSTOM || recurrence === Recurrence.DAILY) return true;
        if (value === undefined || value === null) return false;
        return !ScheduleValidator.isInvalidWeekDay(value);
      }),
    defaultValue: '',
  },
  start_time: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-day-time', 'Horário inválido', (value) => {
        if (!value) return true;
        return !ScheduleValidator.isInvalidDayTime(value);
      }),
    defaultValue: '',
  },
  end_time: {
    validator: yup
      .string()
      .notRequired()
      .test('is-valid-day-time', 'Horário inválido', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidDayTime(value);
      })
      .test(
        'is-greater',
        'Horário de fim não pode ser menor que início',
        function (value) {
          const { start_time } = this.parent;
          if (!value) return true;
          if (!start_time) return !ScheduleValidator.isInvalidDayTime(value);
          return !ScheduleValidator.isInvalidDayTimeOfering(start_time, value);
        },
      ),
    defaultValue: '',
  },
  
};

export const classThirdSchema = yup.object<ClassThirdForm>().shape({
  schedule_start_date: classThirdFormFields.schedule_start_date.validator,
  schedule_end_date: classThirdFormFields.schedule_end_date.validator,
  recurrence: classThirdFormFields.recurrence.validator,
  month_week: classThirdFormFields.month_week.validator,
  week_day: classThirdFormFields.week_day.validator,
  start_time: classThirdFormFields.start_time.validator,
  end_time: classThirdFormFields.end_time.validator,
  
});

export const classThirdDefaultValues: ClassThirdForm = {
  schedule_start_date: classThirdFormFields.schedule_start_date.defaultValue,
  schedule_end_date: classThirdFormFields.schedule_end_date.defaultValue,
  recurrence: classThirdFormFields.recurrence.defaultValue as Recurrence,
  month_week: classThirdFormFields.month_week.defaultValue,
  week_day: classThirdFormFields.week_day.defaultValue,
  start_time: classThirdFormFields.start_time.defaultValue,
  end_time: classThirdFormFields.end_time.defaultValue,
  
};
