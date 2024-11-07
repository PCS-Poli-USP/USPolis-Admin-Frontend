import { HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { Input, Select } from 'components/common';
import { ReservationModalSecondStepProps } from './reservation.modal.steps.second.interface';

import DateCalendarPicker, {
  useDateCalendarPicker,
} from 'components/common/DateCalendarPicker';
import { useEffect, useState } from 'react';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { MonthWeek } from 'utils/enums/monthWeek.enum';
import { SelectInput } from 'components/common/form/SelectInput';
import ClassroomCalendar from 'components/common/ClassroomCalendar';
import { ClassroomFullResponse } from 'models/http/responses/classroom.response.models';
import useClassrooms from 'hooks/useClassrooms';
import { sortDates } from 'utils/holidays/holidays.sorter';

function ReservationModalSecondStep(props: ReservationModalSecondStepProps) {
  const {
    selectedDays,
    occupiedDays,
    highlightedDays,
    dayClick,
    setHighlightedDays,
    setSelectedDays,
  } = useDateCalendarPicker();
  const { listOneFull } = useClassrooms();
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingResponse>();
  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomFullResponse>();
  const [isDaily, setIsDayli] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const { resetField } = props.form;

  useEffect(() => {
    const { getValues } = props.form;
    const building_id = Number(getValues('building_id'));
    if (building_id > 0) {
      setSelectedBuilding(
        props.buildings.find((building) => building.id === building_id),
      );
    }

    const classroom_id = Number(getValues('classroom_id'));
    if (classroom_id > 0) {
      handleSelectClassroom(classroom_id);
    }

    if (props.selectedReservation) {
      if (props.selectedReservation.schedule.occurrences) {
        setSelectedDays(
          props.selectedReservation.schedule.occurrences.map(
            (occur) => occur.date,
          ),
        );
      }
      handleChangeRecurrence(props.selectedReservation.schedule.recurrence);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChangeRecurrence(value: string) {
    if (value === Recurrence.MONTHLY) {
      setIsCustom(false);
      setIsDayli(false);
      setIsMonthly(true);
      setSelectedDays([]);
      setIsSelecting(false);
    } else if (value === Recurrence.CUSTOM) {
      setIsCustom(true);
      setIsDayli(false);
      setIsMonthly(false);
      setIsSelecting(true);
      resetField('month_week', { defaultValue: '' });
      resetField('week_day', { defaultValue: '' });
    } else if (value === Recurrence.DAILY) {
      setIsCustom(false);
      setIsDayli(true);
      setIsMonthly(false);
      setSelectedDays([]);
      setIsSelecting(false);
      resetField('month_week', { defaultValue: '' });
      resetField('week_day', { defaultValue: '' });
    } else {
      setIsCustom(false);
      setIsDayli(false);
      setIsMonthly(false);
      setSelectedDays([]);
      setIsSelecting(false);
      resetField('month_week', { defaultValue: '' });
    }
  }

  async function handleSelectClassroom(id: number) {
    const classroom = await listOneFull(id);
    setSelectedClassroom(classroom);
    setHighlightedDays(
      classroom
        ? classroom.schedules.reduce<string[]>(
            (acc, schedule) =>
              acc.concat(schedule.occurrences.map((occur) => occur.date)),
            [],
          )
        : [],
    );
  }

  return (
    <VStack w={'full'} align={'strech'} h={'full'}>
      <FormProvider {...props.form}>
        <form>
          <Text fontSize={'lg'} fontWeight={'bold'}>
            Local e Disponibilidade
          </Text>
          <HStack alignContent={'stretch'} maxH={200} w={'full'}>
            <VStack w={'full'} alignSelf={'flex-start'}>
              <Select
                mt={4}
                label={'Prédio'}
                name={'building_id'}
                options={props.buildings.map((building) => ({
                  value: building.id,
                  label: building.name,
                }))}
                onChange={(event) => {
                  setSelectedBuilding(
                    props.buildings.find(
                      (building) => building.id === Number(event.target.value),
                    ),
                  );
                }}
              />
              <SelectInput
                mt={4}
                label={'Sala de Aula'}
                disabled={!selectedBuilding}
                name={'classroom_id'}
                options={
                  selectedBuilding
                    ? props.classrooms
                        .filter(
                          (value) => value.building_id === selectedBuilding?.id,
                        )
                        .map((classroom) => ({
                          value: classroom.id,
                          label: classroom.name,
                        }))
                    : []
                }
                onChange={(event) => {
                  if (event) {
                    handleSelectClassroom(Number(event.value));
                  } else {
                    setSelectedClassroom(undefined);
                  }
                }}
              />
            </VStack>
            <Spacer></Spacer>
            <VStack w={'auto'} h={'full'}>
              <ClassroomCalendar classroom={selectedClassroom} h={130} />
            </VStack>
          </HStack>

          <HStack mt={8}>
            <Text fontSize={'lg'} fontWeight={'bold'}>
              Horários
            </Text>
            <Spacer />
            <Text
              textAlign={'center'}
              fontSize={'lg'}
              rounded={10}
              hidden={!isSelecting}
              fontWeight={isSelecting ? 'bold' : 'thin'}
              color={
                isSelecting
                  ? selectedDays.length > 0
                    ? undefined
                    : 'red'
                  : 'gray'
              }
              mr={20}
            >
              {'Selecione as Datas'}
            </Text>
          </HStack>
          <HStack w={'full'} h={'full'} mt={-5}>
            <VStack h={'full'} w={'full'}>
              <HStack align={'center'} w={'full'} mt={4}>
                <Select
                  label={'Recorrência'}
                  name={'recurrence'}
                  placeholder={'Escolha uma recorrência'}
                  options={Recurrence.getValues().map((value) => ({
                    label: Recurrence.translate(value),
                    value: value,
                  }))}
                  onChange={(event) => {
                    // clearErrors(['month_week', 'week_day']);
                    handleChangeRecurrence(event.target.value);
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

              <HStack spacing='5px' alignItems={'stretch'} w={'full'} mt={4}>
                <Input
                  label={'Início da agenda'}
                  name={'start_date'}
                  placeholder='Data de inicio'
                  type='date'
                />
                <Input
                  label={'Fim da agenda'}
                  name={'end_date'}
                  placeholder='Data de fim'
                  type='date'
                />
              </HStack>

              <HStack w={'full'} mt={4}>
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
              </HStack>
            </VStack>

            <VStack h={'full'} spacing={0} mt={4} alignItems={'center'}>
              <DateCalendarPicker
                selectedDays={selectedDays}
                highlightedDays={highlightedDays}
                occupiedDays={occupiedDays}
                dayClick={(day) => {
                  dayClick(day);
                  if (selectedDays.includes(day)) {
                    const newDates = selectedDays.filter((val) => val !== day);
                    newDates.sort(sortDates);
                    props.setDates(newDates);
                  } else {
                    props.setDates([...selectedDays, day].sort(sortDates));
                  }
                }}
                readOnly={false}
              />
            </VStack>
          </HStack>
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ReservationModalSecondStep;
