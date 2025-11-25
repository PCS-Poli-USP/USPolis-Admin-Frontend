import * as yup from 'yup';
import { FeedbackForm } from './feedback.interface';

export const formFields = {
  title: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test('is-valid-name', 'Campo obrigatório', (value) => !!value),
    defaultValue: '',
  },
  message: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test('is-valid-name', 'Campo obrigatório', (value) => !!value),
    defaultValue: '',
  },
};

export const schema = yup.object<FeedbackForm>().shape({
  title: formFields.title.validator,
  message: formFields.message.validator,
});

export const defaultValues: FeedbackForm = {
  title: formFields.title.defaultValue,
  message: formFields.message.defaultValue,
};
