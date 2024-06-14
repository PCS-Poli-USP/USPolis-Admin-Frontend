import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  HStack,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SubjectResponse } from 'models/http/responses/subject.response.models';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Select } from 'components/common';
import { ClassResponse } from 'models/http/responses/class.response.models';
import { ClassModalStepsProps } from '../class.modal.steps.interface';
import {
  ClassModalSecondStepProps,
  ClassSecondForm,
} from './class.modal.steps.second.interface';
import {
  classSecondDefaultValues,
  classSecondSchema,
} from './class.modal.steps.second.form';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { MultiSelect } from 'components/common/form/MultiSelect';
import { DateCalendar } from '@mui/x-date-pickers';
import { useState } from 'react';

function ClassModalSecondStep(props: ClassModalSecondStepProps) {
  const classForm = useForm<ClassSecondForm>({
    defaultValues: classSecondDefaultValues,
    resolver: yupResolver(classSecondSchema),
  });

  const [schedules, setSchedules] = useState([]);

  return (
    <VStack mt={5} width={'100%'} align={'stretch'}>
      <FormProvider {...classForm}>
        <form>
          <Text as={'b'} fontSize={'lg'}>
            Horários, datas e agendas da disciplina
          </Text>
          <HStack spacing='5px' mt={4} w={'full'} mb={4}>
            <Input
              label={'Data de início'}
              name={'start_date'}
              placeholder='Data de início da disciplina'
              type='date'
              value={
                props.selectedClass ? props.selectedClass.start_date : undefined
              }
            />
            <Input
              label={'Data de fim'}
              name={'end_date'}
              placeholder='Data de encerramento da disciplina'
              type='date'
              value={
                props.selectedClass ? props.selectedClass.end_date : undefined
              }
            />
          </HStack>

          {/* <Text as={'b'} fontSize={'md'}>
            Agendas e Horários
          </Text> */}

          <HStack align={'center'} mt={4}>
            <MultiSelect
              label={'Calendários'}
              name={'calendar_ids'}
              placeholder={'Escolha um ou mais'}
              options={props.calendars.map((calendar) => ({
                value: calendar.id,
                label: calendar.name,
              }))}
            />

            <Select
              label={'Recorrência'}
              name={'recurrences'}
              placeholder={'Escolha uma recorrência'}
              options={Recurrence.getValues().map((value) => ({
                label: Recurrence.translate(value),
                value: value,
              }))}
            />
          </HStack>

          <HStack spacing='5px' mt={4} alignItems={'stretch'}>
            <Select
              label={'Dia da semana'}
              name={'week_days'}
              placeholder='Escolha o dia da semana'
              // value={week_day}
              options={WeekDay.getValues().map((value: WeekDay) => ({
                label: WeekDay.translate(value),
                value: value,
              }))}
            />
            <Input
              label={'Horário de Início'}
              name={'start_time'}
              placeholder='Horario de início da disciplina'
              type='time'
              // value={start_time}
            />
            <Input
              label={'Horário de fim'}
              name={'end_time'}
              placeholder='Horário de encerramento da disciplina'
              type='time'
              // value={end_time}
            />

            <Button colorScheme='teal' variant={'outline'} mt={8} w={190}>
              Adicionar
            </Button>
          </HStack>

          <HStack mt={4} align={'stretch'}>
            <VStack align={'strech'}>
              <Text fontSize={'lg'} fontWeight={'bold'}>
                Agendas adicionadas
              </Text>
              {schedules.length === 0 ? (
                <Alert status='error' fontSize='sm' mt={4} w={450}>
                  <AlertIcon />
                  Nenhuma agenda foi adicionada
                </Alert>
              ) : undefined}
            </VStack>
            <Spacer />
            <DateCalendar 
              
            />
          </HStack>
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ClassModalSecondStep;
