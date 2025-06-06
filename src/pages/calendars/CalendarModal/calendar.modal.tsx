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
import { Input } from '../../../components/common';
import { useEffect } from 'react';
import { CalendarForm, CalendarModalProps } from './calendar.modal.interface';
import { defaultValues, schema } from './calendar.modal.form';
import {
  CreateCalendar,
  UpdateCalendar,
} from '../../../models/http/requests/calendar.request.models';
import { MultiSelect } from '../../../components/common/form/MultiSelect';
import { NumberInput } from '../../../components/common/form/NumberInput';

function CalendarModal(props: CalendarModalProps) {
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
      year: data.year,
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
    props.onClose();
  }

  useEffect(() => {
    if (props.selectedCalendar) {
      const selected = props.selectedCalendar.categories
        ? props.selectedCalendar.categories.map((category) => category.id)
        : undefined;
      reset({
        name: props.selectedCalendar.name,
        year: props.selectedCalendar.year,
        categories_ids: selected,
      });
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
                <Alert
                  status={'warning'}
                  hidden={props.categories.length !== 0}
                >
                  <AlertIcon />
                  Nenhuma categoria de feriado disponível, crie alguma.
                </Alert>
                <Input
                  label={'Nome'}
                  name={'name'}
                  type={'text'}
                  placeholder={'Nome do calendário'}
                />
                <NumberInput
                  name='year'
                  label='Ano'
                  placeholder='Ano do calendário'
                  min={2025}
                  max={2100}
                />
                <MultiSelect
                  label={'Categorias de Feriados (Opcional)'}
                  name={'categories_ids'}
                  options={props.categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                />
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button onClick={handleCloseModal} mr={'10px'} colorScheme='red'>
                Cancelar
              </Button>
              <Button
                onClick={
                  props.isUpdate ? handleUpdateSubmit : handleCreateSubmit
                }
                colorScheme='blue'
              >
                {props.isUpdate ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}

export default CalendarModal;
