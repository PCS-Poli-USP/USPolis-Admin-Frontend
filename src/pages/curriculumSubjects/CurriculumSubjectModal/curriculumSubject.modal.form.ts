import * as yup from 'yup';
import { CurriculumSubjectForm } from './curriculumSubject.modal.interface';
import { CurriculumSubjectCategory } from '../../../utils/enums/curriculumSubjectCategory.enum';
import { CurriculumSubjectType } from '../../../utils/enums/curriculumSubjectType.enum';

export const schema = yup.object<CurriculumSubjectForm>().shape({
  subject_ids: yup
    .array()
    .of(yup.number().required())
    .min(1, 'Selecione pelo menos uma disciplina')
    .required('Obrigatório'),

  type: yup.string().required('Obrigatório'),
  category: yup.string().required("Obrigatório"),
});

export const defaultValues: CurriculumSubjectForm = {
  subject_ids: [],
  type: CurriculumSubjectType.SEMESTRAL,
  category: CurriculumSubjectCategory.MANDATORY,
};