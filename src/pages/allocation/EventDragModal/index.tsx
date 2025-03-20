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
import { EventExtendedProps } from 'models/http/responses/allocation.response.models';
import { ModalProps } from 'models/interfaces';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { classNumberFromClassCode } from 'utils/classes/classes.formatter';

interface EventDragModalProps extends ModalProps {
  dragEvent?: EventDropArg;
  handleCancel: () => void;
}

type RadioValue = 'all' | 'one';

function EventDragModal(props: EventDragModalProps) {
  const [selectValue, setSelectValue] = useState<RadioValue>();
  const [hasError, setHasError] = useState(false);
  const [start, setStart] = useState<Moment>();
  const [end, setEnd] = useState<Moment>();
  const [building, setBuilding] = useState<string>();
  const [classroom, setClassroom] = useState<string>();

  useEffect(() => {
    if (props.dragEvent) {
      setStart(moment(props.dragEvent.event.startStr));
      setEnd(moment(props.dragEvent.event.endStr));

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

  async function handleSubmit() {
    if (!selectValue) {
      setHasError(true);
      return;
    }
    console.log(selectValue);
    console.log(props.dragEvent);
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
                <b>Horário:</b> {start && start.format('HH:mm')} -{' '}
                {end && end.format('HH:mm')}
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
                    {!hasError ? undefined : (
                      <FormErrorMessage>Selecione uma opção</FormErrorMessage>
                    )}
                  </VStack>
                </RadioGroup>
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
