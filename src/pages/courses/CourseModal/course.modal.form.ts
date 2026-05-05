import * as yup from 'yup';
import { CourseForm } from './course.modal.interface';
import { CoursePeriodType } from '../../../utils/enums/coursePeriodType.enum';

export const schema = yup.object<CourseForm>().shape({
  name: yup.string().required('Obrigatório'),
  ideal_duration: yup
    .number()
    .transform((originalValue) =>
      originalValue === '' ? undefined : Number(originalValue)
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
  .required('Obrigatório'),
  period: yup.string().required(),
});

export const defaultValues: CourseForm = {
  name: '',
  ideal_duration: undefined as any,
  minimal_duration: undefined as any,
  maximal_duration: undefined as any,
  period: CoursePeriodType.INTEGRAL,
};