import {
  Alert,
  AlertIcon,
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';

import { HolidayForm, HolidayModalProps } from './holiday.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultValues, schema } from './holiday.modal.form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Select } from 'components/common';
import {
  CreateHoliday,
  UpdateHoliday,
} from 'models/http/requests/holiday.request.models';
import { useEffect, useState } from 'react';
import { HolidayUnfetchResponse } from 'models/http/responses/holiday.response.models';
import {
  DateCalendar,
  DayCalendarSkeleton,
  PickersDay,
  PickersDayProps,
} from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';
import { sortDates } from 'utils/holidays/holidays.sorter';
import { Badge } from '@mui/material';
import useHolidays from 'hooks/useHolidays';

function ServerDay(
  props: PickersDayProps<Moment> & {
    highlightedDays?: [number, number][];
    ocuppedDays?: [number, number][];
  },
) {
  const {
    highlightedDays = [],
    ocuppedDays = [],
    day,
    outsideCurrentMonth,
    ...other
  } = props;

  const isSelected = !!highlightedDays.find(
    (val) => val[0] === props.day.date() && val[1] === props.day.month(),
  );
  const isOcupped = !!ocuppedDays.find(
    (val) => val[0] === props.day.date() && val[1] === props.day.month(),
  );

  return (
    <Badge
      key={props.day.toString()}
      overlap='circular'
      badgeContent={isSelected ? '✔️' : undefined}
    >
      <PickersDay
        {...other}
        disabled={isOcupped}
        disableHighlightToday={true}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

function HolidayModal(props: HolidayModalProps) {
  const [isMultipleHolidays, setIsMultipleHolidays] = useState(false);
  const [dates, setDates] = useState<string[]>([]);
  const [highlightedDays, setHighlightedDays] = useState<[number, number][]>(
    [],
  );
  const [ocuppedDays, setOcuppedDays] = useState<[number, number][]>([]);

  const form = useForm<HolidayForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, reset, getValues, clearErrors } = form;
  const { createHoliday, createManyHolidays, updateHoliday } = useHolidays();

  async function handleCreateSubmit() {
    if (isMultipleHolidays) {
      const values = getValues();
      createManyHolidays({ category_id: values.category_id, dates: dates });
    } else {
      const isValid = await trigger();
      if (!isValid) return;

      const values = getValues();
      createHoliday(values as CreateHoliday);
    }
    props.refetch();
    handleCloseModal();
  }

  function formatUpdateData(data: HolidayForm): UpdateHoliday {
    const formated_data: UpdateHoliday = {
      category_id: props.category ? props.category.id : 0,
      date: data.date,
    };
    return formated_data;
  }

  async function handleUpdateSubmit() {
    const isValid = await trigger();
    if (!isValid) return;

    const values = getValues();
    if (!props.selectedHoliday) return;
    updateHoliday(props.selectedHoliday.id, formatUpdateData(values));
    props.refetch();
    handleCloseModal();
  }

  function handleCloseModal() {
    reset(defaultValues);
    setIsMultipleHolidays(false);
    setHighlightedDays([]);
    setOcuppedDays([]);
    clearErrors();
    props.onClose();
  }

  function formatSelectedHoliday(data: HolidayUnfetchResponse): HolidayForm {
    const formated: HolidayForm = {
      category_id: data.category_id,
      date: data.date.substring(0, 10),
    };
    return formated;
  }

  function fetchOcuppedDays(data: HolidayUnfetchResponse[]) {
    const newOcuppedDays: [number, number][] = [];
    data.forEach((val) => {
      const date = moment(val.date);
      newOcuppedDays.push([date.date(), date.month()]);
    });
    setOcuppedDays(newOcuppedDays);
  }

  useEffect(() => {
    if (props.category) {
      reset({ category_id: props.category.id, date: '' });
      fetchOcuppedDays(props.category.holidays);
    }
    if (props.selectedHoliday) {
      reset(formatSelectedHoliday(props.selectedHoliday));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, props]);

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={handleCloseModal}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.isUpdate ? 'Atualizar feriado' : 'Cadastrar feriado'}
        </ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <form>
            <ModalBody maxH={'2xl'} overflowY={'auto'}>
              <VStack spacing={4} alignItems={'flex-start'}>
                <Select
                  disabled={true}
                  label={'Categoria do feriado'}
                  name={'category_id'}
                  placeholder={'Selecione uma opção'}
                  value={props.category ? props.category.id : undefined}
                  options={props.categories.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                />
                <Input
                  disabled={isMultipleHolidays}
                  label={'Data'}
                  name={'date'}
                  placeholder={'Selecione uma data'}
                  type={'date'}
                  hidden={isMultipleHolidays}
                />
                <Checkbox
                  hidden={props.isUpdate}
                  onChange={(event) => {
                    setIsMultipleHolidays(event.target.checked);
                  }}
                >
                  Cadastrar vários dias
                </Checkbox>
                {isMultipleHolidays ? (
                  <>
                    <Text as='b' fontSize='lg'>
                      Selecione as datas:
                    </Text>
                    <DateCalendar
                      renderLoading={() => <DayCalendarSkeleton />}
                      showDaysOutsideCurrentMonth
                      slots={{
                        day: ServerDay,
                      }}
                      slotProps={{
                        day: {
                          highlightedDays,
                          ocuppedDays,
                        } as any,
                      }}
                      onChange={(newValue: Moment) => {
                        const newDates = [...dates];
                        const newHighlightedDays = [...highlightedDays];
                        const date = moment(newValue).format(
                          'YYYY-MM-DDTHH:mm:ss',
                        );
                        const index = newDates.findIndex(
                          (value) => value === date,
                        );
                        if (index >= 0) {
                          newDates.splice(index, 1);
                          const highlightIndex = newHighlightedDays.findIndex(
                            (val) =>
                              val[0] === newValue.date() &&
                              val[1] === newValue.month(),
                          );
                          newHighlightedDays.splice(highlightIndex, 1);
                        } else {
                          newDates.push(date);
                          newHighlightedDays.push([
                            newValue.date(),
                            newValue.month(),
                          ]);
                        }
                        setHighlightedDays(newHighlightedDays);
                        setDates(newDates.sort(sortDates));
                      }}
                    />
                    <Text fontSize={'sm'}>
                      Clique para adicionar, clique novamente para remover
                    </Text>
                    <Text fontSize={'sm'}>
                      As datas em cinza já estão cadastradas
                    </Text>

                    {dates.length === 0 ? (
                      <Alert status='error' fontSize='sm' mb={4}>
                        <AlertIcon />
                        Nenhuma data adicionada
                      </Alert>
                    ) : undefined}
                  </>
                ) : undefined}
              </VStack>
            </ModalBody>
          </form>
        </FormProvider>
        <ModalFooter>
          <Button
            disabled={isMultipleHolidays && dates.length === 0}
            onClick={props.isUpdate ? handleUpdateSubmit : handleCreateSubmit}
            mr={4}
          >
            {props.isUpdate ? 'Atualizar' : 'Cadastrar'}
          </Button>
          <Button colorScheme='blue' mr={3} onClick={handleCloseModal}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default HolidayModal;
