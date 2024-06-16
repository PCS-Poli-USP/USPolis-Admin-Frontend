import {
  Alert,
  AlertIcon,
  Button,
  HStack,
  IconButton,
  List,
  ListItem,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { Input, Select } from 'components/common';
import {
  ClassModalSecondStepProps,
  fieldNames,
  numberRange,
} from './class.modal.steps.second.interface';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { MultiSelect } from 'components/common/form/MultiSelect';
import { useEffect, useState } from 'react';
import DateCalendarPicker, {
  useDateCalendarPicker,
} from 'components/common/DateCalendarPicker';
import { classSecondDefaultValues } from './class.modal.steps.second.form';
import {
  BsCalendar2WeekFill,
  BsFillPenFill,
  BsFillTrashFill,
} from 'react-icons/bs';
import { ScheduleData } from '../../class.modal.interface';
import moment from 'moment';

function ClassModalSecondStep(props: ClassModalSecondStepProps) {
  const {
    selectedDays,
    occupiedDays,
    highlightedDays,
    dayClick,
    setHighlightedDays,
  } = useDateCalendarPicker();
  const [isDaily, setIsDayli] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    setHighlightedDays(['2024-06-15']);
  }, [setHighlightedDays]);

  function scheduleToString(schedule: ScheduleData) {
    if (
      schedule.recurrence === Recurrence.CUSTOM ||
      schedule.recurrence === Recurrence.DAILY
    )
      return `${Recurrence.translate(schedule.recurrence)}, de ${moment(
        schedule.start_date,
      ).format('DD/MM/YYYY')} até ${moment(schedule.start_date).format(
        'DD/MM/YYYY',
      )} - ${schedule.start_time} ~ ${schedule.end_time}`;
    else {
      return `${Recurrence.translate(
        schedule.recurrence,
      )}, às ${WeekDay.translate(schedule.week_day)} de ${moment(
        schedule.start_date,
      ).format('DD/MM/YYYY')} até ${moment(schedule.start_date).format(
        'DD/MM/YYYY',
      )} - ${schedule.start_time} ~ ${schedule.end_time}`;
    }
  }

  function resetScheduleInputs() {
    const { reset } = props.form;
    reset({
      week_day: classSecondDefaultValues.week_day,
      start_time: classSecondDefaultValues.start_time,
      end_time: classSecondDefaultValues.end_time,
      schedule_start_date: classSecondDefaultValues.schedule_start_date,
      schedule_end_date: classSecondDefaultValues.schedule_end_date,
      recurrence: classSecondDefaultValues.recurrence,
    });
  }

  function getScheduleInputValues() {
    const values = props.form.getValues([
      'recurrence',
      'week_day',
      'schedule_start_date',
      'schedule_end_date',
      'start_time',
      'end_time',
    ]);
    if (isDaily || isCustom) {
      values[1] = WeekDay.MONDAY;
    }
    return values;
  }

  async function validateScheduleInputs() {
    const namesDict = {
      0: 'recurrence',
      1: 'week_day',
      2: 'schedule_start_date',
      3: 'schedule_end_date',
      4: 'start_time',
      5: 'end_time',
    };

    let result = true;
    const values = getScheduleInputValues();
    for (let i = 0; i < values.length; i++) {
      const { trigger } = props.form;
      const current = await trigger(namesDict[i as numberRange] as fieldNames);
      if (!current) {
        result = false;
      }
      if (current && !values[i]) {
        const { setError } = props.form;
        setError(namesDict[i as numberRange] as fieldNames, {
          type: 'required',
          message: 'Campo Obrigatório',
        });
        result = false;
      }
    }
    return result;
  }

  async function handleScheduleButton() {
    const values = getScheduleInputValues();
    const isValid = await validateScheduleInputs();
    if (!isValid) return;

    const newSchedules = [
      ...props.schedules,
      {
        recurrence: values[0] as Recurrence,
        week_day: values[1] as WeekDay,
        start_date: values[2] as string,
        end_date: values[3] as string,
        start_time: values[4] as string,
        end_time: values[5] as string,
      },
    ];
    props.setSchedules(newSchedules);
    resetScheduleInputs();
    setIsDayli(false);
    setIsCustom(false);
  }

  function handleSelectClassDate(date: string, isStart: boolean) {
    const values = props.form.getValues([
      'schedule_start_date',
      'schedule_end_date',
    ]);
    if (isStart && !values[0]) {
      const { setValue } = props.form;
      setValue('schedule_start_date', date);
    }
    if (!isStart && !values[1]) {
      const { setValue } = props.form;
      setValue('schedule_end_date', date);
    }
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
              onChange={(event) =>
                handleSelectClassDate(event.target.value, true)
              }
            />
            <Input
              label={'Data de fim da turma'}
              name={'end_date'}
              placeholder='Data de encerramento da disciplina'
              type='date'
              value={
                props.selectedClass ? props.selectedClass.end_date : undefined
              }
              onChange={(event) =>
                handleSelectClassDate(event.target.value, false)
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
                if (event.target.value === Recurrence.CUSTOM) {
                  setIsCustom(true);
                } else setIsCustom(false);
              }}
            />
            <Select
              label={'Dia da semana'}
              name={'week_day'}
              placeholder='Escolha o dia da semana'
              // value={week_day}
              disabled={isDaily || isCustom}
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
              w={240}
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
              {props.schedules.length > 0 ? (
                <List spacing={3}>
                  {props.schedules.map((val, index) => (
                    <ListItem key={index}>
                      <HStack>
                        <BsCalendar2WeekFill />
                        <Text>{scheduleToString(val)}</Text>

                        <Tooltip label='Editar'>
                          <IconButton
                            colorScheme='yellow'
                            size='sm'
                            variant='ghost'
                            aria-label='editar-valor'
                            icon={<BsFillPenFill />}
                            onClick={() => console.log('Editando')}
                          />
                        </Tooltip>

                        <Tooltip label='Remover'>
                          <IconButton
                            colorScheme='red'
                            size='sm'
                            variant='ghost'
                            aria-label='remover-valor'
                            icon={<BsFillTrashFill />}
                            onClick={() => console.log('Deletandoo', index)}
                          />
                        </Tooltip>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              ) : undefined}
              {props.schedules.length === 0 ? (
                <Alert status='error' fontSize='sm' mt={4} w={450}>
                  <AlertIcon />
                  Nenhuma agenda foi adicionada
                </Alert>
              ) : undefined}
            </VStack>
            <Spacer />
            <VStack alignContent={'strech'} maxH={280}>
              <Text fontSize={'lg'} fontWeight={'bold'}>
                Visualização das ocorrências
              </Text>
              <DateCalendarPicker
                selectedDays={selectedDays}
                highlightedDays={highlightedDays}
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
