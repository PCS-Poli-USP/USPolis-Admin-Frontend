import { HStack, Text, VStack } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { Input, Select } from 'components/common';
import { ClassType } from 'utils/enums/classes.enum';
import { NumberInput } from 'components/common/form/NumberInput';
import { ClassValidator } from 'utils/classes/classes.validator';

import ListInput from 'components/common/form/ListInput';
import { ClassModalFirstStepProps } from './class.modal.steps.first.interface';

function ClassModalFirstStep(props: ClassModalFirstStepProps) {
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
            value={
              props.selectedClass ? props.selectedClass.subject_id : undefined
            }
            options={props.subjects.map((subject) => ({
              value: subject.id,
              label: `${subject.code} - ${subject.name}`,
            }))}
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
              value={props.selectedClass ? props.selectedClass.vacancies : 0}
              min={0}
              max={99999}
            />
            <NumberInput
              label={'Inscritos'}
              name={'subscribers'}
              placeholder={'Quantidade de inscritos'}
              value={props.selectedClass ? props.selectedClass.subscribers : 0}
              min={0}
              max={99999}
            />
            <NumberInput
              label={'Pendentes'}
              name={'pendings'}
              placeholder={'Quantidade de pendentes'}
              value={props.selectedClass ? props.selectedClass.pendings : 0}
              min={0}
              max={99999}
            />
          </HStack>

          <Select
            label={'Tipo de turma'}
            name={'type'}
            mt={4}
            value={props.selectedClass ? props.selectedClass.type : undefined}
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
          <ListInput
            listLabel={'Professores adicionados'}
            valueErrorMessage={'Professor inválido'}
            label={'Professores'}
            name={'professors'}
            isInvalid={ClassValidator.isInvalidProfessor}
            placeholder={'Digite o nome do professor'}
            mt={4}
          />
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ClassModalFirstStep;
