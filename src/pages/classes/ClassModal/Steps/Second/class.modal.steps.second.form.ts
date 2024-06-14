import { ClassValidator } from 'utils/classes/classes.validator';
import * as yup from 'yup';
import { ClassSecondForm } from './class.modal.steps.second.interface';

export const classSecondFormFields = {
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

export const classSecondSchema = yup.object<ClassSecondForm>().shape({
  subject_id: classSecondFormFields.subject_id.validator,
  code: classSecondFormFields.code.validator,
  type: classSecondFormFields.type.validator,
  vacancies: classSecondFormFields.vacancies.validator,
  subscribers: classSecondFormFields.subscribers.validator,
  pendings: classSecondFormFields.pendings.validator,
  professors: classSecondFormFields.professors.validator,
});

export const classSecondDefaultValues: ClassSecondForm = {
  subject_id: classSecondFormFields.subject_id.defaultValue,
  code: classSecondFormFields.code.defaultValue,
  type: classSecondFormFields.type.defaultValue,
  professors: classSecondFormFields.professors.defaultValue,
  vacancies: classSecondFormFields.vacancies.defaultValue,
  subscribers: classSecondFormFields.subscribers.defaultValue,
  pendings: classSecondFormFields.pendings.defaultValue,
};
