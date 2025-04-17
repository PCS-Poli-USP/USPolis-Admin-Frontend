import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { EventDropArg } from '@fullcalendar/core';
import {
  ClassExtendedData,
  EventExtendedProps,
  ReservationExtendedData,
} from '../../../models/http/responses/allocation.response.models';
import { ModalProps } from '../../../models/interfaces';
import { useEffect, useState } from 'react';
import { classNumberFromClassCode } from '../../../utils/classes/classes.formatter';
import useAllocation from '../hooks/useAllocation';
import { EventUpdate } from '../../../models/http/requests/allocation.request.models';
import { AllocationEnum } from '../../../utils/enums/allocation.enum';
import moment from 'moment';

interface EventDragModalProps extends ModalProps {
  dragEvent?: EventDropArg;
  handleCancel: () => void;
  refetch: () => Promise<void>;
}

type RadioValue = 'all' | 'one';

function EventDragModal(props: EventDragModalProps) {
  const { updateEvent } = useAllocation(false, false);

  const [selectValue, setSelectValue] = useState<RadioValue>();
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [building, setBuilding] = useState<string>();
  const [classroom, setClassroom] = useState<string>();

  function getStartTimeFromEvent(event: EventDropArg) {
    if (event.event.startStr) {
      return moment(event.event.startStr).format('HH:mm');
    }
    const data = event.event._def.extendedProps as EventExtendedProps;
    if (data.class_data) {
      return data.class_data.start_time;
    }
    if (data.reservation_data) {
      return data.reservation_data.start_time;
    }
    return '';
  }

  function getEndTimeFromEvent(event: EventDropArg) {
    if (event.event.endStr) {
      return moment(event.event.endStr).format('HH:mm');
    }
    const data = event.event._def.extendedProps as EventExtendedProps;
    if (data.class_data) {
      return data.class_data.end_time;
    }
    if (data.reservation_data) {
      return data.reservation_data.end_time;
    }
    return '';
  }

  useEffect(() => {
    if (props.dragEvent) {
      const start = getStartTimeFromEvent(props.dragEvent);
      const end = getEndTimeFromEvent(props.dragEvent);
      setStart(start.substring(0, 5));
      setEnd(end.substring(0, 5));

      const values = props.dragEvent.event._def.resourceIds;
      if (values && values.length > 0) {
        const index = values[0].indexOf('-');
        if (index !== -1) {
          const first = values[0].substring(0, index);
          const second = values[0].substring(index + 1);
          if (first) {
            setBuilding(first);
          }
          if (second) {
            setClassroom(second);
          }
        }
      }
    }
  }, [props.dragEvent]);

  function getEventUpdateInput(
    selectValue: RadioValue,
    start: string,
    end: string,
    classroom: string,
    building: string,
    data: ClassExtendedData | ReservationExtendedData,
  ): EventUpdate {
    return {
      desalocate:
        classroom === AllocationEnum.UNALLOCATED &&
        building === AllocationEnum.UNALLOCATED,
      all_occurrences: selectValue === 'all',
      start_time: start,
      end_time: end,
      building: building,
      classroom: classroom,
      schedule_id: data.schedule_id,
      occurrence_id: data.occurrence_id,
    };
  }

  async function handleSubmit() {
    if (!selectValue) {
      setHasError(true);
      setErrorMsg('Selecione uma opção');
      return;
    }
    if (!building || !classroom) {
      setErrorMsg('Sala ou prédio inválido');
      return;
    }
    if (!props.dragEvent) {
      setHasError(true);
      setErrorMsg('Evento inválido');
      return;
    }
    if (!start || !end) {
      setHasError(true);
      setErrorMsg('Um ou mais horários inválidos');
      return;
    }
    const extended = props.dragEvent.event._def
      .extendedProps as EventExtendedProps;
    if (!extended.class_data && !extended.reservation_data) {
      setHasError(true);
      setErrorMsg('Evento inválido');
      return;
    }
    const dataInput = extended.class_data || extended.reservation_data;
    if (!dataInput) {
      setHasError(true);
      setErrorMsg('Dados do evento inválidos');
      return;
    }
    const data = getEventUpdateInput(
      selectValue,
      start,
      end,
      classroom,
      building,
      dataInput,
    );
    await updateEvent(data);
    setHasError(false);
    setSelectValue(undefined);
    props.refetch();
    props.onClose();
  }

  function getEventTitle(arg: EventDropArg) {
    const extended: EventExtendedProps = arg.event._def.extendedProps;
    if (extended.class_data) {
      return `${extended.class_data.subject_name}`;
    }
    if (extended.reservation_data) {
      return `${extended.reservation_data.title}`;
    }
  }

  function getEventType(arg: EventDropArg | undefined) {
    if (!arg) return '';
    const extended: EventExtendedProps = arg.event._def.extendedProps;
    if (extended.class_data) {
      return `Turma - ${
        extended.class_data.subject_code
      } T${classNumberFromClassCode(extended.class_data.code)}`;
    }
    if (extended.reservation_data) {
      return `Reserva`;
    }
  }

  function handleClose() {
    props.handleCancel();
    props.onClose();
    setHasError(false);
    setSelectValue(undefined);
  }

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Editar {getEventType(props.dragEvent)}
          <Heading size={'md'}>
            {props.dragEvent ? `${getEventTitle(props.dragEvent)}` : ''}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {props.dragEvent ? (
            <VStack direction={'column'} gap={'10px'} align={'start'}>
              <Heading size={'md'}>Novas Informações</Heading>
              <Text>
                <b>Local:</b> {building ? building : 'Não encontrado'},{' '}
                {classroom ? classroom : 'Não encontrada'}
              </Text>
              <Text>
                <b>Horário:</b> {start ? start : 'Hora inválida'} -{' '}
                {end ? end : 'Hora inválida'}
              </Text>

              <Heading size={'md'}>Opções</Heading>
              <FormControl isInvalid={hasError}>
                <RadioGroup
                  onChange={(val) => {
                    setSelectValue(val ? (val as RadioValue) : undefined);
                    if (val) setHasError(false);
                  }}
                  value={selectValue}
                >
                  <VStack justify={'center'} align={'start'} p={'10px'}>
                    <Radio value='one' size={'lg'}>
                      Apenas essa ocorrência
                    </Radio>
                    <Radio value='all' size={'lg'}>
                      Todos as ocorrências
                    </Radio>
                  </VStack>
                </RadioGroup>
                {!hasError ? undefined : (
                  <FormErrorMessage>{errorMsg}</FormErrorMessage>
                )}
              </FormControl>
            </VStack>
          ) : (
            <Text>Evento não encontrado</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Flex direction={'row'} gap={'10px'}>
            <Button colorScheme='red' onClick={() => handleClose()}>
              Cancelar
            </Button>
            <Button
              disabled={!selectValue || !props.dragEvent}
              colorScheme='blue'
              onClick={async () => {
                await handleSubmit();
              }}
            >
              Confirmar
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EventDragModal;
