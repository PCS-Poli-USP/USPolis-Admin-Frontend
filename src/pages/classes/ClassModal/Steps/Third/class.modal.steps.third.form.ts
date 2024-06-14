import { ClassValidator } from 'utils/classes/classes.validator';
import * as yup from 'yup';
import { ClassThirdForm } from './class.modal.steps.third.interface';

export const classThirdFormFields = {
  subject_id: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-id',
        'Escolha uma disciplina válida',
        (value) => !ClassValidator.isInvalidId(value),
      ),
    defaultValue: 0,
  },
  code: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-field',
        'Código deve conter 7 caracteres',
        (value) => !ClassValidator.isInvalidClassCode(value),
      ),
    defaultValue: '',
  },
  type: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-field',
        'Tipo inválido',
        (value) => !ClassValidator.isInvalidClassType(value),
      ),
    defaultValue: '',
  },
  professors: {
    validator: yup
      .array()
      .of(yup.string().required('Campo obrigatório'))
      .min(1, 'Coloque pelo menos um professor')
      .test(
        'is-valid-array',
        'Professores inválidos',
        (value) => value && !ClassValidator.isInvalidProfessorList(value),
      ),
    defaultValue: [],
  },
  vacancies: {
    validator: yup
      .number()
      .min(0, 'Vagas não pode ser negativa')
      .required('Campo obrigatório'),
    defaultValue: 0,
  },
  subscribers: {
    validator: yup
      .number()
      .min(0, 'Inscritos não pode ser negativo')
      .required('Campo obrigatório'),
    defaultValue: 0,
  },
  pendings: {
    validator: yup
      .number()
      .min(0, 'Pendentes não pode ser negativo')
      .required('Campo obrigatório')
      .test(
        'is-greater',
        'Número de inscritos deve ser maior ou igual ao de pendentes',
        function (value) {
          const { subscribers } = this.parent;
          return subscribers >= value;
        },
      ),
    defaultValue: 0,
  },
};

export const classThirdSchema = yup.object<ClassThirdForm>().shape({
  subject_id: classThirdFormFields.subject_id.validator,
  code: classThirdFormFields.code.validator,
  type: classThirdFormFields.type.validator,
  vacancies: classThirdFormFields.vacancies.validator,
  subscribers: classThirdFormFields.subscribers.validator,
  pendings: classThirdFormFields.pendings.validator,
  professors: classThirdFormFields.professors.validator,
});

export const classThirdDefaultValues: ClassThirdForm = {
  subject_id: classThirdFormFields.subject_id.defaultValue,
  code: classThirdFormFields.code.defaultValue,
  type: classThirdFormFields.type.defaultValue,
  professors: classThirdFormFields.professors.defaultValue,
  vacancies: classThirdFormFields.vacancies.defaultValue,
  subscribers: classThirdFormFields.subscribers.defaultValue,
  pendings: classThirdFormFields.pendings.defaultValue,
};
