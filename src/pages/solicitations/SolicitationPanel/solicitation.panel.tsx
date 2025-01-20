import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
  // Select,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import Select from 'react-select';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  ClassroomSolicitationAprove,
  ClassroomSolicitationDeny,
} from 'models/http/requests/classroomSolicitation.request.models';
import {
  ClassroomFullResponse,
  ClassroomWithConflictCount,
} from 'models/http/responses/classroom.response.models';
import { ReservationType } from 'utils/enums/reservations.enum';
import useClassrooms from 'hooks/useClassrooms';
import ClassroomTimeGrid from 'components/common/ClassroomTimeGrid/classsroom.time.grid';

type OptionType = { value: number; label: string };

interface SolicitationPanelProps {
  solicitation?: ClassroomSolicitationResponse;
  loading: boolean;
  approve: (id: number, data: ClassroomSolicitationAprove) => void;
  deny: (id: number, data: ClassroomSolicitationDeny) => void;
  handleClose: () => void;
  reset: () => void;
}

function SolicitationPanel({
  solicitation,
  loading,
  approve,
  deny,
  handleClose,
  reset,
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

  const [classrooms, setClassrooms] = useState<ClassroomWithConflictCount[]>(
    [],
  );
  const [classroom, setClassroom] = useState<
    ClassroomWithConflictCount | undefined
  >(undefined);
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

  // Set start and end time from solicitation
  useEffect(() => {
    if (solicitation?.start_time && solicitation.end_time) {
      setStart(solicitation.start_time);
      setEnd(solicitation.end_time);
    }
  }, [solicitation?.start_time, solicitation?.end_time]);

  // Fetch classrooms with conflicts count from time and dates
  useEffect(() => {
    const fetchClassrooms = async () => {
      if (solicitation && !solicitation.closed) {
        if (start && end && validateTime(start, end)) {
          const result = await getClassroomsWithConflictFromTime(
            { start_time: start, end_time: end, dates: solicitation.dates },
            solicitation?.building_id,
          );
          setClassrooms(result);
        }
      }
    };
    fetchClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solicitation, end, start]);

  // Fetch selected classroom from solicitation
  useEffect(() => {
    if (solicitation?.classroom_id && classrooms.length > 0) {
      setClassroom(
        classrooms.find((room) => room.id === solicitation.classroom_id),
      );
    }
  }, [solicitation, classrooms]);

  // Fetch classroom occurrences from selected classroom
  useEffect(() => {
    const fetchClassroomOccurrences = async () => {
      if (solicitation && !solicitation.closed) {
        if (classroom) {
          const result = await listOneFull(classroom.id);
          setClassroomFull(result);
        }
        if (solicitation.classroom_id && !classroom) {
          const result = await listOneFull(solicitation.classroom_id);
          setClassroomFull(result);
        }
      }
    };
    fetchClassroomOccurrences();
  }, [listOneFull, classroom, solicitation]);

  // Need when change between soliciations (the conclit count is not updated)
  useEffect(() => {
    if (classrooms && classroom) {
      setClassroom(classrooms.find((val) => val.id === classroom.id));
    }
  }, [classroom, classrooms]);

  useEffect(() => {
    setEditingClassroom(false);
  }, []);

  return (
    <Card
      w={'100%'}
      border={'2px solid lightgray'}
      hidden={!solicitation}
      p={'4px'}
    >
      {!!solicitation ? (
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
            />
            <Stack divider={<StackDivider />} spacing='4'>
              <Box>
                <Heading size='sm' textTransform='uppercase'>
                  Solicitante
                </Heading>
                <Text pt='2' fontSize='md'>
                  {`${solicitation.user} - ${solicitation.email}`}
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
                      isDisabled={solicitation.required_classroom}
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
                        onChange={(newValue: OptionType) => {
                          setClassroom(
                            classrooms.find(
                              (val) => val.id === newValue?.value,
                            ),
                          );
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
                        onClick={() => {
                          if (justification.length === 0) {
                            setJustificationError(true);
                            return;
                          }
                          deny(solicitation.id, { justification });
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
                        onClick={() => {
                          if (!solicitation.classroom_id && !classroom) return;

                          approve(solicitation.id, {
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
            </HStack>
          </CardFooter>
        </>
      ) : undefined}
    </Card>
  );
}

export default SolicitationPanel;
