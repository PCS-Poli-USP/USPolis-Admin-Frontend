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
  ModalProps,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultValues, schema } from './form';
import { Input, Select } from 'components/common';

export type CreateForm = {
  building: string | null;
  category: string;
  classroom: string | null;
  description: string;
  end_datetime?: string;
  external_link: string;
  location: string;
  start_datetime?: string;
  start_timestamp?: string;
  end_timestamp?: string;
  title: string;
};

interface CreateEventModalProps extends ModalProps {}

function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const form = useForm<CreateForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit } = form;

  const handleCreateSubmit = handleSubmit((values) => {
    console.log(values);
  });

  return (
    <Modal onClose={onClose} isOpen={isOpen} closeOnOverlayClick={false} size='lg' isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cadastro de evento</ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <form onSubmit={handleCreateSubmit}>
            <ModalBody>
              <VStack gap={1}>
                <Input label='Título' name='title' />
                <Input label='Localização' name='location' />
                <Select
                  label='Categoria'
                  name='category'
                  options={[
                    { label: 'Categoria 1', value: '1' },
                    { label: 'Categoria 2', value: '2' },
                  ]}
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <HStack gap={1}>
                <Button onClick={onClose} variant='outline'>
                  Fechar
                </Button>
                <Button onClick={onClose}>Confirmar</Button>
              </HStack>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}

export default CreateEventModal;
