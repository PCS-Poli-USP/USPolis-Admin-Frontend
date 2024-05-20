import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';

import { HolidayForm, HolidayModalProps } from './holiday.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultValues, schema } from './holiday.modal.form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Select } from 'components/common';
import { HolidaysTypes } from 'utils/enums/holidays.enums';
import {
  CreateHoliday,
  UpdateHoliday,
} from 'models/http/requests/holiday.request.models';
import { useEffect } from 'react';
import { HolidayResponse } from 'models/http/responses/holiday.response.models';
import { holidaysTypeFormatter } from 'utils/holidays/holidays.formatter';

function HolidayModal(props: HolidayModalProps) {
  const form = useForm<HolidayForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, reset, getValues, clearErrors } = form;
  async function handleCreateSubmit() {
    const isValid = await trigger();
    if (!isValid) return;

    const values = getValues();
    props.onCreate(values as CreateHoliday);
    handleCloseModal();
  }

  function formatUpdateData(data: HolidayForm): UpdateHoliday {
    const formated_data: UpdateHoliday = {
      category_id: data.category_id,
      date: data.date,
      type: data.type,
    };
    return formated_data;
  }

  async function handleUpdateSubmit() {
    const isValid = await trigger();
    if (!isValid) return;

    const values = getValues();
    if (!props.selectedHoliday) return;
    props.onUpdate(props.selectedHoliday.id, formatUpdateData(values));
    handleCloseModal();
  }

  function handleCloseModal() {
    reset(defaultValues);
    clearErrors();
    props.onClose();
  }

  function formatSelectedHoliday(data: HolidayResponse): HolidayForm {
    const category_id = props.categories.find(
      (value) => value.name === data.category,
    )?.id;
    const formated: HolidayForm = {
      category_id: category_id ? category_id : '',
      date: data.date.substring(0, 10),
      type: data.type,
    };
    return formated;
  }

  useEffect(() => {
    if (props.selectedHoliday) {
      reset(formatSelectedHoliday(props.selectedHoliday));
    }
  }, [reset, props]);

  return (
    <Modal isOpen={props.isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.isUpdate ? 'Atualizar feriado' : 'Cadastrar feriado'}
        </ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <form>
            <ModalBody>
              <VStack spacing={4} alignItems={'flex-start'}>
                <Select
                  label={'Categoria de feriado'}
                  name={'category_id'}
                  options={props.categories.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                />
                <Input
                  label={'Data'}
                  name={'date'}
                  placeholder={'Selecione uma data'}
                  type={'date'}
                />
                <Select
                  label={'Tipo de feriado'}
                  name={'type'}
                  options={Object.keys(HolidaysTypes).map((opt) => ({
                    label: holidaysTypeFormatter(opt.toLowerCase()),
                    value: HolidaysTypes[opt as keyof typeof HolidaysTypes],
                  }))}
                />
              </VStack>
            </ModalBody>
          </form>
        </FormProvider>
        <ModalFooter>
          <Button
            onClick={props.isUpdate ? handleUpdateSubmit : handleCreateSubmit}
            mr={4}
          >
            {props.isUpdate ? 'Atualizar' : 'Cadastrar'}
          </Button>
          <Button colorScheme='blue' mr={3} onClick={handleCloseModal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default HolidayModal;
