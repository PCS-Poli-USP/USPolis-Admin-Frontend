import { ClassValidator } from 'utils/classes/classes.validator';
import * as yup from 'yup';
import { ClassFirstForm } from './class.modal.steps.first.interface';
import { ClassType } from 'utils/enums/classes.enum';

export const classFirstFormFields = {
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
      .required('Campo obrigatório')
      .of(yup.string().required('Campo obrigatório'))
      .min(0)
      .test(
        'is-valid-array',
        'Professores inválidos, nome deve conter no mínimo 3 caracteres',
        (value) => value && !ClassValidator.isInvalidProfessorList(value),
      ),
    defaultValue: [] as string[],
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
        'Número de pendentes não pode ser maior que inscritos',
        function (value) {
          const { subscribers } = this.parent;
          return subscribers >= value;
        },
      ),
    defaultValue: 0,
  },
};

export const classFirstSchema = yup.object<ClassFirstForm>().shape({
  subject_id: classFirstFormFields.subject_id.validator,
  code: classFirstFormFields.code.validator,
  type: classFirstFormFields.type.validator,
  vacancies: classFirstFormFields.vacancies.validator,
  subscribers: classFirstFormFields.subscribers.validator,
  pendings: classFirstFormFields.pendings.validator,
  professors: classFirstFormFields.professors.validator,
});

export const classFirstDefaultValues: ClassFirstForm = {
  subject_id: classFirstFormFields.subject_id.defaultValue,
  code: classFirstFormFields.code.defaultValue,
  type: classFirstFormFields.type.defaultValue as ClassType,
  professors: classFirstFormFields.professors.defaultValue,
  vacancies: classFirstFormFields.vacancies.defaultValue,
  subscribers: classFirstFormFields.subscribers.defaultValue,
  pendings: classFirstFormFields.pendings.defaultValue,
};
