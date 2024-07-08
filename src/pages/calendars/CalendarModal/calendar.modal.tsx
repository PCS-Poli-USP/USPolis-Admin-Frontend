import {
  Alert,
  AlertIcon,
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
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from 'components/common';
import { useEffect, useState } from 'react';
import { CalendarForm, CalendarModalProps } from './calendar.modal.interface';
import { defaultValues, schema } from './calendar.modal.form';
import {
  CreateCalendar,
  UpdateCalendar,
} from 'models/http/requests/calendar.request.models';
import { MultiSelect, Option } from 'components/common/form/MultiSelect';

function CalendarModal(props: CalendarModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<Option[] | undefined>(
    undefined,
  );
  const form = useForm<CalendarForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, getValues, reset, clearErrors } = form;

  async function handleCreateSubmit() {
    const isValid = await trigger();
    if (!isValid) return;

    const values = getValues();
    props.onCreate(values as CreateCalendar);
    handleCloseModal();
  }

  function formatUpdateData(data: CalendarForm): UpdateCalendar {
    const formated_data: UpdateCalendar = {
      name: data.name,
      categories_ids: data.categories_ids,
    };
    return formated_data;
  }

  async function handleUpdateSubmit() {
    const isValid = await trigger();
    if (!isValid) return;

    const values = getValues();
    if (!props.selectedCalendar) return;
    props.onUpdate(props.selectedCalendar.id, formatUpdateData(values));
    handleCloseModal();
  }

  function handleCloseModal() {
    reset(defaultValues);
    clearErrors();
    setSelectedOptions(undefined);
    props.onClose();
  }

  useEffect(() => {
    if (props.selectedCalendar) {
      const selected: Option[] = props.selectedCalendar.categories.map(
        (category) => ({ label: category.name, value: category.id }),
      );
      setSelectedOptions(selected);
      reset({ name: props.selectedCalendar.name });
    }
  }, [reset, props]);

  return (
    <Modal
      isOpen={props.isOpen}
      closeOnOverlayClick={false}
      onClose={handleCloseModal}
    >
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
                <Alert status={'error'} hidden={props.categories.length !== 0}>
                  <AlertIcon />
                  Nenhuma Categoria de Feriado disponível, crie alguma.
                </Alert>
                <Input
                  label={'Nome'}
                  name={'name'}
                  type={'text'}
                  placeholder={'Nome do calendário'}
                />
                <MultiSelect
                  label={'Categorias de Feriados'}
                  name={'categories_ids'}
                  values={selectedOptions}
                  options={props.categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
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
