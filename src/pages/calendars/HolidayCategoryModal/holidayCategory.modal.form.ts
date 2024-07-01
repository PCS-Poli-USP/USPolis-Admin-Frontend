import * as yup from 'yup';
import { HolidayCategoryForm } from './holidayCategory.modal.interface';
import HolidayCategoryValidator from 'utils/holidaysCategories/holidaysCategories.validator';

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
};

export const schema = yup.object<HolidayCategoryForm>().shape({
  name: formFields.name.validator,
});

export const defaultValues: HolidayCategoryForm = {
  name: formFields.name.defaultValue,
};
