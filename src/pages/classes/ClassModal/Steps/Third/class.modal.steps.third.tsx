import {
  Alert,
  AlertIcon,
  Button,
  HStack,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  ClassModalThirdStepProps,
  fieldNames,
  numberRange,
} from './class.modal.steps.third.interface';
import { FormProvider } from 'react-hook-form';
import { ScheduleData } from '../../class.modal.interface';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { MonthWeek } from 'utils/enums/monthWeek.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { classThirdDefaultValues } from './class.modal.steps.third.form';
import { sortScheduleData } from '../class.modal.steps.utils';
import { useEffect, useState } from 'react';
import DateCalendarPicker, {
  useDateCalendarPicker,
} from 'components/common/DateCalendarPicker';
import { generateRecurrenceDates } from 'utils/common/common.generator';
import { Input, Select } from 'components/common';
import ScheduleList from '../ScheduleList/class.modal.steps.scheduleList';

function ClassModalThirdStep(props: ClassModalThirdStepProps) {
  const {
    selectedDays,
    occupiedDays,
    highlightedDays,
    dayClick,
    setHighlightedDays,
    setSelectedDays,
  } = useDateCalendarPicker();
  const [isDaily, setIsDayli] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isUpdatingSchedule, setIsUpdatingSchedule] = useState(false);
  const [scheduleIndex, setScheduleIndex] = useState(0);

  useEffect(() => {
    const allDates: string[] = [];
    props.schedules.forEach((schedule) =>
      allDates.push(
        ...generateRecurrenceDates(
          schedule.start_date,
          schedule.end_date,
          schedule.recurrence,
          schedule.week_day,
          schedule.month_week,
        ),
      ),
    );
    setHighlightedDays(allDates);
  }, [props.schedules, setHighlightedDays]);

  function resetScheduleInputs() {
    const { reset } = props.form;
    const { getValues } = props.secondForm;
    const values = getValues(['start_date', 'end_date']);
    reset({
      ...props.form.getValues(),
      week_day: classThirdDefaultValues.week_day,
      start_time: classThirdDefaultValues.start_time,
      end_time: classThirdDefaultValues.end_time,
      schedule_start_date: values[0],
      schedule_end_date: values[1],
      recurrence: classThirdDefaultValues.recurrence,
      month_week: classThirdDefaultValues.month_week,
    });
  }

  function getScheduleInputValues() {
    const values = props.form.getValues([
      'recurrence',
      'month_week',
      'week_day',
      'schedule_start_date',
      'schedule_end_date',
      'start_time',
      'end_time',
    ]);
    return values;
  }

  async function validateScheduleInputs(
    values: [
      Recurrence | undefined,
      MonthWeek | undefined,
      WeekDay | undefined,
      string | undefined,
      string | undefined,
      string | undefined,
      string | undefined,
    ],
  ) {
    const namesDict = {
      0: 'recurrence',
      1: 'month_week',
      2: 'week_day',
      3: 'schedule_start_date',
      4: 'schedule_end_date',
      5: 'start_time',
      6: 'end_time',
    };

    let result = true;
    for (let i = 0; i < values.length; i++) {
      const { trigger } = props.form;
      const fieldName = namesDict[i as numberRange] as fieldNames;
      const current = await trigger(fieldName);
      if (!current) {
        result = false;
      }
      if (
        current &&
        !values[i] &&
        fieldName !== 'week_day' &&
        fieldName !== 'month_week'
      ) {
        const { setError } = props.form;
        setError(namesDict[i as numberRange] as fieldNames, {
          type: 'required',
          message: 'Campo Obrigatório',
        });
        result = false;
      }
      // week_day can be null when recurrence is dayli or custom
      if (fieldName === 'week_day') {
        if (
          !values[i] &&
          values[0] !== Recurrence.CUSTOM &&
          values[0] !== Recurrence.DAILY
        ) {
          const { setError } = props.form;
          setError('week_day', {
            type: 'required',
            message: 'Campo Obrigatório',
          });
          result = false;
        }
      }
      // month week can't be null when recurrence is monthly
      if (fieldName === 'month_week') {
        if (!values[i] && values[0] === Recurrence.MONTHLY) {
          const { setError } = props.form;
          setError('month_week', {
            type: 'required',
            message: 'Campo Obrigatório',
          });
          result = false;
        }
      }
    }
    return result;
  }

  function updateSchedules(schedule: ScheduleData) {
    if (isUpdatingSchedule) {
      const newSchedules = [...props.schedules];
      newSchedules[scheduleIndex] = schedule;
      props.setSchedules(newSchedules.sort(sortScheduleData));
    } else {
      const newSchedules = [...props.schedules, schedule];
      props.setSchedules(newSchedules.sort(sortScheduleData));
    }
  }

  function handleDeleteScheduleClick(index: number) {
    if (scheduleIndex === index) {
      const { reset } = props.form;
      reset({
        ...props.form.getValues(),
        schedule_start_date: classThirdDefaultValues.schedule_start_date,
        schedule_end_date: classThirdDefaultValues.schedule_end_date,
        recurrence: classThirdDefaultValues.recurrence,
        week_day: classThirdDefaultValues.week_day,
        month_week: classThirdDefaultValues.month_week,
        start_time: classThirdDefaultValues.start_time,
        end_time: classThirdDefaultValues.end_time,
      });
      setSelectedDays([]);
      setIsCustom(false);
      setIsDayli(false);
    }
    const newSchedules = [...props.schedules];
    newSchedules.splice(index, 1);
    props.setSchedules(newSchedules);
    setScheduleIndex(0);
  }

  function handleUpdateScheduleClick(index: number) {
    const { reset } = props.form;
    const schedule = props.schedules[index];
    reset({
      ...props.form.getValues(),
      schedule_start_date: schedule.start_date,
      schedule_end_date: schedule.end_date,
      recurrence: schedule.recurrence,
      month_week: schedule.month_week,
      week_day: schedule.week_day,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
    });
    if (schedule.recurrence === Recurrence.CUSTOM && schedule.dates) {
      setIsSelecting(true);
      setIsCustom(true);
      setSelectedDays(schedule.dates);
    }
    if (schedule.recurrence === Recurrence.MONTHLY) {
      setIsMonthly(true);
    }
    setScheduleIndex(index);
    setIsUpdatingSchedule(true);
  }

  async function handleScheduleButton() {
    const values = getScheduleInputValues();
    const isValid = await validateScheduleInputs(values);
    if (!isValid) return;
    const schedule: ScheduleData = {
      recurrence: values[0] as Recurrence,
      month_week: values[1] as MonthWeek,
      week_day: values[2] as WeekDay,
      start_date: values[3] as string,
      end_date: values[4] as string,
      start_time: values[5] as string,
      end_time: values[6] as string,
    };
    if (isCustom) {
      if (selectedDays.length === 0) return;
      schedule.dates = selectedDays;
    }
    updateSchedules(schedule);
    resetScheduleInputs();
    setIsDayli(false);
    setIsCustom(false);
    setIsMonthly(false);
    setIsUpdatingSchedule(false);
  }

  return (
    <VStack mt={5} width={'100%'} align={'stretch'} spacing={4}>
      <FormProvider {...props.form}>
        <form>
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
                const { clearErrors } = props.form;
                clearErrors(['month_week', 'week_day']);
                if (event.target.value === Recurrence.DAILY) {
                  setIsDayli(true);
                } else setIsDayli(false);
                if (event.target.value === Recurrence.MONTHLY) {
                  setIsMonthly(true);
                } else setIsMonthly(false);

                if (event.target.value === Recurrence.CUSTOM) {
                  setIsCustom(true);
                  setIsSelecting(true);
                } else {
                  setIsCustom(false);
                  setIsSelecting(false);
                  setSelectedDays([]);
                }
              }}
            />
            <Select
              label={'Dia da semana'}
              name={'week_day'}
              placeholder='Escolha o dia da semana'
              disabled={isDaily || isCustom}
              options={WeekDay.getValues().map((value: WeekDay) => ({
                label: WeekDay.translate(value),
                value: value,
              }))}
            />

            <Select
              label={'Semana do mês'}
              name={'month_week'}
              placeholder='Escolha a semana do mês'
              disabled={!isMonthly}
              options={MonthWeek.getValues().map((value: MonthWeek) => ({
                label: MonthWeek.translate(value),
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
            />
            <Input
              label={'Fim da agenda'}
              name={'schedule_end_date'}
              placeholder='Data de fim  da agenda'
              type='date'
            />
          </HStack>

          <HStack mt={4}>
            <Input
              label={'Horário de início'}
              name={'start_time'}
              placeholder='Horario de início da disciplina'
              type='time'
            />
            <Input
              label={'Horário de fim'}
              name={'end_time'}
              placeholder='Horário de encerramento da disciplina'
              type='time'
            />
            <Button
              colorScheme='teal'
              mt={8}
              w={240}
              onClick={handleScheduleButton}
              disabled={selectedDays.length === 0 && isSelecting}
            >
              {isUpdatingSchedule ? 'Atualizar' : 'Adicionar'}
            </Button>
          </HStack>

          <HStack mt={4} align={'stretch'}>
            <ScheduleList
              schedules={props.schedules}
              handleUpdateScheduleClick={handleUpdateScheduleClick}
              handleDeleteScheduleClick={handleDeleteScheduleClick}
            />
            <Spacer />
            <VStack alignContent={'strech'} maxH={320}>
              <Text fontSize={'md'} fontWeight={'bold'}>
                {isSelecting
                  ? 'Selecione as datas'
                  : 'Visualização das ocorrências'}
              </Text>
              {isSelecting && selectedDays.length === 0 ? (
                <Alert status='error' fontSize='md' mt={0} w={'full'}>
                  <AlertIcon />
                  Nenhuma data foi selecionada
                </Alert>
              ) : undefined}
              <DateCalendarPicker
                selectedDays={selectedDays}
                highlightedDays={highlightedDays}
                occupiedDays={occupiedDays}
                dayClick={dayClick}
                readOnly={!isSelecting}
              />
            </VStack>
          </HStack>
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ClassModalThirdStep;
