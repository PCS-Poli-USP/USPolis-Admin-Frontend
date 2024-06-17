import * as yup from 'yup';
import { ClassThirdForm } from './class.modal.steps.third.interface';

export const classThirdFormFields = {
  ignore_to_allocate: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  projector: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  air_conditionating: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  accessibility: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  skip_exceptions: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
};

export const classThirdSchema = yup.object<ClassThirdForm>().shape({
  ignore_to_allocate: classThirdFormFields.ignore_to_allocate.validator,
  projector: classThirdFormFields.projector.validator,
  air_conditionating: classThirdFormFields.air_conditionating.validator,
  accessibility: classThirdFormFields.accessibility.validator,
  skip_exceptions: classThirdFormFields.skip_exceptions.validator,
});

export const classThirdDefaultValues: ClassThirdForm = {
  ignore_to_allocate: classThirdFormFields.ignore_to_allocate.defaultValue,
  projector: classThirdFormFields.projector.defaultValue,
  air_conditionating: classThirdFormFields.air_conditionating.defaultValue,
  accessibility: classThirdFormFields.accessibility.defaultValue,
  skip_exceptions: classThirdFormFields.skip_exceptions.defaultValue,
};
