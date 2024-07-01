import * as yup from 'yup';
import { ClassFourthForm } from './class.modal.steps.fourth.interface';

export const classFourthFormFields = {
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
};

export const classFourthchema = yup.object<ClassFourthForm>().shape({
  ignore_to_allocate: classFourthFormFields.ignore_to_allocate.validator,
  projector: classFourthFormFields.projector.validator,
  air_conditionating: classFourthFormFields.air_conditionating.validator,
  accessibility: classFourthFormFields.accessibility.validator,
});

export const classFourthDefaultValues: ClassFourthForm = {
  ignore_to_allocate: classFourthFormFields.ignore_to_allocate.defaultValue,
  projector: classFourthFormFields.projector.defaultValue,
  air_conditionating: classFourthFormFields.air_conditionating.defaultValue,
  accessibility: classFourthFormFields.accessibility.defaultValue,
};
