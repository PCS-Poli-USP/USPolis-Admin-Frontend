import { HStack, Text, VStack } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { Input } from '../../../../../components/common';
import { ClassModalSecondStepProps } from './class.modal.steps.second.interface';
import { MultiSelectInput } from '../../../../../components/common/form/MultiSelectInput';

function ClassModalSecondStep(props: ClassModalSecondStepProps) {
  function handleSelectClassDate(date: string, isStart: boolean) {
    if (isStart) {
      const { setValue } = props.thirdForm;
      setValue('schedule_start_date', date);
    }
    if (!isStart) {
      const { setValue } = props.thirdForm;
      setValue('schedule_end_date', date);
    }
  }

  return (
    <VStack mt={5} width={'100%'} align={'stretch'}>
      <FormProvider {...props.form}>
        <form>
          <Text as={'b'} fontSize={'lg'}>
            Datas e Calendários da Disciplina
          </Text>
          <HStack spacing='5px' mt={4} w={'full'} mb={4}>
            <Input
              label={'Data de início da turma'}
              name={'start_date'}
              placeholder='Data de início da disciplina'
              type='date'
              onChange={(event) =>
                handleSelectClassDate(event.target.value, true)
              }
            />
            <Input
              label={'Data de fim da turma'}
              name={'end_date'}
              placeholder='Data de encerramento da disciplina'
              type='date'
              onChange={(event) =>
                handleSelectClassDate(event.target.value, false)
              }
            />
          </HStack>
          <MultiSelectInput
            label={'Calendários (Opcional)'}
            name={'calendar_ids'}
            placeholder={'Escolha nenhum ou mais'}
            options={props.calendars.map((calendar) => ({
              value: calendar.id,
              label: calendar.name,
            }))}
          />
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ClassModalSecondStep;
