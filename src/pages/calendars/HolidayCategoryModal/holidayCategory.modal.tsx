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
import {
  HolidayCategoryForm,
  HolidayCategoryModalProps,
} from './holidayCategory.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultValues, schema } from './holidayCategory.modal.form';
import { yupResolver } from '@hookform//resolvers/yup';
import { Input } from '../../../components/common';
import {
  CreateHolidayCategory,
  UpdateHolidayCategory,
} from '../../../models/http/requests/holidayCategory.request.models';
import { useEffect } from 'react';
import useHolidaysCategories from '../../../hooks/useHolidaysCategories';
import { NumberInput } from '../../../components/common/form/NumberInput';

function HolidayCategoryModal(props: HolidayCategoryModalProps) {
  const form = useForm<HolidayCategoryForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, getValues, reset, clearErrors } = form;
  const { createHolidayCategory, updateHolidayCategory } =
    useHolidaysCategories(false);

  async function handleCreateSubmit() {
    const isValid = await trigger();
    if (!isValid) return;

    const values = getValues();
    await createHolidayCategory(values as CreateHolidayCategory);
    form.reset(defaultValues);
    props.refetch();
    handleCloseModal();
  }

  function formatUpdateData(data: HolidayCategoryForm): UpdateHolidayCategory {
    const formated_data: UpdateHolidayCategory = {
      name: data.name,
      year: data.year,
    };
    return formated_data;
  }

  async function handleUpdateSubmit() {
    const isValid = await trigger();
    if (!isValid) return;

    const values = getValues();
    if (!props.selectedHolidayCategory) return;
    await updateHolidayCategory(
      props.selectedHolidayCategory.id,
      formatUpdateData(values),
    );
    form.reset(defaultValues);
    props.refetch();
    handleCloseModal();
  }

  function handleCloseModal() {
    reset(defaultValues);
    clearErrors();
    props.onClose();
  }

  useEffect(() => {
    if (props.selectedHolidayCategory) {
      reset(props.selectedHolidayCategory);
    }
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
          {props.isUpdate ? 'Atualizar categoria' : 'Cadastrar categoria'}
        </ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <form>
            <ModalBody>
              <VStack spacing={4}>
                <Input
                  label={'Categoria'}
                  name={'name'}
                  type={'text'}
                  placeholder={'Nome da categoria'}
                />
                <NumberInput
                  name='year'
                  label='Ano'
                  placeholder='Ano do calendário'
                  min={2025}
                  max={2100}
                />
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={
                  props.isUpdate ? handleUpdateSubmit : handleCreateSubmit
                }
                mr={4}
                colorScheme='blue'
              >
                {props.isUpdate ? 'Atualizar' : 'Cadastrar'}
              </Button>
              <Button onClick={handleCloseModal}>Fechar</Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}

export default HolidayCategoryModal;
