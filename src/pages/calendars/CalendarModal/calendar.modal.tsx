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
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from 'components/common';
import { useEffect } from 'react';
import { CalendarForm, CalendarModalProps } from './calendar.modal.interface';
import { defaultValues, schema } from './calendar.modal.form';
import {
  CreateCalendar,
  UpdateCalendar,
} from 'models/http/requests/calendar.request.models';
import { MultiSelect } from 'components/common/form/MultiSelect';

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
      reset(props.selectedCalendar);
    }
  }, [reset, props]);

  return (
    <Modal isOpen={props.isOpen} closeOnOverlayClick={false} onClose={handleCloseModal}>
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
                <MultiSelect
                  label={'Categorias'}
                  name={'categories_ids'}
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
