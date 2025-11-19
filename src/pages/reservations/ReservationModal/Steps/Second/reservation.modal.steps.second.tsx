import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  HStack,
  Spacer,
  Text,
  useDisclosure,
  VStack,
  Input as ChakraInput,
} from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { CheckBox, Input, SelectInput } from '../../../../../components/common';
import { ReservationModalSecondStepProps } from './reservation.modal.steps.second.interface';

import DateCalendarPicker from '../../../../../components/common/DateCalendarPicker';
import { useEffect, useState } from 'react';
import { BuildingResponse } from '../../../../../models/http/responses/building.response.models';
import { Recurrence } from '../../../../../utils/enums/recurrence.enum';
import { WeekDay } from '../../../../../utils/enums/weekDays.enum';
import { MonthWeek } from '../../../../../utils/enums/monthWeek.enum';

import {
  ClassroomFullResponse,
  ClassroomWithConflictCount,
} from '../../../../../models/http/responses/classroom.response.models';
import useClassrooms from '../../../../../hooks/classrooms/useClassrooms';
import { sortDates } from '../../../../../utils/holidays/holidays.sorter';
import ClassroomTimeGrid from '../../../../../components/common/ClassroomTimeGrid/classroom.time.grid';
import { generateRecurrenceDates } from '../../../../../utils/common/common.generator';
import { formatClassroomForSelection } from '../../../../../utils/classrooms/classroom.formatter';
import { ReservationType } from '../../../../../utils/enums/reservations.enum';
import moment from 'moment';

function ReservationModalSecondStep(props: ReservationModalSecondStepProps) {
  const isMobile = props.focusMobile.isMobile;

  const {
    isOpen: isOpenCGrid,
    onClose: onCloseCGrid,
    onOpen: onOpenCGrid,
  } = useDisclosure();

  const { listOneFull, getClassroomsWithConflict } = useClassrooms(false);

  const [selectedBuilding, setSelectedBuilding] = useState<
    BuildingResponse | undefined
  >(undefined);
  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomFullResponse>();
  const [conflictedClassrooms, setConflictedClassrooms] = useState<
    ClassroomWithConflictCount[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const [datesForTimeGrid, setDatesForTimeGrid] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [labelMap, setLabelMap] = useState<Map<string, string>>(new Map());
  const [timeMap, setTimeMap] = useState<Map<string, [string, string]>>(
    new Map(),
  );

  const { resetField, setValue, watch, formState } = props.form;
  const { errors } = formState;

  const start = watch('start_time');
  const end = watch('end_time');
  const start_date = watch('start_date');
  const end_date = watch('end_date');
  const recurrence = watch('recurrence');
  const month_week = watch('month_week');
  const week_day = watch('week_day');

  const reservation_type = props.firstForm.watch('type');
  const labels = watch('labels');
  const times = watch('times');
  const is_solicitation = watch('is_solicitation');
  const optional_classroom = watch('optional_classroom');
  const required_classroom = watch('required_classroom');
  const classroom_id = watch('classroom_id');

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

    if (reservation_type === ReservationType.EXAM) {
      setValue('recurrence', Recurrence.CUSTOM);
      const labels = getValues('labels');
      const times = getValues('times');

      if (labels && times) {
        props.selectedDates.forEach((date, idx) => {
          setLabelMap((prev) => {
            const newMap = new Map(prev);
            newMap.set(date, labels[idx]);
            return newMap;
          });
          setTimeMap((prev) => {
            const newMap = new Map(prev);
            newMap.set(date, times[idx]);
            return newMap;
          });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchClassroomWithConflict(dates: string[]) {
    if (selectedBuilding && start && end) {
      setIsLoading(true);
      const ids: number[] = [];
      if (props.selectedReservation)
        ids.push(
          ...(props.selectedReservation.schedule.occurrences?.map(
            (o) => o.id || 0,
          ) || []),
        );
      const filteredTimes = Array(...timeMap.values()).filter(
        (val) => val[0] && val[1],
      );
      const conflict = await getClassroomsWithConflict(
        {
          start_time: start,
          end_time: end,
          recurrence: Recurrence.CUSTOM,
          dates,
          times:
            filteredTimes && filteredTimes.length == dates.length
              ? filteredTimes
              : undefined,
          exclude_ids: ids,
        },
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
  }, [
    start_date,
    end_date,
    recurrence,
    month_week,
    week_day,
    props.selectedDates,
  ]);

  useEffect(() => {
    if (datesForTimeGrid.length > 0) {
      fetchClassroomWithConflict(datesForTimeGrid);
    } else {
      setConflictedClassrooms([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    datesForTimeGrid,
    start,
    end,
    props.selectedReservation,
    props.selectedDates,
    timeMap,
  ]);

  useEffect(() => {
    if (reservation_type === ReservationType.EXAM) {
      setValue('labels', Array.from(labelMap.values()));
      const newTimes = Array.from(timeMap.values());
      setValue('times', newTimes);
      if (newTimes.length > 0) {
        setValue('start_time', newTimes[0][0]);
        setValue('end_time', newTimes[0][1]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelMap, timeMap]);

  function handleChangeRecurrence(value: string) {
    if (value === Recurrence.CUSTOM) {
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
          start_times: datesForTimeGrid.map((_, idx) =>
            times ? (times[idx] ? times[idx][0] : '') : start,
          ),
          end_times: datesForTimeGrid.map((_, idx) =>
            times ? (times[idx] ? times[idx][1] : '') : end,
          ),
        }}
        scheduleDetails={{
          recurrence,
          week_day,
          month_week,
        }}
      />
      <FormProvider {...props.form}>
        <form>
          <Text fontSize={'xl'} fontWeight={'bold'} mb={'10px'}>
            {reservation_type
              ? props.isUpdate
                ? `Atualizando ${ReservationType.translate(reservation_type)}`
                : `Criando ${ReservationType.translate(reservation_type)}`
              : 'Escolha um tipo de reserva primeiro'}
          </Text>
          <Text fontSize={'lg'} fontWeight={'bold'}>
            Local e Disponibilidade
          </Text>
          <Flex
            direction={isMobile ? 'column' : 'row'}
            align={'flex-start'}
            justify={'flex-start'}
            gap={isMobile ? '10px' : '0px'}
          >
            <VStack
              alignItems={'flex-start'}
              justify={'flex-start'}
              maxH={200}
              w={'fit-content'}
            >
              <SelectInput
                label={'Prédio'}
                w={isMobile ? '360px' : '390px'}
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
                onFocus={props.focusMobile.onFocusInput}
                onBlur={props.focusMobile.onBlur}
              />
              {is_solicitation && (
                <CheckBox
                  name='optional_classroom'
                  text='Não quero especificar sala'
                  disabled={!!required_classroom}
                  onChange={(val) => {
                    if (val) {
                      setValue('optional_classroom', false);
                      setValue('classroom_id', undefined);
                    }
                  }}
                />
              )}
            </VStack>

            <VStack alignItems={'flex-start'} w={'fit-content'}>
              <SelectInput
                label={'Sala de Aula'}
                w={isMobile ? '360px' : '390px'}
                disabled={!selectedBuilding || !!optional_classroom}
                placeholder={
                  !selectedBuilding
                    ? 'Selecione um prédio primeiro'
                    : 'Selecione uma sala'
                }
                name={'classroom_id'}
                options={
                  selectedBuilding
                    ? conflictedClassrooms.length > 0
                      ? conflictedClassrooms.map((cls) => ({
                          value: cls.id,
                          label: formatClassroomForSelection(cls),
                          tooltip: cls.observation,
                        }))
                      : props.classrooms
                          .filter(
                            (value) =>
                              value.building_id === selectedBuilding?.id,
                          )
                          .map((classroom) => ({
                            value: classroom.id,
                            label: `${classroom.name} [${classroom.capacity}]`,
                            tooltip: classroom.observation,
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
                onFocus={props.focusMobile.onFocusInput}
                onBlur={props.focusMobile.onBlur}
              />

              {is_solicitation && (
                <CheckBox
                  name='required_classroom'
                  text='Necessariamente essa sala'
                  disabled={
                    !!optional_classroom || !classroom_id || !selectedBuilding
                  }
                />
              )}
            </VStack>

            <Button
              mt={isMobile ? '10px' : '30px'}
              w={'strech'}
              isDisabled={!selectedClassroom || isLoading}
              isLoading={isLoading}
              onClick={() => onOpenCGrid()}
            >
              Visualizar Disponibilidade
            </Button>
          </Flex>
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
          {!reservation_type && (
            <Alert status='error'>
              <AlertIcon />
              Selecione um tipo de reserva primeiro!
            </Alert>
          )}
          {!!reservation_type && (
            <>
              <Flex
                w={'full'}
                h={'full'}
                mt={0}
                gap={'5px'}
                justify={'flex-start'}
                align={'flex-start'}
                direction={isMobile ? 'column' : 'row'}
                mb={isMobile ? '20px' : '0px'}
              >
                <VStack
                  h={'full'}
                  w={'full'}
                  align={'flex-start'}
                  justify={'flex-start'}
                  hidden={isMobile && reservation_type === ReservationType.EXAM}
                >
                  <Flex
                    direction={isMobile ? 'column' : 'row'}
                    gap={'5px'}
                    align={'center'}
                    w={'full'}
                    mt={4}
                  >
                    <SelectInput
                      hidden={
                        isMobile && reservation_type === ReservationType.EXAM
                      }
                      label={'Recorrência'}
                      name={'recurrence'}
                      placeholder={'Escolha uma recorrência'}
                      options={Recurrence.getValues().map((value) => ({
                        label: Recurrence.translate(value),
                        value: value,
                      }))}
                      onChange={(option) => {
                        if (option) {
                          handleChangeRecurrence(option.value as string);
                        }
                      }}
                      disabled={reservation_type === ReservationType.EXAM}
                      onFocus={props.focusMobile.onFocusInput}
                      onBlur={props.focusMobile.onBlur}
                    />
                    <SelectInput
                      hidden={
                        isMobile && reservation_type === ReservationType.EXAM
                      }
                      label={'Dia da semana'}
                      name={'week_day'}
                      placeholder='Escolha o dia da semana'
                      disabled={
                        recurrence === Recurrence.DAILY ||
                        recurrence === Recurrence.CUSTOM
                      }
                      validator={(val) => val !== ''}
                      options={WeekDay.getValues().map((value: WeekDay) => ({
                        label: WeekDay.translate(value),
                        value: value,
                      }))}
                      onFocus={props.focusMobile.onFocusInput}
                      onBlur={props.focusMobile.onBlur}
                    />

                    <SelectInput
                      hidden={
                        isMobile && reservation_type === ReservationType.EXAM
                      }
                      label={'Semana do mês'}
                      name={'month_week'}
                      placeholder='Escolha a semana do mês'
                      disabled={recurrence !== Recurrence.MONTHLY}
                      options={MonthWeek.getValues().map(
                        (value: MonthWeek) => ({
                          label: MonthWeek.translate(value),
                          value: value,
                        }),
                      )}
                      onFocus={props.focusMobile.onFocusInput}
                      onBlur={props.focusMobile.onBlur}
                    />
                  </Flex>

                  <HStack
                    spacing='5px'
                    alignItems={'stretch'}
                    w={'full'}
                    mt={4}
                  >
                    <Input
                      hidden={
                        isMobile && reservation_type === ReservationType.EXAM
                      }
                      label={'Início da agenda'}
                      name={'start_date'}
                      placeholder='Data de inicio'
                      type='date'
                      disabled={recurrence === Recurrence.CUSTOM}
                      max={end_date ? end_date : undefined}
                      onFocus={props.focusMobile.onFocusInput}
                      onBlur={props.focusMobile.onBlur}
                    />
                    <Input
                      hidden={
                        isMobile && reservation_type === ReservationType.EXAM
                      }
                      label={'Fim da agenda'}
                      name={'end_date'}
                      placeholder='Data de fim'
                      type='date'
                      disabled={recurrence === Recurrence.CUSTOM}
                      min={start_date ? start_date : undefined}
                      onFocus={props.focusMobile.onFocusInput}
                      onBlur={props.focusMobile.onBlur}
                    />
                  </HStack>

                  <HStack
                    w={'full'}
                    mt={4}
                    hidden={reservation_type === ReservationType.EXAM}
                  >
                    <Input
                      label={'Horário de início'}
                      name={'start_time'}
                      placeholder='Horario de início da disciplina'
                      type='time'
                      disabled={reservation_type === ReservationType.EXAM}
                      onFocus={props.focusMobile.onFocusInput}
                      onBlur={props.focusMobile.onBlur}
                    />
                    <Input
                      label={'Horário de fim'}
                      name={'end_time'}
                      placeholder='Horário de encerramento da disciplina'
                      type='time'
                      disabled={reservation_type === ReservationType.EXAM}
                      onFocus={props.focusMobile.onFocusInput}
                      onBlur={props.focusMobile.onBlur}
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
                      let newDates: string[] = [];
                      props.dayClick(day);
                      // Remove selected day
                      if (props.selectedDays.includes(day)) {
                        newDates = props.selectedDays
                          .filter((val) => val !== day)
                          .sort(sortDates);
                        setLabelMap((prev) => {
                          const newMap = new Map(prev);
                          newMap.delete(day);
                          return newMap;
                        });
                        setTimeMap((prev) => {
                          const newMap = new Map(prev);
                          newMap.delete(day);
                          return newMap;
                        });
                        // Add selected day
                      } else {
                        newDates = [...props.selectedDays, day].sort(sortDates);
                      }
                      props.setDates(newDates);
                      setValue('start_date', newDates[0]);
                      setValue('end_date', newDates[newDates.length - 1]);
                    }}
                    readOnly={recurrence !== Recurrence.CUSTOM}
                    helpText={recurrence === Recurrence.CUSTOM}
                  />
                </VStack>
              </Flex>

              {reservation_type == ReservationType.EXAM && (
                <Flex direction={'column'}>
                  <Text fontSize={'lg'} fontWeight={'bold'}>
                    Nome e horários das provas:
                  </Text>
                  {errors['labels'] && (
                    <Text textColor={'red.500'} fontSize={'sm'}>
                      {errors['labels'].message as string}
                    </Text>
                  )}
                  {props.selectedDays.length === 0 && (
                    <Text textColor={'red.500'} fontSize={'sm'}>
                      Selecione as datas para adicionar nomes e horários
                    </Text>
                  )}
                  <Flex direction={'column'} gap={'0px'}>
                    {labels && props.selectedDays.length !== labels.length && (
                      <Text textColor={'red.500'} fontSize={'sm'}>
                        Cada data deve ter um nome de prova
                      </Text>
                    )}
                    {times &&
                      (props.selectedDays.length !== times.length ||
                        times.filter((time) => !time[0] || !time[1]).length >
                          0) && (
                        <Text textColor={'red.500'} fontSize={'sm'}>
                          Cada data deve ter um horário de início e fim
                        </Text>
                      )}
                    {formState.errors['times'] && (
                      <Text textColor={'red.500'} fontSize={'sm'}>
                        {formState.errors['times']?.message as string}
                      </Text>
                    )}
                  </Flex>

                  <Flex
                    direction={'column'}
                    gap={'20px'}
                    justifyContent={'flex-start'}
                    justifyItems={'flex-start'}
                    h={'auto'}
                  >
                    {props.selectedDays.map((date, i) => (
                      <Flex
                        key={date}
                        direction={isMobile ? 'column' : 'row'}
                        align={'center'}
                        gap={'10px'}
                        w={'fit-content'}
                      >
                        <Text>{`Data ${moment(date).format('DD/MM/YYYY')}: `}</Text>
                        <ChakraInput
                          placeholder='P1, P2, PSUB, etc'
                          w={'150px'}
                          size={'sm'}
                          value={labelMap.get(date) || ''}
                          maxLength={15}
                          borderRadius={'5px'}
                          onChange={(e) => {
                            if (e.target.value) {
                              const newMap = new Map(labelMap);
                              newMap.set(date, e.target.value.toUpperCase());
                              setLabelMap(newMap);
                            }
                            if (!e.target.value) {
                              const newMap = new Map(labelMap);
                              newMap.delete(date);
                              setLabelMap(newMap);
                            }
                          }}
                          onFocus={(event) =>
                            props.focusMobile.onFocusInput(
                              event,
                              Math.max(100 * i + 250, 400),
                            )
                          }
                          onBlur={props.focusMobile.onBlur}
                        />
                        <Flex
                          direction={isMobile ? 'row' : 'column'}
                          gap={'5px'}
                        >
                          <Text hidden={isMobile}>Das</Text>
                          <ChakraInput
                            type='time'
                            w={'150px'}
                            size={'sm'}
                            value={
                              timeMap.get(date) != undefined
                                ? timeMap.get(date)?.[0]
                                : ''
                            }
                            maxLength={15}
                            borderRadius={'5px'}
                            onChange={(e) => {
                              if (e.target.value) {
                                const newMap = new Map(timeMap);
                                const value = newMap.get(date);
                                newMap.set(
                                  date,
                                  value
                                    ? [e.target.value, value[1]]
                                    : [e.target.value, ''],
                                );
                                setTimeMap(newMap);
                              }
                              if (!e.target.value) {
                                const newMap = new Map(timeMap);
                                const newValue = newMap.get(date);
                                if (newValue && newValue[1] === '')
                                  newMap.delete(date);
                                if (newValue && newValue[1] !== '')
                                  newMap.set(date, ['', newValue[1]]);
                                setTimeMap(newMap);
                              }
                            }}
                            onFocus={(event) =>
                              props.focusMobile.onFocusInput(
                                event,
                                Math.max(100 * i + 250, 400),
                              )
                            }
                            onBlur={props.focusMobile.onBlur}
                          />
                          <Text>Até</Text>
                          <ChakraInput
                            type='time'
                            w={'150px'}
                            size={'sm'}
                            value={
                              timeMap.get(date) != undefined
                                ? timeMap.get(date)?.[1]
                                : ''
                            }
                            maxLength={15}
                            borderRadius={'5px'}
                            onChange={(e) => {
                              if (e.target.value) {
                                const newMap = new Map(timeMap);
                                const value = newMap.get(date);
                                newMap.set(
                                  date,
                                  value
                                    ? [value[0], e.target.value]
                                    : ['', e.target.value],
                                );
                                setTimeMap(newMap);
                              }
                              if (!e.target.value) {
                                const newMap = new Map(timeMap);
                                const newValue = newMap.get(date);
                                if (newValue && newValue[0] === '')
                                  newMap.delete(date);
                                if (newValue && newValue[0] !== '')
                                  newMap.set(date, [newValue[0], '']);
                                setTimeMap(newMap);
                              }
                            }}
                            onFocus={(event) =>
                              props.focusMobile.onFocusInput(
                                event,
                                Math.max(100 * i + 250, 400),
                              )
                            }
                            onBlur={props.focusMobile.onBlur}
                          />
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              )}
            </>
          )}
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ReservationModalSecondStep;
