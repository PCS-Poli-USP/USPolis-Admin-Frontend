import {
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
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { SolicitationModalProps } from './solicitation.modal.interface';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultValues, schema } from './solicitation.modal.form';
import { yupResolver } from '@hookform//resolvers/yup';
import { CheckBox, Input, SelectInput, Textarea } from '../../../components/common';
import { useEffect, useState } from 'react';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import useClassrooms from '../../../hooks/classrooms/useClassrooms';
import { ReservationType } from '../../../utils/enums/reservations.enum';
import { NumberInput } from '../../../components/common/form/NumberInput';
import useClassroomsSolicitations from '../../../hooks/useClassroomSolicitations';
import DateCalendarPicker, {
  useDateCalendarPicker,
} from '../../../components/common/DateCalendarPicker';
import {
  ClassroomFullResponse,
  ClassroomWithConflictCount,
} from '../../../models/http/responses/classroom.response.models';
import ClassroomTimeGrid from '../../../components/common/ClassroomTimeGrid/classroom.time.grid';
import { Recurrence } from '../../../utils/enums/recurrence.enum';

function SolicitationModal({
  buildings,
  classrooms,
  loadingBuildings,
  loadingClassrooms,
  isOpen,
  onClose,
  isMobile,
  refetch,
}: SolicitationModalProps) {
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

  const {
    loading: loadingC,
    getClassroomsWithConflictFromTime,
    listOneFull,
  } = useClassrooms(false);

  const { loading, createSolicitation } = useClassroomsSolicitations(false);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingResponse>();
  const [classroomsWithConflict, setClassroomsWithConflict] =
    useState<ClassroomWithConflictCount[]>();
  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomFullResponse>();
  const [showDatesError, setShowDatesError] = useState(false);

  const { trigger, reset, getValues, clearErrors, watch, resetField } = form;
  const building_id = watch('building_id');
  const classroom_id = watch('classroom_id');
  const title = watch('reservation_title');
  const optionalClassroom = watch('optional_classroom');
  const optionalTime = watch('optional_time');
  const requiredClassroom = watch('required_classroom');
  const start = watch('start_time');
  const end = watch('end_time');

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
      required_classroom: requiredClassroom,
      reason: values.reason,
      reservation_title: values.reservation_title,
      reservation_type: values.reservation_type,
      capacity: values.capacity,
      start_time: values.start_time,
      end_time: values.end_time,
      dates: selectedDays,
    });
    await refetch();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [building_id, start, end, selectedDays]);

  useEffect(() => {
    const fetchSelectedClassroom = async () => {
      if (classroom_id) {
        const result = await listOneFull(classroom_id);
        setSelectedClassroom(result);
      }
    };
    fetchSelectedClassroom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroom_id]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      size={'4xl'}
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
              start_time: start || '',
              end_time: end || '',
            }}
            scheduleDetails={{
              recurrence: Recurrence.CUSTOM,
              week_day: undefined,
              month_week: undefined,
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
                        max={end}
                        disabled={optionalTime}
                      />
                      <Input
                        label={'Horário de fim'}
                        name={'end_time'}
                        placeholder='Horário de encerramento da disciplina'
                        type='time'
                        disabled={optionalTime}
                        min={start}
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
                  <VStack spacing={0} hidden={isMobile}>
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

                <VStack spacing={0} hidden={!isMobile} mt={'10px'} mb={'10px'}>
                  <DateCalendarPicker
                    header={'Selecione as datas'}
                    dayClick={(day) => {
                      setShowDatesError(false);
                      dayClick(day);
                    }}
                    selectedDays={selectedDays}
                    highlightedDays={highlightedDays}
                    occupiedDays={occupiedDays}
                    helpText={true}
                  />
                  <Text
                    fontSize={'sm'}
                    textColor={'red.500'}
                    hidden={!showDatesError}
                  >
                    Selecione pelo menos uma data
                  </Text>
                </VStack>

                <Text fontWeight={'bold'}>
                  *A sala reservada pode ser diferente da solicitada.{' '}
                </Text>

                <Flex
                  w={'full'}
                  direction={isMobile ? 'column' : 'row'}
                  gap={isMobile ? '0px' : '5px'}
                >
                  <SelectInput
                    w={300}
                    label='Prédio'
                    name='building_id'
                    isLoading={loadingBuildings}
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
                      (!optionalTime && !start && !end) ||
                      selectedDays.length === 0
                    }
                    isLoading={loadingC || loadingClassrooms}
                    label='Sala'
                    name='classroom_id'
                    placeholder={
                      !selectedBuilding
                        ? 'Selecione um prédio antes'
                        : !optionalTime && !start && !end
                        ? 'Selecione um horário antes'
                        : selectedDays.length === 0
                        ? 'Selecione as datas primeiro'
                        : 'Selecione uma sala'
                    }
                    options={
                      !selectedBuilding
                        ? []
                        : optionalTime
                        ? classrooms
                            .filter(
                              (val) => val.building_id === selectedBuilding.id,
                            )
                            .map((val) => ({
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
                      mt={isMobile ? 4 : 8}
                      isDisabled={!classroom_id || selectedDays.length === 0}
                      onClick={() => onOpenCGrid()}
                    >
                      Visualizar Disponibilidade
                    </Button>
                  </Tooltip>
                </Flex>

                <Flex
                  w={'full'}
                  gap={2}
                  direction={isMobile ? 'column' : 'row'}
                >
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
                    ml={isMobile ? 0 : 20}
                    disabled={!classroom_id || optionalClassroom}
                    text='Quero necessariamente essa sala'
                    name='required_classroom'
                  />
                </Flex>
              </VStack>
            </form>
          </FormProvider>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={handleClose}>
            Fechar
          </Button>
          <Button
            isLoading={
              loadingBuildings || loadingClassrooms || loadingC || loading
            }
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
