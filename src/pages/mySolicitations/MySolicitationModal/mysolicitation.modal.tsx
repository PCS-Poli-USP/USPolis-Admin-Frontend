import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
  Heading,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { ModalProps } from '../../../models/interfaces';
import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import { ReservationType } from '../../../utils/enums/reservations.enum';
import moment from 'moment';
import { ReservationStatus } from '../../../utils/enums/reservations.enum';

interface MySoliciationModalProps extends ModalProps {
  solicitation?: SolicitationResponse;
}

function MySolicitationModal({
  isOpen,
  onClose,
  solicitation,
}: MySoliciationModalProps) {
  return (
    <>
      {solicitation ? (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textColor={'black'}>Reserva de Sala</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align={'flex-start'} spacing={4}>
                <Box>
                  <Heading
                    size='sm'
                    textTransform='uppercase'
                    textColor={'black'}
                  >
                    Solicitante
                  </Heading>
                  <Text pt='2' fontSize='md' textColor={'black'}>
                    {`${solicitation.user}`}
                  </Text>
                  <Text pt='2' fontSize='md' textColor={'black'}>
                    {`${solicitation.email}`}
                  </Text>
                </Box>
                <Box>
                  <Heading
                    size='sm'
                    textTransform='uppercase'
                    textColor={'black'}
                  >
                    {`Motivo - ${ReservationType.translate(
                      solicitation.reservation.type,
                    )}`}
                  </Heading>
                  <Text
                    pt='2'
                    fontSize='md'
                    textColor={'black'}
                    textAlign={'justify'}
                  >
                    {solicitation.reservation.reason
                      ? solicitation.reservation.reason
                      : 'Descrição não informada.'}
                  </Text>
                </Box>
                <Box>
                  <Heading
                    size='sm'
                    textTransform='uppercase'
                    textColor={'black'}
                  >
                    Local, Horário e Datas
                  </Heading>
                  <Text pt='2' fontSize='md' textColor={'black'}>
                    {`Local: ${solicitation.building}, sala ${
                      solicitation.reservation.classroom_name
                        ? solicitation.reservation.classroom_name
                        : 'NÃO ESPECIFICADA'
                    }`}
                    <br />
                    {`Início: ${
                      solicitation.reservation.schedule.start_time
                        ? moment(
                            solicitation.reservation.schedule.start_time,
                            'HH:mm',
                          ).format('HH:mm')
                        : 'NÃO ESPECIFICADO'
                    }`}
                    <br />
                    {`Fim: ${
                      solicitation.reservation.schedule.end_time
                        ? moment(
                            solicitation.reservation.schedule.end_time,
                            'HH:mm',
                          ).format('HH:mm')
                        : 'NÃO ESPECIFICADO'
                    }`}
                    <br />
                    {/* {`Dias: ${solicitation.dates
                      .map((date) => moment(date).format('DD/MM/YYYY'))
                      .join(', ')}`} */}
                  </Text>
                  <HStack
                    align={'center'}
                    alignContent={'center'}
                    alignItems={'center'}
                    verticalAlign={'center'}
                  >
                    <Text textColor={'red.500'} mt={1}>
                      {solicitation.required_classroom
                        ? 'Obrigatóriamente essa sala'
                        : ''}
                    </Text>
                  </HStack>
                </Box>
                <Box>
                  <Heading
                    size='sm'
                    textTransform='uppercase'
                    textColor={'black'}
                  >
                    Requisitos
                  </Heading>
                  <Text pt='2' fontSize='md' textColor={'black'}>
                    {`Capacidade para ${solicitation.capacity} pessoas`}
                  </Text>
                </Box>
                <Box>
                  <Heading
                    size='sm'
                    textTransform='uppercase'
                    textColor={'black'}
                  >
                    Situação
                  </Heading>
                  <Text
                    pt='2'
                    fontSize='md'
                    textColor={ReservationStatus.getColor(solicitation.status)}
                  >
                    {ReservationStatus.translate(solicitation.status)}
                  </Text>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      ) : undefined}
    </>
  );
}

export default MySolicitationModal;
