import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import {
  ClassroomForm,
  ClassroomModalProps,
} from './classroom.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultValues, schema } from './classroom.modal.form';
import { yupResolver } from '@hookform//resolvers/yup';
import { Input, Select } from '../../../components/common';
import { NumberInput } from '../../../components/common/form/NumberInput';
import { CheckBox } from '../../../components/common/form/CheckBox';
import useClassrooms from '../../../hooks/useClassrooms';

export default function ClassroomModal(props: ClassroomModalProps) {
  const form = useForm<ClassroomForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, reset, getValues, clearErrors } = form;
  const { createClassroom, updateClassroom } = useClassrooms();

  useEffect(() => {
    if (props.selectedClassroom) {
      reset({ ...props.selectedClassroom });
    }
  }, [props, reset]);

  async function handleSaveClick() {
    const isValid = await trigger();
    if (!isValid) return;
    const values = getValues();

    if (props.isUpdate && props.selectedClassroom) {
      await updateClassroom(props.selectedClassroom.id, values);
    } else {
      await createClassroom(values);
    }
    props.refetch();
    handleCloseModal();
  }

  function handleCloseModal() {
    reset(defaultValues);
    clearErrors();
    props.onClose();
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={handleCloseModal}
      size={'lg'}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.isUpdate ? 'Editar Sala' : 'Cadastrar Sala'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormProvider {...form}>
            <form>
              <Input label={'Nome'} name={'name'} placeholder='Nome da sala' />

              <Select
                mt={4}
                label={'Prédio'}
                name={'building_id'}
                placeholder={'Escolha um prédio'}
                options={props.buildings.map((building) => ({
                  value: building.id,
                  label: building.name,
                }))}
              />

              <NumberInput
                mt={4}
                min={0}
                label={'Andar'}
                name={'floor'}
                placeholder={'Andar da sala'}
              />

              <NumberInput
                min={0}
                mt={4}
                label={'Capacidade'}
                name={'capacity'}
                placeholder={'Capacidade da sala'}
              />

              <Text fontWeight={'bold'} mt={4}>
                Recursos
              </Text>

              <HStack>
                <CheckBox text={'Ar condicionado'} name={'air_conditioning'} />
                <CheckBox text={'Projetor'} name={'projector'} />
                <CheckBox text={'Acessibilidade'} name={'accessibility'} />
              </HStack>

              <Text fontWeight={'bold'} mt={4}>
                Alocação
              </Text>
              <CheckBox
                text={'Ignorar para alocação automática'}
                name={'ignore_to_allocate'}
              />
            </form>
          </FormProvider>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
            Cadastrar
          </Button>
          <Button onClick={() => handleCloseModal()}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
