import * as yup from 'yup';
import { HolidayForm } from './holiday.modal.interface';
import { HolidayValidator } from 'utils/holidays/holidays.validator';

export const formFields = {
  category_id: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !HolidayValidator.isInvalidCategoryId(value),
      ),
    defaultValue: '',
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
  type: {
    validator: yup
      .string()
      .required('Selecione um tipo')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !HolidayValidator.isInvalidType(value),
      ),
    defaultValue: '',
  },
};

export const schema = yup.object<HolidayForm>().shape({
  category_id: formFields.category_id.validator,
  date: formFields.date.validator,
  type: formFields.type.validator,
});

export const defaultValues: HolidayForm = {
  category_id: formFields.category_id.defaultValue,
  date: formFields.date.defaultValue,
  type: formFields.type.defaultValue,
};
