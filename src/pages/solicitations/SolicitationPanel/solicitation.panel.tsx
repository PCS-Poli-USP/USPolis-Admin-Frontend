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
import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  ApproveSolicitation,
  DenySolicitation,
} from '../../../models/http/requests/solicitation.request.models';
import {
  ClassroomFullResponse,
  ClassroomWithConflictCount,
} from '../../../models/http/responses/classroom.response.models';
import { ReservationType } from '../../../utils/enums/reservations.enum';
import useClassrooms from '../../../hooks/classrooms/useClassrooms';
import ClassroomTimeGrid from '../../../components/common/ClassroomTimeGrid/classroom.time.grid';
import { Recurrence } from '../../../utils/enums/recurrence.enum';
import { ReservationStatus } from '../../../utils/enums/reservations.enum';
import TooltipSelect from '../../../components/common/TooltipSelect';
import { ScheduleResponse } from '../../../models/http/responses/schedule.response.models';
import { generateRecurrenceDates } from '../../../utils/common/common.generator';

interface SolicitationPanelProps {
  solicitation?: SolicitationResponse;
  loading: boolean;
  approve: (id: number, data: ApproveSolicitation) => Promise<void>;
  deny: (id: number, data: DenySolicitation) => Promise<void>;
  handleClose: () => void;
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
    getClassroomsWithConflict,
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
    const closed =
      solicitation && solicitation.status !== ReservationStatus.PENDING;
    if (solicitation && !closed && !isLoadingWithConflict) {
      if (start && end && validateTime(start, end)) {
        try {
          setIsLoadingWithConflict(true);
          const isCustom =
            solicitation.reservation.schedule.recurrence === Recurrence.CUSTOM;
          const result = await getClassroomsWithConflict(
            {
              start_time: start,
              end_time: end,
              recurrence: solicitation.reservation.schedule.recurrence,
              dates: isCustom
                ? getScheduleDates(solicitation.reservation.schedule)
                : [],
              times: isCustom
                ? getScheduleTimes(solicitation.reservation.schedule)
                : [],
              start_date: solicitation.reservation.schedule.start_date,
              end_date: solicitation.reservation.schedule.end_date,
              week_day: solicitation.reservation.schedule.week_day,
              month_week: solicitation.reservation.schedule.month_week,
            },
            solicitation?.building_id,
          );

          setClassrooms(result);
          if (solicitation.reservation.classroom_id && !classroom) {
            setClassroom(
              result.find(
                (room) => room.id === solicitation.reservation.classroom_id,
              ),
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
    const closed =
      solicitation && solicitation.status !== ReservationStatus.PENDING;
    if (solicitation && !closed) {
      if (classroom) {
        id = classroom.id;
      }
      if (solicitation.reservation.classroom_id && !classroom) {
        id = solicitation.reservation.classroom_id;
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
      if (
        solicitation.reservation.schedule.start_time &&
        solicitation.reservation.schedule.end_time
      ) {
        setStart(solicitation.reservation.schedule.start_time);
        setEnd(solicitation.reservation.schedule.end_time);
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
    if (solicitation && solicitation.reservation.classroom_id) {
      if (classrooms) {
        setClassroom(
          classrooms.find(
            (val) => val.id === solicitation.reservation.classroom_id,
          ),
        );
      }
    }
  }, [classrooms, solicitation]);

  function getScheduleDates(schedule: ScheduleResponse) {
    if (schedule.recurrence === Recurrence.CUSTOM) {
      return schedule.occurrences
        ? schedule.occurrences.map((occ) => occ.date)
        : [];
    }
    return generateRecurrenceDates(
      schedule.start_date,
      schedule.end_date,
      schedule.recurrence,
      schedule.week_day,
      schedule.month_week,
    );
  }

  function getScheduleTimes(schedule: ScheduleResponse): [string, string][] {
    if (schedule.recurrence === Recurrence.CUSTOM) {
      return schedule.occurrences
        ? schedule.occurrences.map((occ) => [occ.start_time, occ.end_time])
        : [];
    }
    const times: [string, string][] = [];
    const dates = generateRecurrenceDates(
      schedule.start_date,
      schedule.end_date,
      schedule.recurrence,
      schedule.week_day,
      schedule.month_week,
    );
    dates.forEach(() => {
      times.push([schedule.start_time, schedule.end_time]);
    });
    return times;
  }

  return (
    <Card
      w={'100%'}
      h={'auto'}
      minH={'100%'}
      border={'2px solid lightgray'}
      p={'4px'}
      zIndex={2}
      backgroundColor={'uspolis.white'}
    >
      {solicitation ? (
        <>
          <CardHeader mb={-5}>
            <HStack>
              <Heading size={'lg'}>{`Reserva de Sala - ${
                solicitation.reservation.classroom_name
                  ? solicitation.reservation.classroom_name
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
              textColor={ReservationStatus.getColor(solicitation.status)}
            >
              {ReservationStatus.translate(solicitation.status)}
            </Heading>
          </CardHeader>

          <CardBody>
            <ClassroomTimeGrid
              isOpen={isOpen}
              onClose={onClose}
              classroom={classroomFull}
              preview={{
                title: solicitation.reservation.title,
                dates: solicitation.reservation.schedule.occurrences
                  ? solicitation.reservation.schedule.occurrences.map(
                      (occ) => occ.date,
                    )
                  : getScheduleDates(solicitation.reservation.schedule),
                start_time: start,
                end_time: end,
                start_times: solicitation.reservation.schedule.occurrences
                  ? solicitation.reservation.schedule.occurrences.map(
                      (occ) => occ.start_time,
                    )
                  : getScheduleDates(solicitation.reservation.schedule).map(
                      () => start.substring(0, 5),
                    ),
                end_times: solicitation.reservation.schedule.occurrences
                  ? solicitation.reservation.schedule.occurrences.map(
                      (occ) => occ.end_time,
                    )
                  : getScheduleDates(solicitation.reservation.schedule).map(
                      () => end.substring(0, 5),
                    ),
              }}
              scheduleDetails={{
                recurrence: solicitation.reservation.schedule.recurrence,
                week_day: solicitation.reservation.schedule.week_day,
                month_week: solicitation.reservation.schedule.month_week,
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
                  Título: {`${solicitation.reservation.title}`}
                </Text>
              </Box>
              <Box>
                <Heading size='sm' textTransform='uppercase'>
                  {`Motivo - ${ReservationType.translate(
                    solicitation.reservation.type,
                  )}`}
                </Heading>
                <Text pt='2' fontSize='md'>
                  {solicitation.reservation.reason
                    ? solicitation.reservation.reason
                    : 'Descrição não informada.'}
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
              <Box>
                <Heading size='sm' textTransform='uppercase'>
                  Local, Horário e Datas
                </Heading>
                <Text pt='2' fontSize='md'>
                  {`Local: ${solicitation.building}, sala ${
                    solicitation.reservation.schedule.classroom
                      ? solicitation.reservation.schedule.classroom
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
                  } - `}
                  {`Fim: ${
                    solicitation.reservation.schedule.end_time
                      ? moment(
                          solicitation.reservation.schedule.end_time,
                          'HH:mm',
                        ).format('HH:mm')
                      : 'NÃO ESPECIFICADO'
                  }`}
                  <br />
                  {`Recorrência: ${Recurrence.translate(
                    solicitation.reservation.schedule.recurrence,
                  )}`}
                  <br />
                  {`Dias: ${getScheduleDates(solicitation.reservation.schedule)
                    .map((date) => moment(date).format('DD/MM/YYYY'))
                    .join(', ')}`}
                  <br />
                </Text>
                <HStack
                  align={'center'}
                  alignContent={'center'}
                  alignItems={'center'}
                  verticalAlign={'center'}
                >
                  {solicitation.reservation.classroom_id && (
                    <Button
                      mt={2}
                      size={'sm'}
                      isDisabled={
                        solicitation.required_classroom ||
                        solicitation.status !== ReservationStatus.PENDING
                      }
                      fontWeight={'bold'}
                      textColor={editingClassroom ? 'red.500' : 'yellow.500'}
                      onClick={() => {
                        if (editingClassroom) {
                          setClassroom(
                            classrooms.find(
                              (val) =>
                                val.id ===
                                solicitation.reservation.classroom_id,
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

              {/* Classroom Input If solicitation haven't a classroom */}
              {(solicitation.status === ReservationStatus.PENDING &&
                !solicitation.reservation.classroom_name) ||
              editingClassroom ? (
                <Box>
                  <Heading mb={2} size={'sm'} textTransform='uppercase'>
                    Sala
                  </Heading>
                  <HStack w={'full'}>
                    <Box w={'250px'}>
                      <TooltipSelect
                        isClearable
                        isLoading={loadingClassrooms}
                        value={
                          classroom
                            ? {
                                label: classroom.conflicts
                                  ? `⚠️ ${classroom.name} [${classroom.capacity}] (${classroom.conflicts} conflitos)`
                                  : `${classroom.name} [${classroom.capacity}]`,
                                value: classroom.id,
                                tooltip: classroom.observation,
                              }
                            : null
                        }
                        placeholder='Selecione uma sala'
                        isDisabled={
                          (!solicitation.reservation.schedule.start_time &&
                            !start) ||
                          (!solicitation.reservation.schedule.end_time &&
                            !end) ||
                          loadingClassrooms
                        }
                        options={classrooms.map((val) => ({
                          label: val.conflicts
                            ? `⚠️ ${val.name} [${val.capacity}] (${val.conflicts} conflitos)`
                            : `${val.name} [${val.capacity}]`,
                          value: val.id,
                          tooltip: val.observation,
                        }))}
                        onChange={(newValue) => {
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
              {solicitation.status === ReservationStatus.PENDING &&
              solicitation.reservation.classroom_name &&
              solicitation.reservation.schedule.start_time &&
              solicitation.reservation.schedule.end_time ? (
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
                      solicitation.status !== ReservationStatus.PENDING ||
                      (!solicitation.reservation.classroom_name &&
                        !classroom) ||
                      (!solicitation.reservation.schedule.start_time &&
                        !start) ||
                      (!solicitation.reservation.schedule.end_time && !end) ||
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
                        isLoading={loading || loadingClassrooms}
                        onClick={async () => {
                          if (
                            !solicitation.reservation.classroom_id &&
                            !classroom
                          )
                            return;

                          await approve(solicitation.id, {
                            classroom_id: classroom
                              ? classroom.id
                              : solicitation.reservation.classroom_id
                                ? solicitation.reservation.classroom_id
                                : 0,
                            classroom_name: classroom
                              ? classroom.name
                              : solicitation.reservation.classroom_name
                                ? solicitation.reservation.classroom_name
                                : 'Sem nome',
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
                    isDisabled={
                      solicitation.status !== ReservationStatus.PENDING
                    }
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
          <Heading color={'uspolis.text'}>
            Nenhuma solicitação selecionada
          </Heading>
          <Text color={'uspolis.text'} fontSize={'xl'}>
            Selecione uma solicitação na pilha ao lado para visualizar os
            detalhes.
          </Text>
        </Flex>
      )}
    </Card>
  );
}

export default SolicitationPanel;
