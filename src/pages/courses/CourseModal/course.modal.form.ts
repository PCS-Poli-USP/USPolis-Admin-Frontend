import * as yup from 'yup';
import { CourseForm } from './course.modal.interface';
import { CoursePeriodType } from '../../../utils/enums/coursePeriodType.enum';

export const schema = yup.object<CourseForm>().shape({
  name: yup
    .string()
    .trim()
    .required('Obrigatório'),

  ideal_duration: yup
    .number()
    .transform((originalValue) =>
      originalValue === '' ? undefined : Number(originalValue)
    )
    .max(
      20,
      'A duração ideal deve ser no máximo 20 períodos',
    )
    .required('Obrigatório'),

  minimal_duration: yup
    .number()
    .transform((originalValue) =>
      originalValue === '' ? undefined : Number(originalValue)
    )
    .required('Obrigatório'),

  maximal_duration: yup
    .number()
    .transform((originalValue) =>
      originalValue === '' ? undefined : Number(originalValue)
    )
    .required('Obrigatório')
    .test(
      'max-greater-than-min',
      'A duração máxima deve ser maior que a mínima',
      function (value) {
        const { minimal_duration } = this.parent;

        if (
          value === undefined ||
          minimal_duration === undefined
        ) {
          return true;
        }

        return value > minimal_duration;
      },
    ),

  period: yup.string().required(),
});

export const defaultValues: CourseForm = {
  name: '',
  ideal_duration: undefined as any,
  minimal_duration: undefined as any,
  maximal_duration: undefined as any,
  period: CoursePeriodType.INTEGRAL,
};