import * as yup from 'yup';
import { DepartmentForm } from './department.modal.interface';
import DepartmentValidator from 'utils/departments/departments.validator';

export const formFields = {
  building_id: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !DepartmentValidator.isInvalidId(value),
      ),
    defaultValue: 0,
  },
  name: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !DepartmentValidator.isInvalidName(value),
      ),
    defaultValue: '',
  },
  abbreviation: {
    validator: yup
      .string()
      .required()
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !DepartmentValidator.isInvalidAbbreviation(value),
      ),
    defaultValue: '',
  },
  professor: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !DepartmentValidator.isInvalidName(value),
      ),
    defaultValue: '',
  },
  professors: {
    validator: yup.array().of(yup.string().required('Campo obrigatório')),
    defaultValue: [],
  },
  subject_id: {
    validator: yup
      .number()
      .required()
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !DepartmentValidator.isInvalidId(value),
      ),
    defaultValue: 0,
  },
  subjects_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .notRequired(),
    defaultValue: [],
  },
  classroom_id: {
    validator: yup
      .number()
      .required()
      .test(
        'is-valid-option',
        'Campo obrigatório',
        (value) => !DepartmentValidator.isInvalidId(value),
      ),
    defaultValue: 0,
  },
  classrooms_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .notRequired(),
    defaultValue: [],
  },
};

export const schema = yup.object<DepartmentForm>().shape({
  building_id: formFields.building_id.validator,
  name: formFields.name.validator,
  abbreviation: formFields.abbreviation.validator,
  professors: formFields.professors.validator,
  subjects_ids: formFields.subjects_ids.validator,
  classrooms_ids: formFields.classrooms_ids.validator,
});

export const defaultValues: DepartmentForm = {
  building_id: formFields.building_id.defaultValue,
  name: formFields.name.defaultValue,
  abbreviation: formFields.abbreviation.defaultValue,
  professors: formFields.professors.defaultValue,
  subjects_ids: formFields.subjects_ids.defaultValue,
  classrooms_ids: formFields.classrooms_ids.defaultValue,
};
