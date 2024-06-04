import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from 'components/common';
import { useEffect, useState } from 'react';
import { CalendarForm, CalendarModalProps } from './calendar.modal.interface';
import { defaultValues, schema } from './calendar.modal.form';
import {
  CreateCalendar,
  UpdateCalendar,
} from 'models/http/requests/calendar.request.models';
import Select from 'react-select';

type OptionType = {
  value: number;
  label: string;
};

function CalendarModal(props: CalendarModalProps) {
  const form = useForm<CalendarForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    trigger,
    getValues,
    reset,
    clearErrors,
    formState: { errors },
  } = form;

  async function handleCreateSubmit() {
    console.log('Criando');
    const isValid = await trigger();
    if (!isValid) return;

    // const values = getValues();
    // props.onCreate(values as CreateCalendar);
    // handleCloseModal();
  }

  function formatUpdateData(data: CalendarForm): UpdateCalendar {
    const formated_data: UpdateCalendar = {
      name: data.name,
      categories_ids: data.categories_ids,
    };
    return formated_data;
  }

  async function handleUpdateSubmit() {
    console.log('Enviando');
    // const isValid = await trigger();
    // if (!isValid) return;

    // const values = getValues();
    // if (!props.selectedCalendar) return;
    // props.onUpdate(props.selectedCalendar.id, formatUpdateData(values));
    // handleCloseModal();
  }

  function handleCloseModal() {
    reset(defaultValues);
    clearErrors();
    props.onClose();
  }

  useEffect(() => {
    if (props.selectedCalendar) {
      reset(props.selectedCalendar);
    }
  }, [reset, props]);

  const categoriesOptions = props.categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const [selectedOption, setSelectedOption] = useState<OptionType>(
    categoriesOptions[0],
  );

  const handleChange = (option: OptionType) => {
    setSelectedOption(option);
  };

  return (
    <Modal isOpen={props.isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.isUpdate ? 'Atualizar calendário' : 'Cadastrar calendário'}
        </ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <form>
            <ModalBody>
              <VStack spacing={4}>
                <Input
                  label={'Nome'}
                  name={'name'}
                  type={'text'}
                  placeholder={'Nome do calendário'}
                />
                <Controller
                  control={control}
                  name={'categories_ids'}
                  render={({ field }) => (
                    <FormControl isInvalid={!!errors.categories_ids}>
                      <FormLabel>Categorias</FormLabel>
                      <Select
                        isMulti={true}
                        onChange={(selectedOption) => {
                          const values = selectedOption.map(
                            (option: OptionType) => option.value,
                          );
                          field.onChange(values);
                          console.log(selectedOption);
                          return;
                        }}
                        options={props.categories.map((category) => ({
                          value: category.id,
                          label: category.name,
                        }))}
                      />
                      <FormErrorMessage>
                        {errors.categories_ids?.message?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={
                  props.isUpdate ? handleUpdateSubmit : handleCreateSubmit
                }
                mr={4}
              >
                {props.isUpdate ? 'Atualizar' : 'Cadastrar'}
              </Button>
              <Button colorScheme='blue' onClick={handleCloseModal}>
                Fechar
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}

export default CalendarModal;
