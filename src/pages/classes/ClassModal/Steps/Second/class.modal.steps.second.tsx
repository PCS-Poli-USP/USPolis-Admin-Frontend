import {
  Alert,
  AlertIcon,
  Button,
  Checkbox,
  HStack,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { Input, Select } from 'components/common';
import { ClassModalSecondStepProps } from './class.modal.steps.second.interface';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { MultiSelect } from 'components/common/form/MultiSelect';
import { useState } from 'react';
import DateCalendarPicker, {
  useDateCalendarPicker,
} from 'components/common/DateCalendarPicker';

interface Schedule {
  week_day: WeekDay;
  start_time: string;
  end_time: string;
  start_date: string;
  end_date: string;
}

function ClassModalSecondStep(props: ClassModalSecondStepProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const { selectedDays, occupiedDays, dayClick } = useDateCalendarPicker();
  const [isDaily, setIsDayli] = useState(false);

  function handleScheduleButton() {
    const values = props.form.getValues();
    if (isDaily) {
      const isValid = props.form.trigger(['start_time', 'end_time']);
      if (!isValid) return;
    } else {
      const isValid = props.form.trigger([
        'start_time',
        'end_time',
        'week_day',
      ]);
      if (!isValid) return;
    }

    console.log(values);
  }

  function handleSelectClassDate(date: string) {
    const values = props.form.getValues(['schedule_start_date', 'schedule_end_date']);
    const isValid = props.form.trigger(['start_time', 'end_time']);
      if (!isValid) return;
  }

  return (
    <VStack mt={5} width={'100%'} align={'stretch'}>
      <FormProvider {...props.form}>
        <form>
          <Text as={'b'} fontSize={'lg'}>
            Datas e calendários da disciplina
          </Text>
          <HStack spacing='5px' mt={4} w={'full'} mb={4}>
            <Input
              label={'Data de início da turma'}
              name={'start_date'}
              placeholder='Data de início da disciplina'
              type='date'
              value={
                props.selectedClass ? props.selectedClass.start_date : undefined
              }
              onChange={(event) => handleSelectClassDate(event.target.value)}
            />
            <Input
              label={'Data de fim da turma'}
              name={'end_date'}
              placeholder='Data de encerramento da disciplina'
              type='date'
              value={
                props.selectedClass ? props.selectedClass.end_date : undefined
              }
            />
            <MultiSelect
              label={'Calendários'}
              name={'calendar_ids'}
              placeholder={'Escolha um ou mais'}
              options={props.calendars.map((calendar) => ({
                value: calendar.id,
                label: calendar.name,
              }))}
            />
          </HStack>

          <Text as={'b'} fontSize={'lg'}>
            Horários e datas das aulas
          </Text>
          <HStack align={'center'} mt={4}>
            <Select
              label={'Recorrência'}
              name={'recurrence'}
              placeholder={'Escolha uma recorrência'}
              options={Recurrence.getValues().map((value) => ({
                label: Recurrence.translate(value),
                value: value,
              }))}
              onChange={(event) => {
                if (event.target.value === Recurrence.DAILY) {
                  setIsDayli(true);
                } else setIsDayli(false);
              }}
            />
            <Select
              label={'Dia da semana'}
              name={'week_day'}
              placeholder='Escolha o dia da semana'
              // value={week_day}
              disabled={isDaily}
              options={WeekDay.getValues().map((value: WeekDay) => ({
                label: WeekDay.translate(value),
                value: value,
              }))}
            />
          </HStack>

          <HStack spacing='5px' mt={4} alignItems={'stretch'}>
            <Input
              label={'Início da agenda'}
              name={'schedule_start_date'}
              placeholder='Data de inicio da agenda'
              type='date'
              value={
                props.selectedClass ? props.selectedClass.end_date : undefined
              }
            />
            <Input
              label={'Fim da agenda'}
              name={'schedule_end_date'}
              placeholder='Data de fim  da agenda'
              type='date'
              value={
                props.selectedClass ? props.selectedClass.end_date : undefined
              }
            />
            <Input
              label={'Horário de início'}
              name={'start_time'}
              placeholder='Horario de início da disciplina'
              type='time'
              // value={startTime}
            />
            <Input
              label={'Horário de fim'}
              name={'end_time'}
              placeholder='Horário de encerramento da disciplina'
              type='time'
              // value={endTime}
            />
            <Button
              colorScheme='teal'
              variant={'outline'}
              mt={8}
              w={220}
              onClick={handleScheduleButton}
            >
              Adicionar
            </Button>
          </HStack>

          <HStack mt={4} align={'stretch'}>
            <VStack align={'strech'}>
              <Text fontSize={'lg'} fontWeight={'bold'}>
                Agendas adicionadas
              </Text>
              {schedules ? schedules.map((val) => undefined) : undefined}
              {schedules.length === 0 ? (
                <Alert status='error' fontSize='sm' mt={4} w={450}>
                  <AlertIcon />
                  Nenhuma agenda foi adicionada
                </Alert>
              ) : undefined}
            </VStack>
            <Spacer />
            <VStack alignContent={'strech'} maxH={280}>
              {/* <Text fontSize={'lg'} fontWeight={'bold'}>
                Visualização das ocorrências
              </Text> */}
              <DateCalendarPicker
                selectedDays={selectedDays}
                occupiedDays={occupiedDays}
                dayClick={dayClick}
                readOnly={true}
              />
            </VStack>
          </HStack>
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ClassModalSecondStep;
