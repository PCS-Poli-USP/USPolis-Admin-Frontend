import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import Select, { SingleValue } from 'react-select';
import { ClassroomSolicitationResponse } from '../../../models/http/responses/classroomSolicitation.response.models';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  ClassroomSolicitationAprove,
  ClassroomSolicitationDeny,
} from '../../../models/http/requests/classroomSolicitation.request.models';
import {
  ClassroomFullResponse,
  ClassroomWithConflictCount,
} from '../../../models/http/responses/classroom.response.models';
import { ReservationType } from '../../../utils/enums/reservations.enum';
import useClassrooms from '../../../hooks/classrooms/useClassrooms';
import ClassroomTimeGrid from '../../../components/common/ClassroomTimeGrid/classroom.time.grid';
import { Recurrence } from '../../../utils/enums/recurrence.enum';
import { ConflictType } from '../../../utils/enums/conflictType.enum';

interface SolicitationPanelProps {
  solicitation?: ClassroomSolicitationResponse;
  loading: boolean;
  approve: (id: number, data: ClassroomSolicitationAprove) => Promise<void>;
  deny: (id: number, data: ClassroomSolicitationDeny) => Promise<void>;
  handleClose: () => void;
}

interface OptionType {
  label: string;
  value: number;
}

function SolicitationPanel({
  solicitation,
  loading,
  approve,
  deny,
  handleClose,
}: SolicitationPanelProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    loading: loadingClassrooms,
    getClassroomsWithConflictFromTime,
    listOneFull,
  } = useClassrooms(false);

  const [openPopover, setOpenPopover] = useState<number | undefined>(undefined);
  const [justification, setJustification] = useState('');
  const [justificationError, setJustificationError] = useState(false);

  const [isLoadingWithConflict, setIsLoadingWithConflict] = useState(false);
  const [classrooms, setClassrooms] = useState<ClassroomWithConflictCount[]>(
    [],
  );
  const [classroom, setClassroom] = useState<
    ClassroomWithConflictCount | undefined
  >(undefined);
  const [isLoadingFull, setIsLoadingFull] = useState(false);
  const [classroomFull, setClassroomFull] = useState<ClassroomFullResponse>();
  const [editingClassroom, setEditingClassroom] = useState(false);

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  function handleOpenPopover(id: number) {
    if (openPopover === id) {
      setOpenPopover(undefined);
    } else {
      setOpenPopover(id);
    }
  }

  function validateTime(start: string, end: string) {
    return moment(start, 'HH:mm').isBefore(moment(end, 'HH:mm'));
  }

  const fetchClassrooms = async () => {
    if (solicitation && !solicitation.closed && !isLoadingWithConflict) {
      if (start && end && validateTime(start, end)) {
        try {
          setIsLoadingWithConflict(true);
          const result = await getClassroomsWithConflictFromTime(
            {
              start_time: start,
              end_time: end,
              dates: solicitation.dates,
              type: ConflictType.UNINTENTIONAL,
            },
            solicitation?.building_id,
          );

          setClassrooms(result);
          if (solicitation.classroom_id && !classroom) {
            setClassroom(
              result.find((room) => room.id === solicitation.classroom_id),
            );
          } else {
            setClassroom(undefined);
          }
        } finally {
          setIsLoadingWithConflict(false);
        }
      } else {
        setClassrooms([]);
        setClassroom(undefined);
      }
    }
  };

  const fetchClassroomOccurrences = async () => {
    if (!solicitation) return;
    if (isLoadingFull) return;
    if (classroom && classroomFull && classroom.id === classroomFull.id) {
      return;
    }

    let id = -1;
    if (solicitation && !solicitation.closed) {
      if (classroom) {
        id = classroom.id;
      }
      if (solicitation.classroom_id && !classroom) {
        id = solicitation.classroom_id;
      }
    }

    if (id > 0) {
      try {
        setIsLoadingFull(true);
        const result = await listOneFull(id);
        setClassroomFull(result);
      } finally {
        setIsLoadingFull(false);
      }
    } else setClassroomFull(undefined);
  };

  useEffect(() => {
    setEditingClassroom(false);
    if (solicitation) {
      // Fetch solicitation data
      if (solicitation.start_time && solicitation.end_time) {
        setStart(solicitation.start_time);
        setEnd(solicitation.end_time);
      } else {
        setStart('');
        setEnd('');
      }
    }
  }, [solicitation]);

  // Fetch classrooms with conflicts count from time and dates
  useEffect(() => {
    fetchClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, start]);

  // Fetch classroom occurrences from selected classroom
  useEffect(() => {
    fetchClassroomOccurrences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroom, solicitation]);

  // Need when change between solicitations (the conclit count is not updated)
  useEffect(() => {
    if (solicitation && solicitation.classroom_id) {
      if (classrooms) {
        setClassroom(
          classrooms.find((val) => val.id === solicitation.classroom_id),
        );
      }
    }
  }, [classrooms, solicitation]);

  return (
    <Card
      w={'100%'}
      h={'100%'}
      border={'2px solid lightgray'}
      p={'4px'}
      zIndex={2}
    >
      {solicitation ? (
        <>
          <CardHeader mb={-5}>
            <HStack>
              <Heading size={'lg'}>{`Reserva de Sala - ${
                solicitation.classroom
                  ? solicitation.classroom
                  : 'Não especificada'
              }`}</Heading>
              <Spacer />
              <IconButton
                aria-label='close'
                icon={<CloseIcon />}
                variant={'ghost'}
                onClick={() => {
                  handleClose();
                }}
              />
            </HStack>
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
            <ClassroomTimeGrid
              isOpen={isOpen}
              onClose={onClose}
              classroom={classroomFull}
              preview={{
                title: solicitation.reservation_title,
                dates: solicitation.dates,
                start_time: start,
                end_time: end,
              }}
              scheduleDetails={{
                recurrence: Recurrence.CUSTOM,
                week_day: undefined,
                month_week: undefined,
              }}
            />
            <Stack divider={<StackDivider />} spacing='4'>
              <Box>
                <Heading size='sm' textTransform='uppercase'>
                  Solicitante e Título
                </Heading>
                <Text pt='2' fontSize='md'>
                  {`${solicitation.user} - ${solicitation.email}`}
                </Text>
                <Text pt='2' fontSize='md' fontWeight={'bold'}>
                  Título: {`${solicitation.reservation_title}`}
                </Text>
              </Box>
              <Box>
                <Heading size='sm' textTransform='uppercase'>
                  {`Motivo - ${ReservationType.translate(
                    solicitation.reservation_type,
                  )}`}
                </Heading>
                <Text pt='2' fontSize='md'>
                  {solicitation.reason
                    ? solicitation.reason
                    : 'Descrição não informada.'}
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
                <HStack
                  align={'center'}
                  alignContent={'center'}
                  alignItems={'center'}
                  verticalAlign={'center'}
                >
                  {solicitation.classroom_id && (
                    <Button
                      mt={2}
                      size={'sm'}
                      isDisabled={
                        solicitation.required_classroom || solicitation.closed
                      }
                      fontWeight={'bold'}
                      textColor={editingClassroom ? 'red.500' : 'yellow.500'}
                      onClick={() => {
                        if (editingClassroom) {
                          setClassroom(
                            classrooms.find(
                              (val) => val.id === solicitation.classroom_id,
                            ),
                          );
                        }
                        setEditingClassroom((prev) => !prev);
                      }}
                    >
                      {editingClassroom ? 'Cancelar' : 'Alterar Sala'}
                    </Button>
                  )}
                  <Text textColor={'red.500'} mt={1}>
                    {solicitation.required_classroom
                      ? 'Obrigatóriamente essa sala'
                      : ''}
                  </Text>
                </HStack>
              </Box>
              <Box>
                <Heading size='sm' textTransform='uppercase'>
                  Requisitos
                </Heading>
                <Text pt='2' fontSize='md'>
                  {`Capacidade para ${solicitation.capacity} pessoas`}
                </Text>
              </Box>

              {/* Time inputs if soliciation haven't times */}
              {!solicitation.closed &&
              (!solicitation.start_time || !solicitation.end_time) ? (
                <Box>
                  <Heading size={'sm'} textTransform='uppercase'>
                    Horários
                  </Heading>
                  <HStack mt={2} w={'full'} flex={'1'}>
                    <Input
                      w={'auto'}
                      type={'time'}
                      placeholder='Horário de início'
                      value={start}
                      isDisabled={loadingClassrooms}
                      onChange={(event) => setStart(event.target.value)}
                    />
                    <Input
                      w={'auto'}
                      type={'time'}
                      placeholder='Horário de fim'
                      value={end}
                      onChange={(event) => setEnd(event.target.value)}
                      isDisabled={loadingClassrooms}
                    />
                    <Button
                      isDisabled={!classroom}
                      onClick={() => onOpen()}
                      hidden={!solicitation.classroom_id || editingClassroom}
                    >
                      Visualizar disponibilidade
                    </Button>
                  </HStack>
                  <Text
                    hidden={validateTime(start, end)}
                    textColor={'red.500'}
                    mt={2}
                  >
                    Horário de início deve ser antes do horário de fim
                  </Text>
                  {classroom ? (
                    <>
                      <Text
                        textColor={
                          classroom && classroom.conflicts > 0
                            ? 'red.500'
                            : 'green.500'
                        }
                        mt={2}
                      >
                        {`Esse horário gerará ${
                          classroom ? classroom.conflicts : '0'
                        } conflito(s).`}
                      </Text>
                    </>
                  ) : undefined}
                </Box>
              ) : undefined}

              {/* Classroom Input If solicitation haven't a classroom */}
              {(!solicitation.closed && !solicitation.classroom) ||
              editingClassroom ? (
                <Box>
                  <Heading mb={2} size={'sm'} textTransform='uppercase'>
                    Sala
                  </Heading>
                  <HStack w={'full'}>
                    <Box w={'auto'}>
                      <Select
                        isClearable
                        isLoading={loadingClassrooms}
                        value={
                          classroom
                            ? {
                                label: classroom.conflicts
                                  ? `⚠️ ${classroom.name} (${classroom.conflicts} conflitos)`
                                  : classroom.name,
                                value: classroom.id,
                              }
                            : null
                        }
                        placeholder='Selecione uma sala'
                        isDisabled={
                          (!solicitation.start_time && !start) ||
                          (!solicitation.end_time && !end) ||
                          loadingClassrooms
                        }
                        options={classrooms.map((val) => ({
                          label: val.conflicts
                            ? `⚠️ ${val.name} (${val.conflicts} conflitos)`
                            : val.name,
                          value: val.id,
                        }))}
                        onChange={(newValue: SingleValue<OptionType>) => {
                          if (newValue) {
                            setClassroom(
                              classrooms.find(
                                (val) => val.id === newValue.value,
                              ),
                            );
                          } else setClassroom(undefined);
                        }}
                      />
                    </Box>
                    <Button
                      isDisabled={!classroom}
                      isLoading={loadingClassrooms}
                      onClick={() => onOpen()}
                    >
                      Visualizar disponibilidade
                    </Button>
                  </HStack>
                  <Text
                    hidden={classroom ? classroom.conflicts === 0 : true}
                    textColor={'red.500'}
                  >
                    Essa sala gerará conflitos!
                  </Text>
                </Box>
              ) : undefined}

              {/* If solicitation has a classroom show timegrid button */}
              {!solicitation.closed &&
              solicitation.classroom &&
              solicitation.start_time &&
              solicitation.end_time ? (
                <>
                  <Button
                    onClick={() => onOpen()}
                    w={'fit-content'}
                    isDisabled={loadingClassrooms}
                  >
                    Visualizar disponibilidade
                  </Button>
                  <Text
                    textColor={
                      classroom && classroom.conflicts > 0
                        ? 'red.500'
                        : 'green.500'
                    }
                    mt={2}
                  >
                    {`Esse horário gerará ${
                      classroom ? classroom.conflicts : '0'
                    } conflito(s).`}
                  </Text>
                </>
              ) : undefined}
            </Stack>
          </CardBody>

          <CardFooter>
            <HStack>
              <Popover placement={'top'} isOpen={openPopover === 2}>
                <PopoverTrigger>
                  <Button
                    isLoading={loading || loadingClassrooms}
                    rightIcon={<CheckIcon />}
                    colorScheme='green'
                    isDisabled={
                      solicitation.closed ||
                      (!solicitation.classroom && !classroom) ||
                      (!solicitation.start_time && !start) ||
                      (!solicitation.end_time && !end) ||
                      !validateTime(start, end)
                    }
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
                        onClick={async () => {
                          if (!solicitation.classroom_id && !classroom) return;

                          await approve(solicitation.id, {
                            classroom_id: classroom
                              ? classroom.id
                              : solicitation.classroom_id
                                ? solicitation.classroom_id
                                : 0,
                            classroom_name: classroom
                              ? classroom.name
                              : solicitation.classroom
                                ? solicitation.classroom
                                : 'Sem nome',
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

              <Popover placement={'top'} isOpen={openPopover === 1}>
                <PopoverTrigger>
                  <Button
                    isLoading={loading || loadingClassrooms}
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
                        disabled={loading}
                        borderColor={justificationError ? 'red.300' : undefined}
                        value={justification}
                        onChange={(event) => {
                          setJustification(event.target.value);
                          setJustificationError(false);
                        }}
                      />
                      <Text>{`Caracteres restantes: ${
                        256 - justification.length
                      }`}</Text>
                      <Text textColor={'red.500'} hidden={!justificationError}>
                        Campo obrigatório
                      </Text>
                      <Button
                        onClick={async () => {
                          if (justification.length === 0) {
                            setJustificationError(true);
                            return;
                          }
                          await deny(solicitation.id, { justification });
                          handleOpenPopover(1);
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
      ) : (
        <Flex
          direction={'column'}
          justify={'flex-start'}
          align={'center'}
          h={'100%'}
          mt={'50px'}
          gap={'10px'}
        >
          <Heading color={'uspolis.blue'}>
            Nenhuma solicitação selecionada
          </Heading>
          <Text color={'uspolis.blue'} fontSize={'xl'}>
            Selecione uma solicitação na pilha ao lado para visualizar os
            detalhes.
          </Text>
        </Flex>
      )}
    </Card>
  );
}

export default SolicitationPanel;
