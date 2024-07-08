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

function ReservationModalSecondStep(props: ReservationModalSecondStepProps) {
  const {
    selectedDays,
    occupiedDays,
    highlightedDays,
    dayClick,
    setHighlightedDays,
    setSelectedDays,
  } = useDateCalendarPicker();
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingResponse>();
  const [isDaily, setIsDayli] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const { clearErrors } = props.form;

  useEffect(() => {
    if (props.occurrences) {
      setHighlightedDays(
        props.occurrences.map((occurrence) => occurrence.date),
      );
    }
  }, [props, setHighlightedDays]);

  return (
    <VStack w={'full'} align={'strech'}>
      <FormProvider {...props.form}>
        <form>
          <Text fontSize={'lg'} fontWeight={'bold'}>
            Local
          </Text>

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
          />
          <HStack mt={4}>
            <Text fontSize={'lg'} fontWeight={'bold'}>
              Horários
            </Text>
            <Spacer />
            <Text
              fontSize={'lg'}
              fontWeight={isSelecting ? 'bold' : 'thin'}
              color={isSelecting ? undefined : 'gray'}
              mr={20}
            >
              Selecione as Datas
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
            {/* <Spacer /> */}
            {/* <HStack mt={4} align={'center'}> */}
            <VStack h={'full'} spacing={0} mt={4}>
              <Spacer />
              {/* <Text  fontWeight={isSelecting ? 'bold' : 'thin'} color={isSelecting ? undefined : 'gray'}>Selecione as Datas</Text> */}
              <DateCalendarPicker
                selectedDays={selectedDays}
                highlightedDays={highlightedDays}
                occupiedDays={occupiedDays}
                dayClick={dayClick}
                readOnly={!isSelecting}
              />
            </VStack>
            {/* <Spacer /> */}
            {/* <VStack>
                <Text>Test 2</Text>
                <DateCalendarPicker
                  selectedDays={selectedDays}
                  highlightedDays={highlightedDays}
                  occupiedDays={occupiedDays}
                  dayClick={dayClick}
                  readOnly={true}
                />
              </VStack> */}
            {/* </HStack> */}
          </HStack>
        </form>
      </FormProvider>
    </VStack>
  );
}

export default ReservationModalSecondStep;
