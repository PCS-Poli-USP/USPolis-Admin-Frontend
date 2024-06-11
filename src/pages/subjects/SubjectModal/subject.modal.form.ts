import SubjectValidator from 'utils/subjects/subjects.validator';
import * as yup from 'yup';
import { SubjectForm } from './subject.modal.interface';
import { SubjectType } from 'utils/enums/subjects.enum';

export const formFields = {
  code: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-field',
        'Código de disciplina inválido, deve conter 7 caracteres',
        (value) => !SubjectValidator.isInvalidCode(value),
      ),
    defaultValue: '',
  },
  name: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-field',
        'Nome inválido',
        (value) => !SubjectValidator.isInvalidName(value),
      ),
    defaultValue: '',
  },
  type: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-option',
        'Selecione um tipo válido',
        (value) => !SubjectValidator.isInvalidType(value),
      ),
    defaultValue: '',
  },
  class_credit: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-number',
        'Quantidade de créditos inválida',
        (value) => !SubjectValidator.isInvalidCredit(value),
      ),
    defaultValue: 0,
  },
  work_credit: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-number',
        'Quantidade de créditos inválida',
        (value) => !SubjectValidator.isInvalidCredit(value),
      ),
    defaultValue: 0,
  },
  activation: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-date',
        'Data inválida',
        (value) => !SubjectValidator.isInvalidDate(value),
      ),
    defaultValue: '',
  },
  desactivation: {
    validator: yup.string(),
    defaultValue: undefined,
  },
};

export const schema = yup.object<SubjectForm>().shape({
  code: formFields.code.validator,
  name: formFields.name.validator,
  type: formFields.type.validator,
  class_credit: formFields.class_credit.validator,
  work_credit: formFields.work_credit.validator,
  activation: formFields.activation.validator,
  desactivation: formFields.desactivation.validator,
});

export const defaultValues: SubjectForm = {
  code: formFields.code.defaultValue,
  name: formFields.name.defaultValue,
  type: formFields.type.defaultValue as SubjectType,
  class_credit: formFields.class_credit.defaultValue,
  work_credit: formFields.work_credit.defaultValue,
  activation: formFields.activation.defaultValue,
  desactivation: formFields.desactivation.defaultValue,
};
