import { HStack, Text, VStack } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { Input, SelectInput } from '../../../../../components/common';
import { ClassType } from '../../../../../utils/enums/classes.enum';
import { NumberInput } from '../../../../../components/common/form/NumberInput';
import { ClassModalFirstStepProps } from './class.modal.steps.first.interface';
import { useEffect, useState } from 'react';
import { SubjectResponse } from '../../../../../models/http/responses/subject.response.models';
import { MultiSelect } from '../../../../../components/common/form/MultiSelect';

function ClassModalFirstStep(props: ClassModalFirstStepProps) {
  const [selectedSubject, setSelectedSubject] = useState<
    SubjectResponse | undefined
  >(undefined);

  const [professors, setProfessors] = useState<string[]>(
    props.form.getValues('professors') || [],
  );

  useEffect(() => {
    const subject_id = Number(props.form.getValues('subject_id'));
    if (subject_id > 0) {
      setSelectedSubject(
        props.subjects.find((subject) => subject.id === subject_id),
      );
    }
  }, [setSelectedSubject, props.subjects, props.form]);

  useEffect(() => {
    if (selectedSubject && props.isUpdate) {
      const subjectProfessors = selectedSubject.professors.map(
        (professor) => professor,
      );
      for (const professor of props.form.getValues('professors')) {
        if (!subjectProfessors.includes(professor)) {
          subjectProfessors.push(professor);
        }
      }
      setProfessors(subjectProfessors);
    }
  }, [selectedSubject, props.isUpdate, props.form]);

  return (
    <VStack mt={5} width={'100%'} align={'stretch'}>
      <FormProvider {...props.form}>
        <form>
          <Text as={'b'} fontSize={'lg'}>
            Informações gerais
          </Text>

          <SelectInput
            mt={4}
            label={'Disciplina'}
            name={'subject_id'}
            placeholder={'Selecione uma disciplina'}
            options={props.subjects.map((subject) => ({
              value: subject.id,
              label: `${subject.code} - ${subject.name}`,
            }))}
            onChange={(option) => {
              if (option) {
                const selected = props.subjects.find(
                  (subject) => subject.id === option.value,
                );
                setSelectedSubject(selected);
              } else setSelectedSubject(undefined);
            }}
          />

          <Input
            label={'Código da turma'}
            name={'code'}
            placeholder='Código da turma'
            mt={4}
          />

          <HStack spacing='8px' mt={4}>
            <SelectInput
              label={'Tipo de turma'}
              name={'type'}
              placeholder={'Escolha o tipo da turma'}
              options={ClassType.getValues().map((type) => ({
                value: type,
                label: ClassType.translate(type),
              }))}
            />
            <NumberInput
              label={'Vagas'}
              name={'vacancies'}
              placeholder={'Quantidade de vagas'}
              min={0}
              max={99999}
            />
          </HStack>

          <MultiSelect
            label={'Professores'}
            name={'professors'}
            placeholder={'Escolha os professores'}
            mt={4}
            disabled={false}
            options={professors.map((professor) => ({
              value: professor,
              label: professor,
            }))}
          />
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ClassModalFirstStep;
