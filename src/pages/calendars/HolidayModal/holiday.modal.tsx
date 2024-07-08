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
import moment from 'moment';
import useHolidays from 'hooks/useHolidays';
import DateCalendarPicker, {
  useDateCalendarPicker,
} from 'components/common/DateCalendarPicker';

function HolidayModal(props: HolidayModalProps) {
  const [isMultipleHolidays, setIsMultipleHolidays] = useState(false);
  const {
    selectedDays,
    occupiedDays,
    highlightedDays,
    dayClick,
    setOccupiedDays,
    setSelectedDays,
    setHighlightedDays,
  } = useDateCalendarPicker();

  const form = useForm<HolidayForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, reset, getValues, clearErrors } = form;
  const { createHoliday, createManyHolidays, updateHoliday } = useHolidays();

  async function handleCreateSubmit() {
    if (isMultipleHolidays) {
      const values = getValues();
      await createManyHolidays({
        category_id: values.category_id,
        dates: selectedDays,
      });
    } else {
      const isValid = await trigger();
      if (!isValid) return;

      const values = getValues();
      await createHoliday(values as CreateHoliday);
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
    await updateHoliday(props.selectedHoliday.id, formatUpdateData(values));
    props.refetch();
    handleCloseModal();
  }

  function handleCloseModal() {
    reset(defaultValues);
    setIsMultipleHolidays(false);
    setSelectedDays([]);
    setOccupiedDays([]);
    clearErrors();
    props.onClose();
  }

  function formatSelectedHoliday(data: HolidayUnfetchResponse): HolidayForm {
    const formated: HolidayForm = {
      category_id: data.category_id,
      date: data.date,
    };
    return formated;
  }

  function fetchOccupiedDays(data: HolidayUnfetchResponse[]) {
    const newOcuppedDays: string[] = [];
    data.forEach((val) => {
      const date = moment(val.date).format('YYYY-MM-DD');
      newOcuppedDays.push(date);
    });
    setOccupiedDays(newOcuppedDays);
    setHighlightedDays(newOcuppedDays);
  }

  useEffect(() => {
    if (props.category) {
      reset({ category_id: props.category.id, date: '' });
      fetchOccupiedDays(props.category.holidays);
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
                    <DateCalendarPicker
                      selectedDays={selectedDays}
                      highlightedDays={highlightedDays}
                      occupiedDays={occupiedDays}
                      dayClick={dayClick}
                    />
                    <Text fontSize={'sm'}>
                      Clique para adicionar, clique novamente para remover
                    </Text>
                    <Text fontSize={'sm'}>
                      As datas em cinza já estão cadastradas
                    </Text>

                    {selectedDays.length === 0 ? (
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
            disabled={isMultipleHolidays && selectedDays.length === 0}
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
