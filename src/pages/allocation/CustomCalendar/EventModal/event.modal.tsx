import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Box,
  useColorMode,
} from '@chakra-ui/react';
import { ModalProps } from '../../../../models/interfaces';
import { EventApi } from '@fullcalendar/core';
import moment from 'moment';
import { getEventScheduleText } from '../../../../pages/allocation/utils/allocation.formatter';
import { classNumberFromClassCode } from '../../../../utils/classes/classes.formatter';
import { EventExtendedProps } from '../../../../models/http/responses/allocation.response.models';

interface EventModalProps extends ModalProps {
  event?: EventApi;
}

function EventModal({ isOpen, onClose, event }: EventModalProps) {
  const extendedProps: EventExtendedProps | undefined = event
    ? event?.extendedProps
    : undefined;
  const classData = extendedProps ? extendedProps.class_data : undefined;
  const reservationData = extendedProps
    ? extendedProps.reservation_data
    : undefined;

  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const textColor = isDark ? 'uspolis.black' : 'uspolis.blue';

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={isDark ? 'white' : '#408080'}>
          {event ? event.title : ''}
          <Text>{classData ? classData.subject_name : ''}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align={'flex-start'} spacing={2}>
            {classData ? (
              <>
                <VStack spacing={'2px'} alignItems='start'>
                  <Text fontSize='xl' textColor={textColor} fontWeight='bold'>
                    {`Turma ${classNumberFromClassCode(classData.code)}`}
                  </Text>
                </VStack>
                <Box>
                  <Text fontSize='xl' textColor={textColor} fontWeight='bold'>
                    Professores
                  </Text>
                  {(classData.professors as string[]).map(
                    (professor, index) => (
                      <Text fontSize='lg' textColor={textColor} key={index}>
                        {professor}
                      </Text>
                    ),
                  )}
                </Box>

                <Box>
                  <Text fontSize='xl' textColor={textColor} fontWeight='bold'>
                    Informações
                  </Text>
                  <Text fontSize='lg' textColor={textColor}>{`Prédio: ${
                    classData.building ? classData.building : 'NÃO ALOCADA'
                  }`}</Text>
                  <Text fontSize='lg' textColor={textColor}>{`Sala: ${
                    classData.classroom_capacity
                      ? `${classData.classroom} [${classData.classroom_capacity} capacidade]`
                      : classData.classroom
                  }`}</Text>

                  <Text fontSize='lg' textColor={textColor}>
                    {extendedProps ? getEventScheduleText(extendedProps) : ''}
                  </Text>

                  <Text fontSize='lg' textColor={textColor}>
                    {`Horário: ${classData.start_time.substring(
                      0,
                      5,
                    )} ~ ${classData.end_time.substring(0, 5)}`}
                  </Text>

                  <Text
                    fontSize='lg'
                    textColor={textColor}
                    hidden={classData.start_date ? false : true}
                  >
                    {`De ${
                      classData.start_date
                        ? moment(classData.start_date).format('DD/MM/YYYY')
                        : ''
                    } até ${
                      classData.end_date
                        ? moment(classData.end_date).format('DD/MM/YYYY')
                        : ''
                    }`}
                  </Text>

                  <Text
                    fontSize='lg'
                    textColor={textColor}
                  >{`Vagas: ${classData.vacancies}`}</Text>
                </Box>
              </>
            ) : undefined}

            {reservationData ? (
              <>
                <Text fontSize='xl' textColor={textColor} fontWeight='bold'>
                  {`Reserva - ${reservationData.title}`}
                </Text>

                <Box>
                  <Text fontSize='xl' textColor={textColor} fontWeight='bold'>
                    Motivo
                  </Text>
                  <Text fontSize='lg' textColor={textColor}>
                    {reservationData.reason
                      ? reservationData.reason
                      : 'Não informada'}
                  </Text>

                  <Text fontSize='xl' fontWeight='bold' textColor={textColor}>
                    Local
                  </Text>
                  <Text fontSize='lg' textColor={textColor}>
                    {`${reservationData.building} - ${reservationData.classroom}`}
                  </Text>

                  <Text fontSize='xl' fontWeight='bold' textColor={textColor}>
                    Horários
                  </Text>
                  <Text fontSize='lg' textColor={textColor}>
                    {extendedProps ? getEventScheduleText(extendedProps) : ''}
                  </Text>

                  <Text fontSize='lg' textColor={textColor}>
                    {`Horário: ${reservationData.start_time.substring(
                      0,
                      5,
                    )} ~ ${reservationData.end_time.substring(0, 5)}`}
                  </Text>

                  <Text
                    fontSize='lg'
                    textColor={textColor}
                    hidden={reservationData.start_date ? false : true}
                  >
                    {`De ${
                      reservationData.start_date
                        ? moment(reservationData.start_date).format(
                            'DD/MM/YYYY',
                          )
                        : ''
                    } até ${
                      reservationData.end_date
                        ? moment(reservationData.end_date).format('DD/MM/YYYY')
                        : ''
                    }`}
                  </Text>
                </Box>
              </>
            ) : undefined}
          </VStack>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EventModal;
