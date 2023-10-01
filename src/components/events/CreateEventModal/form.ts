import * as yup from 'yup';
import { CreateForm } from '.';

export const formFields = {
  building: {
    validator: yup.string(),
    defaultValue: '',
  },
  classroom: {
    validator: yup.string(),
    defaultValue: '',
  },
  category: {
    validator: yup.string().required('Campo obrigatório'),
    defaultValue: '',
  },
  description: {
    validator: yup.string().required('Campo obrigatório'),
    defaultValue: '',
  },
  external_link: {
    validator: yup.string().required('Campo obrigatório'),
    defaultValue: '',
  },
  location: {
    validator: yup.string().required('Campo obrigatório'),
    defaultValue: '',
  },
  title: {
    validator: yup.string().required('Campo obrigatório'),
    defaultValue: '',
  },
};

export const schema = yup.object().shape({
  building: formFields.building.validator,
  classroom: formFields.classroom.validator,
  category: formFields.category.validator,
  description: formFields.description.validator,
  external_link: formFields.external_link.validator,
  location: formFields.location.validator,
  title: formFields.title.validator,
});

export const defaultValues: CreateForm = {
  building: formFields.building.defaultValue,
  classroom: formFields.classroom.defaultValue,
  category: formFields.category.defaultValue,
  description: formFields.description.defaultValue,
  external_link: formFields.external_link.defaultValue,
  location: formFields.location.defaultValue,
  title: formFields.title.defaultValue,
};
