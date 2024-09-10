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
  VStack,
} from '@chakra-ui/react';
import { SolicitationModalProps } from './solicitation.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultValues, schema } from './solicitation.modal.form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckBox, Input, SelectInput, Textarea } from 'components/common';
import useBuildings from 'hooks/useBuildings';
import { useState } from 'react';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import useClassrooms from 'hooks/useClassrooms';
import { ReservationType } from 'utils/enums/reservations.enum';
import { NumberInput } from 'components/common/form/NumberInput';
import useClassroomsSolicitations from 'hooks/useClassroomSolicitations';
import DateCalendarPicker, {
  useDateCalendarPicker,
} from 'components/common/DateCalendarPicker';

function SolicitationModal({ isOpen, onClose }: SolicitationModalProps) {
  const form = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { dayClick, selectedDays, highlightedDays, occupiedDays } =
    useDateCalendarPicker();

  const { buildings } = useBuildings();
  const { classrooms } = useClassrooms();
  const { createSolicitation } = useClassroomsSolicitations();
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingResponse>();
  const [showDatesError, setShowDatesError] = useState(false);

  const { trigger, reset, getValues, clearErrors, watch, resetField } = form;
  const optionalClassroom = watch('optional_classroom');
  const optionalTime = watch('optional_time');

  async function handleSubmit() {
    const isValid = await trigger();
    if (!isValid) return;

    if (selectedDays.length === 0) {
      setShowDatesError(true);
      return;
    }

    const values = getValues();
    await createSolicitation({
      building_id: values.building_id,
      classroom_id: values.classroom_id,
      reason: values.reason,
      reservation_type: values.reservation_type,
      capacity: values.capacity,
      start_time: values.start_time,
      end_time: values.end_time,
      dates: selectedDays,
    });
    reset(defaultValues);
    clearErrors();
    onClose();
  }

  function handleClose() {
    reset(defaultValues);
    clearErrors();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      size={'3xl'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Solicitar Reserva de Sala</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...form}>
            <form>
              <VStack alignItems={'flex-start'}>
                <SelectInput
                  label='Prédio'
                  name='building_id'
                  options={buildings.map((building) => ({
                    label: building.name,
                    value: building.id,
                  }))}
                  onChange={(option) => {
                    if (option) {
                      setSelectedBuilding(
                        buildings.find(
                          (building) => building.id === option.value,
                        ),
                      );
                    } else setSelectedBuilding(undefined);
                  }}
                />

                <SelectInput
                  disabled={!selectedBuilding || optionalClassroom}
                  label='Sala'
                  name='classroom_id'
                  options={
                    selectedBuilding
                      ? classrooms
                          .filter(
                            (classrom) =>
                              classrom.building_id === selectedBuilding.id,
                          )
                          .map((val) => ({
                            label: val.name,
                            value: val.id,
                          }))
                      : []
                  }
                />
                <CheckBox
                  text='Não quero especificar sala'
                  name='optional_classroom'
                  onChange={(value) => {
                    if (value) {
                      resetField('classroom_id', { defaultValue: undefined });
                    }
                  }}
                />

                <HStack flex={'1'} w={'full'}>
                  <VStack h={'100%'} w={'100%'}>
                    <SelectInput
                      label={'Tipo de reserva'}
                      name={'reservation_type'}
                      options={ReservationType.getValues().map((value) => ({
                        value: value,
                        label: ReservationType.translate(value),
                      }))}
                    />
                    <NumberInput
                      name='capacity'
                      label='Quantidade de pessoas'
                      min={0}
                    />

                    <HStack w={'full'}>
                      <Input
                        label={'Horário de início'}
                        name={'start_time'}
                        placeholder='Horario de início da disciplina'
                        type='time'
                        disabled={optionalTime}
                      />
                      <Input
                        label={'Horário de fim'}
                        name={'end_time'}
                        placeholder='Horário de encerramento da disciplina'
                        type='time'
                        disabled={optionalTime}
                      />
                    </HStack>
                    <CheckBox
                      text='Não quero especificar horários'
                      name='optional_time'
                      onChange={(value) => {
                        if (value) {
                          resetField('start_time');
                          resetField('end_time');
                        }
                      }}
                    />
                  </VStack>
                  <VStack spacing={0}>
                    <DateCalendarPicker
                      header={'Selecione as datas'}
                      dayClick={(day) => {
                        setShowDatesError(false);
                        dayClick(day);
                      }}
                      selectedDays={selectedDays}
                      highlightedDays={highlightedDays}
                      occupiedDays={occupiedDays}
                    />
                    <Text
                      fontSize={'sm'}
                      textColor={'red.500'}
                      hidden={!showDatesError}
                    >
                      Selecione pelo menos uma data
                    </Text>
                  </VStack>
                </HStack>

                <Textarea label='Motivo' name='reason' />
              </VStack>
            </form>
          </FormProvider>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={handleClose}>
            Fechar
          </Button>
          <Button
            colorScheme='blue'
            onClick={async () => {
              await handleSubmit();
            }}
          >
            Solicitar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SolicitationModal;
