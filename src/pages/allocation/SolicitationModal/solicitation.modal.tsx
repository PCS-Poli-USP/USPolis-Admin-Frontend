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
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { SolicitationModalProps } from './solicitation.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultValues, schema } from './solicitation.modal.form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckBox, Input, SelectInput, Textarea } from 'components/common';
import useBuildings from 'hooks/useBuildings';
import { useEffect, useState } from 'react';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import useClassrooms from 'hooks/useClassrooms';
import { ReservationType } from 'utils/enums/reservations.enum';
import { NumberInput } from 'components/common/form/NumberInput';
import useClassroomsSolicitations from 'hooks/useClassroomSolicitations';
import DateCalendarPicker, {
  useDateCalendarPicker,
} from 'components/common/DateCalendarPicker';
import {
  ClassroomFullResponse,
  ClassroomWithConflictCount,
} from 'models/http/responses/classroom.response.models';
import ClassroomTimeGrid from 'components/common/ClassroomTimeGrid/classsroom.time.grid';

function SolicitationModal({ isOpen, onClose }: SolicitationModalProps) {
  const {
    isOpen: isOpenCGrid,
    onClose: onCloseCGrid,
    onOpen: onOpenCGrid,
  } = useDisclosure();

  const form = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    dayClick,
    setSelectedDays,
    selectedDays,
    highlightedDays,
    occupiedDays,
  } = useDateCalendarPicker();

  const { loading: loadingB, buildings } = useBuildings();
  const {
    loading: loadingC,
    classrooms,
    getClassroomsWithConflictFromTime,
    listOneFull,
  } = useClassrooms();
  const { createSolicitation } = useClassroomsSolicitations();
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingResponse>();
  const [classroomsWithConflict, setClassroomsWithConflict] =
    useState<ClassroomWithConflictCount[]>();
  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomFullResponse>();
  const [showDatesError, setShowDatesError] = useState(false);
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');

  const { trigger, reset, getValues, clearErrors, watch, resetField } = form;
  const building_id = watch('building_id');
  const classroom_id = watch('classroom_id');
  const title = watch('reservation_title');
  const optionalClassroom = watch('optional_classroom');
  const optionalTime = watch('optional_time');
  const requiredClassroom = watch('required_classroom');

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
      required_classroom: values.required_classroom,
      reason: values.reason,
      reservation_title: values.reservation_title,
      reservation_type: values.reservation_type,
      capacity: values.capacity,
      start_time: values.start_time,
      end_time: values.end_time,
      dates: selectedDays,
    });
    handleClose();
  }

  function handleClose() {
    reset(defaultValues);
    clearErrors();
    onClose();
    setSelectedDays([]);
  }

  useEffect(() => {
    const fetchClassrooms = async () => {
      if (building_id && start && end && selectedDays.length > 0) {
        const result = await getClassroomsWithConflictFromTime(
          { start_time: start, end_time: end, dates: selectedDays },
          building_id,
        );
        setClassroomsWithConflict(result);
      }
    };
    fetchClassrooms();
  }, [
    building_id,
    start,
    end,
    selectedDays,
    getClassroomsWithConflictFromTime,
  ]);

  useEffect(() => {
    const fetchSelectedClassroom = async () => {
      if (classroom_id) {
        const result = await listOneFull(classroom_id);
        setSelectedClassroom(result);
      }
    };
    fetchSelectedClassroom();
  }, [classroom_id, listOneFull]);

  console.log('Prédio: ', building_id, selectedBuilding);
  console.log('Horario: ', optionalTime, start, end);
  console.log('Dias: ', selectedDays);
  console.log('Sala opcional? ', optionalClassroom);
  console.log('Salas: ', classrooms);
  console.log('Salas - C: ', classroomsWithConflict);
  console.log('Sala selecionada: ', classroom_id, selectedClassroom);
  console.log('Sala: ', requiredClassroom);
  console.log('');

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
          <ClassroomTimeGrid
            isOpen={isOpenCGrid}
            onClose={onCloseCGrid}
            classroom={selectedClassroom}
            preview={{
              title: title,
              dates: selectedDays,
              start_time: start,
              end_time: end,
            }}
          />
          <FormProvider {...form}>
            <form>
              <VStack alignItems={'flex-start'}>
                <HStack flex={'1'} w={'full'}>
                  <VStack h={'100%'} w={'100%'} alignItems={'flex-start'}>
                    <Input
                      label={'Título'}
                      name={'reservation_title'}
                      placeholder='Título da Reserva'
                    />
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
                        onChange={(event) => setStart(event.target.value)}
                      />
                      <Input
                        label={'Horário de fim'}
                        name={'end_time'}
                        placeholder='Horário de encerramento da disciplina'
                        type='time'
                        disabled={optionalTime}
                        onChange={(event) => setEnd(event.target.value)}
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

                <Textarea label='Motivo (Opcional)' name='reason' />
                <Text fontWeight={'bold'}>
                  *A sala reservada pode ser diferente da solicitada.{' '}
                </Text>

                <HStack w={'full'}>
                  <SelectInput
                    w={300}
                    label='Prédio'
                    name='building_id'
                    isLoading={loadingB}
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
                    w={300}
                    disabled={
                      !selectedBuilding ||
                      optionalClassroom ||
                      (!optionalTime &&
                        !start &&
                        !end &&
                        selectedDays.length === 0)
                    }
                    isLoading={loadingC}
                    label='Sala'
                    name='classroom_id'
                    placeholder={
                      !selectedBuilding
                        ? 'Selecione um prédio antes'
                        : !optionalTime && !start && !end
                        ? 'Selecione um horário antes'
                        : selectedDays.length === 0
                        ? 'Selecione as datas'
                        : 'Selecione uma sala'
                    }
                    options={
                      !selectedBuilding
                        ? []
                        : optionalTime
                        ? classrooms.map((val) => ({
                            value: val.id,
                            label: val.name,
                          }))
                        : selectedDays.length === 0
                        ? []
                        : start && end && classroomsWithConflict
                        ? classroomsWithConflict.map((val) => ({
                            label: val.conflicts
                              ? `⚠️ ${val.name} (${val.conflicts} conflitos)`
                              : val.name,
                            value: val.id,
                          }))
                        : []
                    }
                  />
                  <Tooltip
                    label={
                      !classroom_id
                        ? 'Selecione uma sala'
                        : selectedDays.length === 0
                        ? 'Selecione os dias'
                        : ''
                    }
                  >
                    <Button
                      mt={8}
                      isDisabled={!classroom_id || selectedDays.length === 0}
                      onClick={() => onOpenCGrid()}
                    >
                      Visualizar Disponibilidade
                    </Button>
                  </Tooltip>
                </HStack>
                <HStack w={'full'} spacing={2}>
                  <CheckBox
                    disabled={requiredClassroom}
                    text='Não quero especificar sala'
                    name='optional_classroom'
                    onChange={(value) => {
                      if (value) {
                        resetField('classroom_id', { defaultValue: undefined });
                      }
                    }}
                  />
                  <CheckBox
                    ml={10}
                    disabled={!classroom_id || optionalClassroom}
                    text='Quero necessariamente essa sala'
                    name='required_classroom'
                  />
                </HStack>
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
