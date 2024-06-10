import { ClassValidator } from 'utils/classes/classes.validator';
import * as yup from 'yup';
import { ClassRegisterForm } from './class.register.modal.interface';

export const formFields = {
  subject_id: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-id',
        'Campo obrigatório',
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
        'Campo obrigatório',
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
        'Campo obrigatório',
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
  semester: {
    validator: yup
      .number()
      .required('Campo obrigatório')
      .test(
        'is-valid-id',
        'Campo obrigatório',
        (value) => !ClassValidator.isInvalidSemester(value),
      ),
    defaultValue: 0,
  },
  start_date: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-date',
        'Data inválida',
        (value) => !ClassValidator.isInvalidDate(value),
      ),
    defaultValue: '',
  },
  end_date: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test(
        'is-valid-date',
        'Data inválida',
        (value) => !ClassValidator.isInvalidDate(value),
      ),
    defaultValue: '',
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
  air_conditioning: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  projector: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  accessibility: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
  ignore_to_allocate: {
    validator: yup.boolean().required('Campo obrigatório'),
    defaultValue: false,
  },
};

export const schema = yup.object<ClassRegisterForm>().shape({
  subject_id: formFields.subject_id.validator,
  code: formFields.code.validator,
  type: formFields.type.validator,
  professors: formFields.professors.validator,
  semester: formFields.semester.validator,
  start_date: formFields.start_date.validator,
  end_date: formFields.end_date.validator,
  vacancies: formFields.vacancies.validator,
  subscribers: formFields.subscribers.validator,
  pendings: formFields.pendings.validator,
  air_conditioning: formFields.air_conditioning.validator,
  projector: formFields.projector.validator,
  accessibility: formFields.accessibility.validator,
  ignore_to_allocate: formFields.ignore_to_allocate.validator,
});

export const defaultValues: ClassRegisterForm = {
  subject_id: formFields.subject_id.defaultValue,
  code: formFields.code.defaultValue,
  type: formFields.type.defaultValue,
  professors: formFields.professors.defaultValue,
  semester: formFields.semester.defaultValue,
  start_date: formFields.start_date.defaultValue,
  end_date: formFields.end_date.defaultValue,
  vacancies: formFields.vacancies.defaultValue,
  subscribers: formFields.subscribers.defaultValue,
  pendings: formFields.pendings.defaultValue,
  air_conditioning: formFields.air_conditioning.defaultValue,
  projector: formFields.projector.defaultValue,
  accessibility: formFields.accessibility.defaultValue,
  ignore_to_allocate: formFields.ignore_to_allocate.defaultValue,
};
