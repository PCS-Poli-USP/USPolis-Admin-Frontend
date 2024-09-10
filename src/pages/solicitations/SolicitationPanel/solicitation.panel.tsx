import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  HStack,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  StackDivider,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import moment from 'moment';
import { useState } from 'react';
import { ClassroomSolicitationAprove } from 'models/http/requests/classroomSolicitation.request.models';
import { ClassroomResponse } from 'models/http/responses/classroom.response.models';
import { ReservationType } from 'utils/enums/reservations.enum';

interface SolicitationPanelProps {
  solicitation?: ClassroomSolicitationResponse;
  loading: boolean;
  approve: (id: number, data: ClassroomSolicitationAprove) => void;
  deny: (id: number) => void;
}

function SolicitationPanel({
  solicitation,
  loading,
  approve,
  deny,
}: SolicitationPanelProps) {
  const [openPopover, setOpenPopover] = useState<number | undefined>(undefined);
  const [justification, setJustification] = useState('');
  const [justificationError, setJustificationError] = useState(false);

  const [classroom, setClassroom] = useState<ClassroomResponse | undefined>(
    undefined,
  );
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  function handleOpenPopover(id: number) {
    if (openPopover === id) {
      setOpenPopover(undefined);
    } else {
      setOpenPopover(id);
    }
  }

  return (
    <Card w={'100%'} border={'2px solid lightgray'} hidden={!solicitation}>
      {!!solicitation ? (
        <>
          <CardHeader>
            <Heading size={'lg'}>{`Reserva de Sala - ${
              solicitation.classroom
                ? solicitation.classroom
                : 'Não especificada'
            }`}</Heading>
            <Heading
              size={'md'}
              textColor={
                solicitation.approved
                  ? 'green'
                  : solicitation.denied
                  ? 'red.500'
                  : 'yellow.500'
              }
            >{`${
              solicitation.approved
                ? 'Aprovado'
                : solicitation.denied
                ? 'Negado'
                : 'Pendente'
            }`}</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
              <Box>
                <Heading size='sm' textTransform='uppercase'>
                  Solicitante
                </Heading>
                <Text pt='2' fontSize='md'>
                  {solicitation.user}
                  <br />
                  {solicitation.email}
                </Text>
              </Box>
              <Box>
                <Heading size='sm' textTransform='uppercase'>
                  {`Motivo - ${ReservationType.translate(solicitation.reservation_type)}`}
                </Heading>
                <Text pt='2' fontSize='md'>
                  {solicitation.reason}
                </Text>
              </Box>
              <Box>
                <Heading size='sm' textTransform='uppercase'>
                  Local, Horário e Datas
                </Heading>
                <Text pt='2' fontSize='md'>
                  {`Local: ${solicitation.building}, sala ${
                    solicitation.classroom
                      ? solicitation.classroom
                      : 'NÃO ESPECIFICADA'
                  }`}
                  <br />
                  {`Início: ${
                    solicitation.start_time
                      ? moment(solicitation.start_time, 'HH:mm').format('HH:mm')
                      : 'NÃO ESPECIFICADO'
                  } - `}
                  {`Fim: ${
                    solicitation.end_time
                      ? moment(solicitation.end_time, 'HH:mm').format('HH:mm')
                      : 'NÃO ESPECIFICADO'
                  }`}
                  <br />
                  {`Dias: ${solicitation.dates
                    .map((date) => moment(date).format('DD/MM/YYYY'))
                    .join(', ')}`}
                </Text>
              </Box>
              <Box>
                <Heading size='sm' textTransform='uppercase'>
                  Requisitos
                </Heading>
                <Text pt='2' fontSize='md'>
                  {`Capacidade para ${solicitation.capacity} pessoas`}
                </Text>
              </Box>
            </Stack>
          </CardBody>
          <CardFooter>
            <HStack>
              <Popover placement={'top'} isOpen={openPopover === 1}>
                <PopoverTrigger>
                  <Button
                    isLoading={loading}
                    rightIcon={<CloseIcon />}
                    colorScheme='red'
                    isDisabled={solicitation.closed}
                    onClick={() => handleOpenPopover(1)}
                  >
                    Negar
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader fontWeight={'bold'}>
                    Essa ação é irreversível
                  </PopoverHeader>
                  <PopoverCloseButton onClick={() => handleOpenPopover(1)} />
                  <PopoverBody>
                    <VStack alignItems={'start'} alignContent={'flex-start'}>
                      <Text>
                        Uma vez negado não será possível mudar o estado da
                        solicitação
                      </Text>
                      <Text fontWeight={'bold'}>Justificativa: </Text>
                      <Textarea
                        borderColor={justificationError ? 'red.300' : undefined}
                        value={justification}
                        onChange={(event) => {
                          setJustification(event.target.value);
                          setJustificationError(false);
                        }}
                      />
                      <Text textColor={'red.500'} hidden={!justificationError}>
                        Campo obrigatório
                      </Text>
                      <Button
                        onClick={() => {
                          if (justification.length === 0) {
                            setJustificationError(true);
                            return;
                          }
                          deny(solicitation.id);
                          handleOpenPopover(1);
                        }}
                      >
                        Confirmar
                      </Button>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <Popover placement={'top'} isOpen={openPopover === 2}>
                <PopoverTrigger>
                  <Button
                    isLoading={loading}
                    rightIcon={<CheckIcon />}
                    colorScheme='green'
                    isDisabled={solicitation.closed}
                    onClick={() => handleOpenPopover(2)}
                  >
                    Aprovar
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader fontWeight={'bold'}>
                    Essa ação é irreversível
                  </PopoverHeader>
                  <PopoverCloseButton onClick={() => handleOpenPopover(2)} />
                  <PopoverBody>
                    <VStack alignItems={'start'} alignContent={'flex-start'}>
                      <Text>
                        Uma vez aprovado a sala será reservada e a solicitação
                        não poderá mudar seu estado.
                      </Text>
                      <Button
                        onClick={() => {
                          if (!solicitation.classroom_id && !classroom) return;

                          approve(solicitation.id, {
                            classroom_id: solicitation.classroom_id
                              ? solicitation.classroom_id
                              : classroom
                              ? classroom.id
                              : 0,
                            start_time: solicitation.start_time
                              ? solicitation.start_time
                              : start,
                            end_time: solicitation.end_time
                              ? solicitation.end_time
                              : end,
                          });
                          handleOpenPopover(2);
                        }}
                      >
                        Confirmar
                      </Button>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
          </CardFooter>
        </>
      ) : undefined}
    </Card>
  );
}

export default SolicitationPanel;
