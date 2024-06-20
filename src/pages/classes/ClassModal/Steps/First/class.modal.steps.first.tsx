import { HStack, Text, VStack } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { Input, Select } from 'components/common';
import { ClassType } from 'utils/enums/classes.enum';
import { NumberInput } from 'components/common/form/NumberInput';
import { ClassModalFirstStepProps } from './class.modal.steps.first.interface';
import { useEffect, useState } from 'react';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { MultiSelect } from 'components/common/form/MultiSelect';

function ClassModalFirstStep(props: ClassModalFirstStepProps) {
  const [selectedSubject, setSelectedSubject] = useState<
    SubjectResponse | undefined
  >(undefined);
  const [selectedProfessors, setSelectedProfessors] = useState<
    string[] | undefined
  >(undefined);

  useEffect(() => {
    const subject_id = Number(props.form.getValues('subject_id'));
    if (subject_id > 0) {
      setSelectedSubject(
        props.subjects.find((subject) => subject.id === subject_id),
      );
    }

    const professors = props.form.getValues('professors');
    console.log('Valor do form: ', professors);
    if (professors && professors.length > 0) {
      setSelectedProfessors(professors);
    }
  }, [setSelectedSubject, props.subjects, props.form]);

  return (
    <VStack mt={5} width={'100%'} align={'stretch'}>
      <FormProvider {...props.form}>
        <form>
          <Text as={'b'} fontSize={'lg'}>
            Informações gerais
          </Text>

          <Select
            mt={4}
            label={'Disciplina'}
            name={'subject_id'}
            placeholder={'Selecione uma disciplina'}
            options={props.subjects.map((subject) => ({
              value: subject.id,
              label: `${subject.code} - ${subject.name}`,
            }))}
            onChange={(event) => {
              const selected = props.subjects.find(
                (subject) => subject.id === Number(event.target.value),
              );
              setSelectedSubject(selected);
            }}
          />

          <Input
            label={'Código da turma'}
            name={'code'}
            placeholder='Código da turma'
            mt={4}
          />

          <HStack spacing='8px' mt={4}>
            <NumberInput
              label={'Vagas'}
              name={'vacancies'}
              placeholder={'Quantidade de vagas'}
              min={0}
              max={99999}
            />
            <NumberInput
              label={'Inscritos'}
              name={'subscribers'}
              placeholder={'Quantidade de inscritos'}
              min={0}
              max={99999}
            />
            <NumberInput
              label={'Pendentes'}
              name={'pendings'}
              placeholder={'Quantidade de pendentes'}
              min={0}
              max={99999}
            />
          </HStack>

          <Select
            label={'Tipo de turma'}
            name={'type'}
            mt={4}
            placeholder={'Escolha o tipo da turma'}
            options={[
              { label: 'Prática', value: ClassType.PRACTIC },
              { label: 'Teórica', value: ClassType.THEORIC },
              {
                label: 'Prática Vinculada',
                value: ClassType.VINCULATED_PRACTIC,
              },
              {
                label: 'Teórica Vinculada',
                value: ClassType.VINCULATED_THEORIC,
              },
            ]}
          />
          <MultiSelect
            label={'Professores'}
            name={'professors'}
            placeholder={'Escolha os professores'}
            mt={4}
            disabled={false}
            value={
              selectedProfessors
                ? selectedProfessors.map((professor) => ({
                    value: professor,
                    label: professor,
                  }))
                : undefined
            }
            options={
              selectedSubject
                ? selectedSubject.professors.map((professor) => ({
                    value: professor,
                    label: professor,
                  }))
                : []
            }
          />
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ClassModalFirstStep;
