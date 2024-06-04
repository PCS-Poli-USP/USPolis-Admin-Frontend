import { CalendarValidator } from 'utils/calendars/calendar.validator';
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
  categories_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(1, 'Selecione pelo menos uma categoria')
      .test(
        'is-valid-option',
        'Categorias invalidas',
        (value) => value && !CalendarValidator.isInvalidCategoriesIds(value),
      ),
    defaultValue: [],
  },
};

export const schema = yup.object<CalendarForm>().shape({
  name: formFields.name.validator,
  categories_ids: formFields.categories_ids.validator,
});

export const defaultValues: CalendarForm = {
  name: formFields.name.defaultValue,
  categories_ids: formFields.categories_ids.defaultValue,
};
