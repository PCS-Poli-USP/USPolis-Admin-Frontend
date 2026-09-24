import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import {
  ApproveSolicitation,
  DenySolicitation,
} from '../../../models/http/requests/solicitation.request.models';
import {
  ClassroomFullResponse,
  ClassroomWithConflictCount,
} from '../../../models/http/responses/classroom.response.models';
import { ReservationStatus, ReservationType } from '../../../utils/enums/reservations.enum';
import useClassrooms from '../../../hooks/classrooms/useClassrooms';
import ClassroomTimeGrid from '../../../components/common/ClassroomTimeGrid/classroom.time.grid';
import { Recurrence } from '../../../utils/enums/recurrence.enum';
import TooltipSelect from '../../../components/common/TooltipSelect';
import { ScheduleResponse } from '../../../models/http/responses/schedule.response.models';
import { generateRecurrenceDates } from '../../../utils/common/common.generator';
import useBuildings from '../../../hooks/useBuildings';
import useSubjects from '../../../hooks/useSubjetcts';
import ReservationModal from '../../reservations/ReservationModal/reservation.modal';
import { appContext } from '../../../context/AppContext';
import { getSolicitationAdminTimeline } from '../../../utils/solicitations/solicitation.formatter';
import SolicitationConfirmSheet from './SolicitationConfirmSheet/solicitation.confirm.sheet';

interface SolicitationPanelProps {
  solicitation?: SolicitationResponse;
  loading: boolean;
  approve: (id: number, data: ApproveSolicitation) => Promise<void>;
  deny: (id: number, data: DenySolicitation) => Promise<void>;
  handleClose: () => void;
  refetch: () => Promise<void>;
}

const TIMELINE_COLOR: Record<string, string> = {
  done: 'uspolis.blue',
  active: '#D69E2E',
  ok: '#38A169',
  bad: '#E53E3E',
  warn: '#DD6B20',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function SolicitationPanel({
  solicitation,
  loading,
  approve,
  deny,
  handleClose,
  refetch,
}: SolicitationPanelProps) {
  const { isMobile } = useContext(appContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenReservationModal,
    onClose: onCloseReservationModal,
    onOpen: onOpenReservationModal,
  } = useDisclosure();
  const {
    loading: loadingClassrooms,
    getClassroomsWithConflict,
    listOneFull,
  } = useClassrooms(false);
  const { loading: loadingAllClassrooms, classrooms: allClassrooms } =
    useClassrooms();
  const { buildings } = useBuildings();
  const { subjects, loading: loadingSubjects } = useSubjects();

  const [justification, setJustification] = useState('');
  const [justificationError, setJustificationError] = useState(false);
  const [confirmMode, setConfirmMode] = useState<'approve' | 'deny' | undefined>(
    undefined,
  );
  const [allDatesExpanded, setAllDatesExpanded] = useState(false);

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

  function handleEditClick() {
    if (!solicitation) return;
    onOpenReservationModal();
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
    setConfirmMode(undefined);
    setAllDatesExpanded(false);
    setJustification('');
    setJustificationError(false);
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

  async function handleConfirmAction() {
    if (!solicitation) return;
    if (confirmMode === 'deny') {
      if (justification.trim().length === 0) {
        setJustificationError(true);
        return;
      }
      await deny(solicitation.id, { justification });
    } else if (confirmMode === 'approve') {
      if (!solicitation.reservation.classroom_id && !classroom) return;
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
    }
    setConfirmMode(undefined);
  }

  const pending = solicitation?.status === ReservationStatus.PENDING;
  const origRoomName = solicitation?.reservation.classroom_name;
  const canChangeRoom =
    pending &&
    !!solicitation?.reservation.classroom_id &&
    !solicitation?.required_classroom;
  const showPicker =
    pending && (!solicitation?.reservation.classroom_id || editingClassroom);
  const approveDisabled =
    !solicitation ||
    solicitation.status !== ReservationStatus.PENDING ||
    (!solicitation.reservation.classroom_name && !classroom) ||
    (!solicitation.reservation.schedule.start_time && !start) ||
    (!solicitation.reservation.schedule.end_time && !end) ||
    !validateTime(start, end);

  let banner: { title: string; text: string; tone: 'warn' | 'error' } | null =
    null;
  if (pending) {
    if (!classroom && !solicitation?.reservation.classroom_id) {
      banner = {
        title: 'Sala não especificada',
        text: 'Selecione uma sala abaixo para poder aprovar esta solicitação.',
        tone: 'warn',
      };
    } else if (classroom && classroom.conflicts > 0) {
      banner = {
        title: `Conflito de horário na sala ${classroom.name}`,
        text: `Aprovar esta solicitação gerará ${classroom.conflicts} conflito${
          classroom.conflicts > 1 ? 's' : ''
        } com reservas ou aulas já alocadas.`,
        tone: 'error',
      };
    }
  }

  const scheduleDates = solicitation
    ? getScheduleDates(solicitation.reservation.schedule)
    : [];
  const visibleDates = allDatesExpanded ? scheduleDates : scheduleDates.slice(0, 8);

  const timeline = solicitation ? getSolicitationAdminTimeline(solicitation) : [];

  const chosenRoomName = classroom
    ? classroom.name
    : solicitation?.reservation.classroom_name;
  const summaryLine = solicitation
    ? `${solicitation.building} · ${
        chosenRoomName ? `Sala ${chosenRoomName}` : 'sala não especificada'
      } · ${start}–${end} · ${scheduleDates.length} data${scheduleDates.length > 1 ? 's' : ''}`
    : '';

  return (
    <>
      <ReservationModal
        onClose={() => {
          onCloseReservationModal();
        }}
        isOpen={isOpenReservationModal}
        isUpdate={true}
        isSolicitation={false}
        classrooms={allClassrooms}
        buildings={buildings}
        selectedReservation={solicitation?.reservation}
        refetch={refetch}
        subjects={subjects}
        loading={loadingSubjects || loadingAllClassrooms}
      />

      <Modal
        isOpen={!!solicitation}
        onClose={handleClose}
        size={isMobile ? 'full' : 'xl'}
        scrollBehavior={'inside'}
      >
        <ModalOverlay />
        <ModalContent maxW={{ base: 'full', md: '720px' }}>
          {solicitation && (
            <>
              <ModalHeader pb={'8px'}>
                <HStack spacing={'8px'} flexWrap={'wrap'} mb={'6px'}>
                  <Badge colorScheme={ReservationStatus.getColorScheme(solicitation.status)} borderRadius={'20px'} px={'8px'}>
                    {ReservationStatus.translate(solicitation.status)}
                  </Badge>
                  <Text fontSize={'13px'} color={'uspolis.textMuted'} fontWeight={'normal'}>
                    {`Reserva de Sala · ${ReservationType.translate(solicitation.reservation.type)} · #${solicitation.id}`}
                  </Text>
                </HStack>
                <Text fontSize={'22px'} fontWeight={'bold'} lineHeight={1.25}>
                  {solicitation.reservation.title}
                </Text>
              </ModalHeader>
              <ModalCloseButton onClick={handleClose} />

              <ModalBody>
                <VStack align={'stretch'} spacing={'20px'}>
                  {banner && (
                    <Box
                      p={'12px 14px'}
                      borderRadius={'8px'}
                      bg={banner.tone === 'error' ? 'red.50' : 'orange.50'}
                      color={banner.tone === 'error' ? 'red.700' : 'orange.700'}
                      fontSize={'14px'}
                      lineHeight={1.45}
                    >
                      <Text fontWeight={'bold'}>{banner.title}</Text>
                      <Text>{banner.text}</Text>
                    </Box>
                  )}

                  <VStack align={'stretch'} spacing={'10px'}>
                    <Text fontSize={'13px'} fontWeight={'bold'} letterSpacing={'0.04em'} textTransform={'uppercase'} color={'uspolis.textMuted'}>
                      Solicitante
                    </Text>
                    <HStack spacing={'12px'} flexWrap={'wrap'}>
                      <Flex w={'40px'} h={'40px'} borderRadius={'50%'} bg={'uspolis.lightBlue'} color={'uspolis.darkBlue'} align={'center'} justify={'center'} fontWeight={'bold'} flex={'none'}>
                        {getInitials(solicitation.user)}
                      </Flex>
                      <VStack align={'flex-start'} spacing={'2px'} flex={1} minW={'160px'}>
                        <Text fontWeight={'medium'}>{solicitation.user}</Text>
                        <Link href={`mailto:${solicitation.email}`} color={'uspolis.blue'} fontSize={'14px'} wordBreak={'break-all'}>
                          {solicitation.email}
                        </Link>
                      </VStack>
                      <Button
                        as={Link}
                        href={`mailto:${solicitation.email}?subject=${encodeURIComponent(
                          `Solicitação #${solicitation.id} – ${solicitation.reservation.title}`,
                        )}`}
                        size={'sm'}
                        variant={'outline'}
                        _hover={{ textDecoration: 'none' }}
                      >
                        Contatar
                      </Button>
                    </HStack>
                  </VStack>

                  <VStack align={'stretch'} spacing={'6px'}>
                    <Text fontSize={'13px'} fontWeight={'bold'} letterSpacing={'0.04em'} textTransform={'uppercase'} color={'uspolis.textMuted'}>
                      {`Motivo · ${ReservationType.translate(solicitation.reservation.type)}`}
                    </Text>
                    <Text fontSize={'15px'} lineHeight={1.55}>
                      {solicitation.reservation.reason || 'Descrição não informada.'}
                    </Text>
                  </VStack>

                  <Grid templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap={'1px'} bg={'uspolis.border'} border={'1px solid'} borderColor={'uspolis.border'} borderRadius={'10px'} overflow={'hidden'}>
                    <VStack align={'flex-start'} spacing={'4px'} bg={'uspolis.white'} p={'12px 14px'}>
                      <Text fontSize={'12px'} color={'uspolis.textMuted'}>Local</Text>
                      <Text fontSize={'15px'} fontWeight={'medium'}>
                        {`${solicitation.building} · `}
                        {origRoomName || <Text as={'span'} color={'uspolis.textMuted'} fontStyle={'italic'}>Sala não especificada</Text>}
                      </Text>
                      {solicitation.required_classroom && (
                        <Text fontSize={'13px'} color={'red.500'}>Obrigatoriamente essa sala</Text>
                      )}
                    </VStack>
                    <VStack align={'flex-start'} spacing={'4px'} bg={'uspolis.white'} p={'12px 14px'}>
                      <Text fontSize={'12px'} color={'uspolis.textMuted'}>Horário</Text>
                      <Text fontSize={'15px'} fontWeight={'medium'}>
                        {start && end ? `${start} – ${end}` : 'Não informado'}
                      </Text>
                      <Text fontSize={'13px'} color={'uspolis.textMuted'}>
                        {Recurrence.translate(solicitation.reservation.schedule.recurrence)}
                      </Text>
                    </VStack>
                    <VStack align={'flex-start'} spacing={'4px'} bg={'uspolis.white'} p={'12px 14px'}>
                      <Text fontSize={'12px'} color={'uspolis.textMuted'}>Requisitos</Text>
                      <Text fontSize={'15px'} fontWeight={'medium'}>
                        {`Capacidade para ${solicitation.capacity} pessoas`}
                      </Text>
                    </VStack>
                  </Grid>

                  {pending && (
                    <VStack align={'stretch'} spacing={'10px'}>
                      <HStack justify={'space-between'}>
                        <Text fontSize={'13px'} fontWeight={'bold'} letterSpacing={'0.04em'} textTransform={'uppercase'} color={'uspolis.textMuted'}>
                          Sala
                        </Text>
                        {canChangeRoom && (
                          <Button
                            size={'sm'}
                            variant={'ghost'}
                            colorScheme={editingClassroom ? 'red' : 'yellow'}
                            onClick={() => {
                              if (editingClassroom) {
                                setClassroom(
                                  classrooms.find(
                                    (val) => val.id === solicitation.reservation.classroom_id,
                                  ),
                                );
                              }
                              setEditingClassroom((prev) => !prev);
                            }}
                          >
                            {editingClassroom ? 'Cancelar' : 'Alterar sala'}
                          </Button>
                        )}
                      </HStack>

                      {showPicker && (
                        <Box w={'full'}>
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
                            isDisabled={!start || !end || loadingClassrooms}
                            options={classrooms.map((val) => ({
                              label: val.conflicts
                                ? `⚠️ ${val.name} [${val.capacity}] (${val.conflicts} conflitos)`
                                : `${val.name} [${val.capacity}]`,
                              value: val.id,
                              tooltip: val.observation,
                            }))}
                            onChange={(newValue) => {
                              if (newValue) {
                                setClassroom(classrooms.find((val) => val.id === newValue.value));
                              } else setClassroom(undefined);
                            }}
                          />
                        </Box>
                      )}

                      <HStack spacing={'12px'} flexWrap={'wrap'}>
                        <Button
                          variant={'outline'}
                          isDisabled={!classroom}
                          isLoading={loadingClassrooms}
                          onClick={() => onOpen()}
                        >
                          Visualizar disponibilidade
                        </Button>
                        <Text fontSize={'14px'} color={classroom && classroom.conflicts > 0 ? 'red.500' : 'green.500'}>
                          {!classroom
                            ? ''
                            : classroom.conflicts > 0
                              ? `Essa sala gerará ${classroom.conflicts} conflito(s).`
                              : 'Esse horário gerará 0 conflito(s).'}
                        </Text>
                      </HStack>
                    </VStack>
                  )}

                  <VStack align={'stretch'} spacing={'8px'}>
                    <HStack justify={'space-between'}>
                      <Text fontSize={'13px'} fontWeight={'bold'} letterSpacing={'0.04em'} textTransform={'uppercase'} color={'uspolis.textMuted'}>
                        {`Datas (${scheduleDates.length})`}
                      </Text>
                      {scheduleDates.length > 8 && (
                        <Button size={'sm'} variant={'link'} color={'uspolis.blue'} onClick={() => setAllDatesExpanded((prev) => !prev)}>
                          {allDatesExpanded ? 'Mostrar menos' : 'Ver todas'}
                        </Button>
                      )}
                    </HStack>
                    <HStack spacing={'6px'} flexWrap={'wrap'} rowGap={'6px'}>
                      {visibleDates.map((date) => (
                        <VStack key={date} spacing={0} minW={'56px'} p={'6px 8px'} borderRadius={'6px'} bg={'uspolis.surfaceSubtle'} border={'1px solid'} borderColor={'uspolis.border'} lineHeight={1.2}>
                          <Text fontSize={'11px'} textTransform={'uppercase'} color={'uspolis.textMuted'}>
                            {moment(date).format('ddd')}
                          </Text>
                          <Text fontSize={'15px'} fontWeight={'bold'}>
                            {moment(date).format('DD/MM')}
                          </Text>
                        </VStack>
                      ))}
                    </HStack>
                  </VStack>

                  <VStack align={'stretch'} spacing={'12px'}>
                    <Text fontSize={'13px'} fontWeight={'bold'} letterSpacing={'0.04em'} textTransform={'uppercase'} color={'uspolis.textMuted'}>
                      Histórico
                    </Text>
                    <VStack align={'stretch'} spacing={0}>
                      {timeline.map((step, index) => (
                        <HStack key={index} align={'flex-start'} spacing={'12px'}>
                          <VStack spacing={0} align={'center'} w={'12px'} flex={'none'}>
                            <Box w={'12px'} h={'12px'} borderRadius={'50%'} bg={TIMELINE_COLOR[step.state]} flex={'none'} />
                            {index < timeline.length - 1 && (
                              <Box flex={1} w={'2px'} minH={'14px'} bg={'uspolis.border'} />
                            )}
                          </VStack>
                          <VStack align={'flex-start'} spacing={'2px'} pb={'14px'} mt={'-3px'}>
                            <Text fontSize={'15px'} fontWeight={'medium'}>{step.label}</Text>
                            <Text fontSize={'13px'} color={'uspolis.textMuted'}>{step.sub}</Text>
                          </VStack>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </VStack>
              </ModalBody>

              <ModalFooter borderTop={'1px solid'} borderColor={'uspolis.border'} gap={'8px'} flexWrap={'wrap'}>
                {pending ? (
                  <>
                    <Button
                      colorScheme='yellow'
                      isDisabled={loading || loadingSubjects || loadingAllClassrooms}
                      onClick={handleEditClick}
                    >
                      Editar
                    </Button>
                    <Box flex={1} />
                    <Button
                      colorScheme='red'
                      variant={'outline'}
                      onClick={() => {
                        setJustification('');
                        setJustificationError(false);
                        setConfirmMode('deny');
                      }}
                    >
                      Negar
                    </Button>
                    <Button
                      colorScheme='green'
                      isDisabled={approveDisabled}
                      isLoading={loading || loadingClassrooms}
                      onClick={() => setConfirmMode('approve')}
                    >
                      Aprovar
                    </Button>
                  </>
                ) : (
                  <>
                    <Box flex={1} />
                    <Button onClick={handleClose}>Fechar</Button>
                  </>
                )}
              </ModalFooter>

              <ClassroomTimeGrid
                isOpen={isOpen}
                onClose={onClose}
                classroom={classroomFull}
                excludeScheduleId={solicitation.reservation.schedule.id}
                preview={{
                  title: solicitation.reservation.title,
                  dates: solicitation.reservation.schedule.occurrences
                    ? solicitation.reservation.schedule.occurrences.map((occ) => occ.date)
                    : scheduleDates,
                  start_time: start,
                  end_time: end,
                  start_times: solicitation.reservation.schedule.occurrences
                    ? solicitation.reservation.schedule.occurrences.map((occ) => occ.start_time)
                    : scheduleDates.map(() => start.substring(0, 5)),
                  end_times: solicitation.reservation.schedule.occurrences
                    ? solicitation.reservation.schedule.occurrences.map((occ) => occ.end_time)
                    : scheduleDates.map(() => end.substring(0, 5)),
                }}
                scheduleDetails={{
                  recurrence: solicitation.reservation.schedule.recurrence,
                  week_day: solicitation.reservation.schedule.week_day,
                  month_week: solicitation.reservation.schedule.month_week,
                }}
              />

              <SolicitationConfirmSheet
                isOpen={confirmMode !== undefined}
                mode={confirmMode || 'approve'}
                title={solicitation.reservation.title}
                summaryLine={summaryLine}
                justification={justification}
                onJustificationChange={(value) => {
                  setJustification(value);
                  setJustificationError(false);
                }}
                justificationError={justificationError}
                remaining={256 - justification.length}
                isLoading={loading}
                onCancel={() => setConfirmMode(undefined)}
                onConfirm={handleConfirmAction}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default SolicitationPanel;
