import SubjectValidator from 'utils/subjects/subjects.validator';
import * as yup from 'yup';
import { SubjectForm } from './subject.modal.interface';
import { SubjectType } from 'utils/enums/subjects.enum';

export const formFields = {
  building_ids: {
    validator: yup
      .array()
      .of(yup.number().required('Campo obrigatório'))
      .min(1, 'Selecione pelo menos um prédio')
      .test(
        'is-valid-array',
        'Prédios inválidos',
        (value) => value && !SubjectValidator.isInvalidIdArray(value),
      ),
    defaultValue: [],
  },
  professors: {
    validator: yup
      .array()
      .required('Campo obrigatório')
      .of(yup.string().required('Campo obrigatório'))
      .min(0)
      .test(
        'is-valid-array',
        'Professores inválidos, nome deve conter no mínimo 3 caracteres',
        (value) => value && !SubjectValidator.isInvalidProfessorList(value),
      ),
    defaultValue: [],
  },
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
};

export const schema = yup.object<SubjectForm>().shape({
  building_ids: formFields.building_ids.validator,
  professors: formFields.professors.validator,
  code: formFields.code.validator,
  name: formFields.name.validator,
  type: formFields.type.validator,
  class_credit: formFields.class_credit.validator,
  work_credit: formFields.work_credit.validator,
});

export const defaultValues: SubjectForm = {
  building_ids: formFields.building_ids.defaultValue,
  professors: formFields.professors.defaultValue,
  code: formFields.code.defaultValue,
  name: formFields.name.defaultValue,
  type: formFields.type.defaultValue as SubjectType,
  class_credit: formFields.class_credit.defaultValue,
  work_credit: formFields.work_credit.defaultValue,
};
