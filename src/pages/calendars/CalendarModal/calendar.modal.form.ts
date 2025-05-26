import { CalendarValidator } from '../../../utils/calendars/calendar.validator';
import * as yup from 'yup';
import { CalendarForm } from './calendar.modal.interface';

export const formFields = {
  name: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !CalendarValidator.isInvalidName(value),
      ),
    defaultValue: '',
  },
  year: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .min(2025, 'Ano inválido')
      .max(2100, 'Ano inválido'),
    defaultValue: new Date().getFullYear(),
  },
  categories_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(0)
      .test('is-valid-option', 'Categorias invalidas', (value) => {
        if (!value) return true;
        return !CalendarValidator.isInvalidCategoriesIds(value);
      }),
    defaultValue: [],
  },
};

export const schema = yup.object<CalendarForm>().shape({
  name: formFields.name.validator,
  year: formFields.year.validator,
  categories_ids: formFields.categories_ids.validator,
});

export const defaultValues: CalendarForm = {
  name: formFields.name.defaultValue,
  year: formFields.year.defaultValue,
  categories_ids: formFields.categories_ids.defaultValue,
};
