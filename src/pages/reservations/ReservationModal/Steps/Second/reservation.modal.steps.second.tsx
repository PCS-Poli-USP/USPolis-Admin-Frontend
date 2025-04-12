import {
  Button,
  HStack,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { Input, Select } from 'components/common';
import { ReservationModalSecondStepProps } from './reservation.modal.steps.second.interface';

import DateCalendarPicker from 'components/common/DateCalendarPicker';
import { useEffect, useState } from 'react';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';
import { MonthWeek } from 'utils/enums/monthWeek.enum';
import { SelectInput } from 'components/common/form/SelectInput';
import {
  ClassroomFullResponse,
  ClassroomWithConflictCount,
} from 'models/http/responses/classroom.response.models';
import useClassrooms from 'hooks/useClassrooms';
import { sortDates } from 'utils/holidays/holidays.sorter';
import ClassroomTimeGrid from 'components/common/ClassroomTimeGrid/classroom.time.grid';
import { generateRecurrenceDates } from 'utils/common/common.generator';
import { formatClassroomForSelection } from 'utils/classrooms/classroom.formatter';

function ReservationModalSecondStep(props: ReservationModalSecondStepProps) {
  const {
    isOpen: isOpenCGrid,
    onClose: onCloseCGrid,
    onOpen: onOpenCGrid,
  } = useDisclosure();

  const { listOneFull, getClassroomsWithConflictFromTime } =
    useClassrooms(false);

  const [selectedBuilding, setSelectedBuilding] = useState<BuildingResponse>();
  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomFullResponse>();
  const [conflictedClassrooms, setConflictedClassrooms] = useState<
    ClassroomWithConflictCount[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const [datesForTimeGrid, setDatesForTimeGrid] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const { resetField, setValue, watch } = props.form;

  const start = watch('start_time');
  const end = watch('end_time');
  const start_date = watch('start_date');
  const end_date = watch('end_date');
  const recurrence = watch('recurrence');
  const month_week = watch('month_week');
  const week_day = watch('week_day');

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
    setDatesForTimeGrid(props.selectedDays);

    if (props.vinculatedSolicitation) {
      const vinculatedBuilding = props.buildings.find(
        (building) => building.name === props.vinculatedSolicitation?.building,
      );
      setSelectedBuilding(vinculatedBuilding);

      if (props.vinculatedSolicitation.classroom_id) {
        handleSelectClassroom(props.vinculatedSolicitation.classroom_id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchClassroomWithConflict(dates: string[]) {
    if (selectedBuilding && start && end) {
      setIsLoading(true);
      const conflict = await getClassroomsWithConflictFromTime(
        { start_time: start, end_time: end, dates },
        selectedBuilding.id,
      );
      setIsLoading(false);
      setConflictedClassrooms(conflict);
    } else setConflictedClassrooms([]);
  }

  useEffect(() => {
    const dates = getDatesForTimeGrid();
    setDatesForTimeGrid(dates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start_date, end_date, recurrence, month_week, week_day]);

  useEffect(() => {
    if (datesForTimeGrid.length > 0) {
      fetchClassroomWithConflict(datesForTimeGrid);
    } else {
      setConflictedClassrooms([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datesForTimeGrid, start, end]);

  function handleChangeRecurrence(value: string) {
    if (value === Recurrence.MONTHLY) {
    } else if (value === Recurrence.CUSTOM) {
      resetField('month_week', { defaultValue: undefined });
      resetField('week_day', { defaultValue: '' });
      resetField('start_date', { defaultValue: '' });
      resetField('end_date', { defaultValue: '' });
    } else if (value === Recurrence.DAILY) {
      setIsSelecting(false);
      resetField('month_week', { defaultValue: '' });
      resetField('week_day', { defaultValue: '' });
    } else {
      resetField('month_week', { defaultValue: '' });
    }
    if (value !== Recurrence.CUSTOM) {
      props.setSelectedDays([]);
      props.setDates([]);
      setIsSelecting(false);
    }
  }

  async function handleSelectClassroom(id: number) {
    const classroom = await listOneFull(id);
    setSelectedClassroom(classroom);
  }

  function getDatesForTimeGrid() {
    if (recurrence === Recurrence.CUSTOM) {
      return props.selectedDays;
    }
    return generateRecurrenceDates(
      start_date,
      end_date,
      recurrence,
      week_day as WeekDay | undefined,
      month_week as MonthWeek | undefined,
    );
  }

  return (
    <VStack w={'full'} align={'strech'} h={'full'}>
      <ClassroomTimeGrid
        isOpen={isOpenCGrid}
        onClose={onCloseCGrid}
        classroom={selectedClassroom}
        preview={{
          title: props.selectedReservation
            ? props.selectedReservation.title
            : '',
          dates: datesForTimeGrid,
          start_time: start,
          end_time: end,
        }}
        scheduleDetails={{
          recurrence,
          week_day,
          month_week,
        }}
      />
      <FormProvider {...props.form}>
        <form>
          <Text fontSize={'lg'} fontWeight={'bold'}>
            Local e Disponibilidade
          </Text>
          <HStack
            align={'center'}
            justify={'flex-start'}
            maxH={200}
            w={'full'}
            mt={'5px'}
          >
            <SelectInput
              disabled={!!props.vinculatedSolicitation}
              label={'Prédio'}
              w={'390px'}
              name={'building_id'}
              options={props.buildings.map((building) => ({
                value: building.id,
                label: building.name,
              }))}
              onChange={(event) => {
                if (event) {
                  setSelectedBuilding(
                    props.buildings.find(
                      (building) => building.id === Number(event.value),
                    ),
                  );
                } else setSelectedBuilding(undefined);
              }}
            />

            <VStack>
              <SelectInput
                label={'Sala de Aula'}
                w={'390px'}
                disabled={
                  !selectedBuilding ||
                  (props.vinculatedSolicitation &&
                    props.vinculatedSolicitation.required_classroom)
                }
                name={'classroom_id'}
                options={
                  selectedBuilding
                    ? conflictedClassrooms.length > 0
                      ? conflictedClassrooms.map((cls) => ({
                          value: cls.id,
                          label: formatClassroomForSelection(cls),
                        }))
                      : props.classrooms
                          .filter(
                            (value) =>
                              value.building_id === selectedBuilding?.id,
                          )
                          .map((classroom) => ({
                            value: classroom.id,
                            label: `${classroom.name} [${classroom.capacity}]`,
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
              <Text
                textAlign={'left'}
                w={'full'}
                hidden={
                  !(
                    props.vinculatedSolicitation &&
                    props.vinculatedSolicitation.required_classroom
                  )
                }
              >
                *A reserva vinculada quer necessariamente essa sala
              </Text>
            </VStack>

            <VStack>
              <Button
                mt={'30px'}
                w={'strech'}
                isDisabled={!selectedClassroom || isLoading}
                isLoading={isLoading}
                onClick={() => onOpenCGrid()}
              >
                Visualizar Disponibilidade
              </Button>
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
                  ? props.selectedDays.length > 0
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
                  disabled={!!props.vinculatedSolicitation}
                />
                <Select
                  label={'Dia da semana'}
                  name={'week_day'}
                  placeholder='Escolha o dia da semana'
                  disabled={
                    recurrence === Recurrence.DAILY ||
                    recurrence === Recurrence.CUSTOM
                  }
                  options={WeekDay.getValues().map((value: WeekDay) => ({
                    label: WeekDay.translate(value),
                    value: value,
                  }))}
                />

                <Select
                  label={'Semana do mês'}
                  name={'month_week'}
                  placeholder='Escolha a semana do mês'
                  disabled={recurrence !== Recurrence.MONTHLY}
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
                  disabled={recurrence === Recurrence.CUSTOM}
                  max={end_date ? end_date : undefined}
                />
                <Input
                  label={'Fim da agenda'}
                  name={'end_date'}
                  placeholder='Data de fim'
                  type='date'
                  disabled={recurrence === Recurrence.CUSTOM}
                  min={start_date ? start_date : undefined}
                />
              </HStack>

              <HStack w={'full'} mt={4}>
                <Input
                  label={'Horário de início'}
                  name={'start_time'}
                  placeholder='Horario de início da disciplina'
                  type='time'
                  disabled={
                    !!props.vinculatedSolicitation &&
                    !!props.vinculatedSolicitation.start_time
                  }
                />
                <Input
                  label={'Horário de fim'}
                  name={'end_time'}
                  placeholder='Horário de encerramento da disciplina'
                  type='time'
                  disabled={
                    !!props.vinculatedSolicitation &&
                    !!props.vinculatedSolicitation.end_time
                  }
                />
              </HStack>
            </VStack>

            <VStack h={'full'} spacing={0} mt={4} alignItems={'center'}>
              {recurrence === Recurrence.CUSTOM &&
              props.selectedDays.length === 0 ? (
                <Text w={'full'} textAlign={'center'} textColor={'red.500'}>
                  Nenhum dia selecionado
                </Text>
              ) : undefined}
              <DateCalendarPicker
                header={
                  recurrence === Recurrence.CUSTOM &&
                  props.selectedDays.length !== 0
                    ? 'Selecione as datas'
                    : ''
                }
                selectedDays={props.selectedDays}
                highlightedDays={[]}
                occupiedDays={props.occupiedDays}
                dayClick={(day) => {
                  props.dayClick(day);
                  if (props.selectedDays.includes(day)) {
                    const newDates = props.selectedDays
                      .filter((val) => val !== day)
                      .sort(sortDates);
                    props.setDates(newDates);
                    setValue('start_date', newDates[0]);
                    setValue('end_date', newDates[newDates.length - 1]);
                  } else {
                    const newDates = [...props.selectedDays, day].sort(
                      sortDates,
                    );
                    props.setDates(newDates);
                    setValue('start_date', newDates[0]);
                    setValue('end_date', newDates[newDates.length - 1]);
                  }
                }}
                readOnly={
                  !!props.vinculatedSolicitation ||
                  recurrence !== Recurrence.CUSTOM
                }
                helpText={recurrence === Recurrence.CUSTOM}
              />
            </VStack>
          </HStack>
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ReservationModalSecondStep;
