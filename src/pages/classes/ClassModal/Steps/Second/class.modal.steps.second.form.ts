import * as yup from 'yup';
import { ClassSecondForm } from './class.modal.steps.second.interface';
import { ScheduleValidator } from '../../../../../utils/schedules/schedules.validator';

export const classSecondFormFields = {
  start_date: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-date',
        'Data de início inválida',
        (value) => !ScheduleValidator.isInvalidDate(value),
      ),
    defaultValue: '',
  },
  end_date: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test('is-valid-end-date', 'Data inválida', function (value) {
        if (!value) return true;
        return !ScheduleValidator.isInvalidDate(value);
      })
      .test(
        'is-valid-end-date',
        'Data de fim deve ser após data de início',
        function (value) {
          const { start_date } = this.parent;
          if (!value) return true;
          if (start_date) return true;

          return !ScheduleValidator.isInvalidDateOferring(start_date, value);
        },
      ),
    defaultValue: '',
  },
  calendar_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(0)
      .test('is-valid-array', 'Calendários inválidos', function (value) {
        if (!value) return true;
        if (value.length === 0) return true;
        return !ScheduleValidator.isInvalidIdArray(value);
      }),
    defaultValue: [],
  },
};

export const classSecondSchema = yup.object<ClassSecondForm>().shape({
  start_date: classSecondFormFields.start_date.validator,
  end_date: classSecondFormFields.end_date.validator,
  calendar_ids: classSecondFormFields.calendar_ids.validator,
});

export const classSecondDefaultValues: ClassSecondForm = {
  start_date: classSecondFormFields.start_date.defaultValue,
  end_date: classSecondFormFields.end_date.defaultValue,
  calendar_ids: classSecondFormFields.calendar_ids.defaultValue,
};
