import {
  Box,
  Button,
  Flex,
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
  Text,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultValues, schema } from './form';
import { Input, Select, Textarea } from 'components/common';
import { Buildings } from 'models/enums/buildings.enum';
import { useEffect, useState } from 'react';
import InstutionalEventsService from 'services/institutional-events.service';
import { InstitutionalEvent } from 'models/institutionalEvent.model';

export type EventForm = {
  building?: string | null;
  category: string;
  classroom?: string | null;
  description: string;
  end_datetime: string;
  start_datetime: string;
  external_link: string;
  location?: string | null;
  title: string;
};

interface EventFormModalProps extends ModalProps {
  selectedEvent: InstitutionalEvent | null;
  refetch: () => Promise<void>;
}

const service = new InstutionalEventsService();

function EventFormModal({ isOpen, onClose, refetch, selectedEvent }: EventFormModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<EventForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, getValues, reset, clearErrors } = form;
  const toast = useToast();

  const handleCreateSubmit = async () => {
    try {
      const isValid = await trigger();

      if (!isValid) return;

      setLoading(true);

      const values = getValues();

      await service.create(values);

      toast({
        description: 'Evento cadastrado com sucesso!',
        status: 'success',
        isClosable: true,
        position: 'top-right',
      });

      onClose();
      refetch();
    } catch {
      toast({
        description: 'Houve um erro ao criar o evento',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const isValid = await trigger();

      if (!isValid || !selectedEvent) return;

      setLoading(true);

      const values = getValues();

      await service.update(selectedEvent._id, values);

      toast({
        description: 'Evento atualizado com sucesso!',
        status: 'success',
        isClosable: true,
        position: 'top-right',
      });

      onClose();
      refetch();
    } catch {
      toast({
        description: 'Houve um erro ao atualizar o evento',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !selectedEvent) {
      reset(defaultValues);
      clearErrors();
    }
  }, [clearErrors, isOpen, reset, selectedEvent]);

  console.log(selectedEvent);

  useEffect(() => {
    if (!!selectedEvent) {
      reset({ ...selectedEvent });
    }
  }, [reset, selectedEvent]);

  return (
    <Modal onClose={onClose} isOpen={isOpen} closeOnOverlayClick={false} size='3xl' isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{!!selectedEvent ? 'Atualizar evento' : 'Cadastrar de evento'}</ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <form>
            <ModalBody>
              <VStack gap={4}>
                <Box w='50%' alignSelf='start'>
                  <Input label='Título' name='title' />
                </Box>
                <Textarea label='Descrição' name='description' />
                <Flex w='100%' gap={3}>
                  <Input label='Início' name='start_datetime' type='datetime-local' />
                  <Input label='Fim' name='end_datetime' type='datetime-local' />
                </Flex>
                <Input label='Localização' name='location' />
                <Text color='gray.500'>ou</Text>
                <Flex w='100%' gap={3}>
                  <Select
                    label='Prédio'
                    name='building'
                    options={Object.values(Buildings).map((b) => ({ label: b, value: b }))}
                  />
                  <Input label='Sala' name='classroom' />
                </Flex>
                <Flex w='100%' gap={3}>
                  <Select
                    label='Categoria'
                    name='category'
                    options={[{ label: 'Processo Seletivo de Entidade', value: 'Processo Seletivo de Entidade' }]}
                  />
                  <Input label='Link externo' name='external_link' type='url' />
                </Flex>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <HStack gap={1}>
                <Button onClick={onClose} variant='outline'>
                  Fechar
                </Button>
                <Button onClick={!!selectedEvent ? handleUpdateSubmit : handleCreateSubmit} isLoading={loading}>
                  Confirmar
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}

export default EventFormModal;
