import * as yup from 'yup';
import { HolidayForm } from './holiday.modal.interface';
import { HolidayValidator } from 'utils/holidays/holidays.validator';

export const formFields = {
  category_id: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !HolidayValidator.isInvalidCategoryId(value),
      ),
    defaultValue: 0,
  },
  name: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-name',
        'Nome inválido',
        (value) => !HolidayValidator.isInvalidName(value),
      ),
    dafaultValue: '',
  },
  date: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !HolidayValidator.isInvalidDate(value),
      ),
    defaultValue: '',
  },
};

export const schema = yup.object<HolidayForm>().shape({
  category_id: formFields.category_id.validator,
  date: formFields.date.validator,
  name: formFields.name.validator,
});

export const defaultValues: HolidayForm = {
  category_id: formFields.category_id.defaultValue,
  date: formFields.date.defaultValue,
  name: formFields.name.dafaultValue,
};
