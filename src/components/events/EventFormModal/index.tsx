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
  Checkbox,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultValues, schema } from './form';
import { Input, Select, Textarea } from 'components/common';
import { useEffect, useState } from 'react';
import InstutionalEventsService from 'services/api/institutional-events.service';
import { InstitutionalEvent } from 'models/common/institutionalEvent.model';
import { EventTypes } from 'utils/enums/eventTypes.enum';
import { Building } from 'models/common/building.model';

export type EventForm = {
  building?: string | null;
  category: string;
  classroom?: string | null;
  description: string;
  end_datetime: string;
  start_datetime: string;
  external_link?: string;
  location?: string | null;
  title: string;
};

interface EventFormModalProps extends ModalProps {
  selectedEvent: InstitutionalEvent | null;
  refetch: () => Promise<void>;
  buildings: Building[];
}

const service = new InstutionalEventsService();

function EventFormModal({
  isOpen,
  onClose,
  refetch,
  selectedEvent,
  buildings,
}: EventFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [fullDayEvent, setFullDayEvent] = useState(false);

  useEffect(() => {
    if (
      selectedEvent &&
      selectedEvent.end_datetime === selectedEvent.start_datetime
    ) {
      setFullDayEvent(true);
    } else {
      setFullDayEvent(false);
    }
  }, [selectedEvent]);

  const form = useForm<EventForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, getValues, reset, clearErrors, watch } = form;

  const toast = useToast();
  const buildingWatcher = watch('building');
  const locationWatcher = watch('location');

  const handleCreateSubmit = async () => {
    try {
      const isValid = await trigger();

      if (!isValid) return;

      setLoading(true);

      const values = getValues();

      if (fullDayEvent) {
        values['end_datetime'] = values['start_datetime'];
      }

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

      if (fullDayEvent) {
        values['end_datetime'] = values['start_datetime'];
      }

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

  useEffect(() => {
    if (!!selectedEvent) {
      reset({ ...selectedEvent });
    }
  }, [reset, selectedEvent]);

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      closeOnOverlayClick={false}
      size='3xl'
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {!!selectedEvent ? 'Atualizar evento' : 'Cadastrar de evento'}
        </ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <form>
            <ModalBody>
              <VStack gap={4}>
                <Box w='50%' alignSelf='start'>
                  <Input label='Título' name='title' />
                </Box>
                <Textarea label='Descrição' name='description' />
                <Box alignSelf='flex-start'>
                  <Checkbox
                    isChecked={fullDayEvent}
                    onChange={(e) => {
                      setFullDayEvent(e.target.checked);
                      form.setValue('end_datetime', '');
                      form.setValue('start_datetime', '');
                    }}
                  >
                    Evento de dia inteiro
                  </Checkbox>
                </Box>
                {fullDayEvent ? (
                  <Input label='Data' name='start_datetime' type='date' />
                ) : (
                  <Flex w='100%' gap={3}>
                    <Input
                      label='Início'
                      name='start_datetime'
                      type='datetime-local'
                    />
                    <Input
                      label='Fim'
                      name='end_datetime'
                      type='datetime-local'
                    />
                  </Flex>
                )}
                <Input
                  label='Localização'
                  name='location'
                  disabled={!!buildingWatcher}
                />
                <Text color='gray.500'>ou</Text>
                <Flex w='100%' gap={3}>
                  <Select
                    label='Prédio'
                    name='building'
                    disabled={!!locationWatcher}
                    options={buildings.map((b) => ({
                      label: b.name,
                      value: b.name,
                    }))}
                  />
                  <Input
                    label='Sala'
                    name='classroom'
                    disabled={!!locationWatcher}
                  />
                </Flex>
                <Flex w='100%' gap={3}>
                  <Select
                    label='Categoria'
                    name='category'
                    options={Object.keys(EventTypes).map((opt) => ({
                      label: opt,
                      value: opt,
                    }))}
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
                <Button
                  onClick={
                    !!selectedEvent ? handleUpdateSubmit : handleCreateSubmit
                  }
                  isLoading={loading}
                >
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
