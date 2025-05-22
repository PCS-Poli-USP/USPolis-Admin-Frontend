import * as yup from 'yup';
import { HolidayCategoryForm } from './holidayCategory.modal.interface';
import HolidayCategoryValidator from '../../../utils/holidaysCategories/holidaysCategories.validator';

export const formFields = {
  name: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !HolidayCategoryValidator.isInvalidName(value),
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
};

export const schema = yup.object<HolidayCategoryForm>().shape({
  name: formFields.name.validator,
  year: formFields.year.validator,
});

export const defaultValues: HolidayCategoryForm = {
  name: formFields.name.defaultValue,
  year: formFields.year.defaultValue,
};
