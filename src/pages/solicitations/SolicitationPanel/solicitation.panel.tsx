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

interface SolicitationPanelProps {
  solicitation?: ClassroomSolicitationResponse;
  loading: boolean;
  approve: (id: number) => void;
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
            <Heading
              size={'lg'}
            >{`Reserva de Sala - ${solicitation.classroom}`}</Heading>
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
                  Nome do usuário
                  <br />
                  {solicitation?.email}
                </Text>
              </Box>
              <Box>
                <Heading size='sm' textTransform='uppercase'>
                  Motivo
                </Heading>
                <Text pt='2' fontSize='md'>
                  {solicitation.reason}
                </Text>
              </Box>
              <Box>
                <Heading size='sm' textTransform='uppercase'>
                  Local e Horário
                </Heading>
                <Text pt='2' fontSize='md'>
                  {`Prédio ${solicitation.building}, sala ${
                    solicitation.classroom
                  } no dia ${moment(solicitation.date).format(
                    'DD/MM/YYYY',
                  )} das ${moment(solicitation.start_time, 'HH:mm').format(
                    'HH:mm',
                  )} até ${moment(solicitation.end_time, 'HH:mm').format(
                    'HH:mm',
                  )}`}
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
                          approve(solicitation.id);
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
