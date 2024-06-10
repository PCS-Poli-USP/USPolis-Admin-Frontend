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
  VStack,
  Text,
  useToast,
  Checkbox,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultValues, schema } from './institutionalEvent.modal.form';
import { Input, Select, Textarea } from 'components/common';
import { useEffect, useState } from 'react';
import { EventTypes } from 'utils/enums/eventTypes.enum';
import InstutionalEventsService from 'services/api/institutionalEvents.service';
import { CreateInstitutionalEvent } from 'models/http/requests/institutionalEvent.request.models';
import { InstitutionalEventForm, InstitutionalEventModalProps } from './institutionalEvent.modal.interface';



const service = new InstutionalEventsService();

function InstitutionalEventModal({
  isOpen,
  onClose,
  refetch,
  selectedEvent,
  buildings,
}: InstitutionalEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [fullDayEvent, setFullDayEvent] = useState(false);

  useEffect(() => {
    if (selectedEvent && selectedEvent.end === selectedEvent.start) {
      setFullDayEvent(true);
    } else {
      setFullDayEvent(false);
    }
  }, [selectedEvent]);

  const form = useForm<InstitutionalEventForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, getValues, reset, clearErrors, watch } = form;

  const toast = useToast();
  const buildingWatcher: string | undefined = watch('building');
  const locationWatcher = watch('location');

  function formatCreateData(data: InstitutionalEventForm): CreateInstitutionalEvent {
    const formated_data: CreateInstitutionalEvent = {
      title: data.title,
      description: data.description,
      category: data.category,
      start: data.start,
      end: data.end,
      location: data.location ? data.location : undefined,
      building: data.building ? data.building : undefined,
      classroom: data.classroom ? data.classroom : undefined,
      external_link: data.external_link ? data.external_link : undefined,
    };
    return formated_data;
  }

  const handleCreateSubmit = async () => {
    try {
      const isValid = await trigger();

      if (!isValid) return;

      setLoading(true);

      const values = getValues();

      if (fullDayEvent) {
        values['end'] = values['start'];
      }
      console.log('Dados: ', formatCreateData(values));
      await service.create(formatCreateData(values));

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
        values['end'] = values['start'];
      }

      await service.update(selectedEvent.id, values);

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
                      form.setValue('end', '');
                      form.setValue('start', '');
                    }}
                  >
                    Evento de dia inteiro
                  </Checkbox>
                </Box>
                {fullDayEvent ? (
                  <Input label='Data' name='start' type='date' />
                ) : (
                  <Flex w='100%' gap={3}>
                    <Input label='Início' name='start' type='datetime-local' />
                    <Input label='Fim' name='end' type='datetime-local' />
                  </Flex>
                )}
                <Input
                  label='Localização'
                  name='location'
                  disabled={buildingWatcher ? true : false}
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

export default InstitutionalEventModal;
