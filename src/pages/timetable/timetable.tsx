import {
  Button,
  Flex,
  Grid,
  GridItem,
  Skeleton,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import PageHeader from '../../components/common/PageHeader';
import { LuCalendarSync, LuUpload } from 'react-icons/lu';
import TimetableCrawlModal from './TimetableCrawlModal/TimetableCrawlModal.tsx';
import { TimetableCrawlForm } from './TimetableCrawlModal/TimetableCrawlModal.form.ts';
import TimetableCrawlResultModal from './TimetableCrawlResultModal/TimetableCrawlResultModal.tsx';
import { useEffect, useMemo, useState } from 'react';
import useClasses from '../../hooks/classes/useClasses.ts';
import ClassStack from './ClassStack/ClassStack.tsx';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import './styles.css';
import { TimetableEvent } from './timetable.interface.tsx';
import { ClassResponse } from '../../models/http/responses/class.response.models.ts';
import moment from 'moment';
import { classNumberFromClassCode } from '../../utils/classes/classes.formatter.ts';
import TimetableEventContent from './TimetableEvent/TimetableEvent.tsx';
import TimetableWelcome from './TimetableWelcome/TimetableWelcome.tsx';
import useUserSchedule from '../../hooks/userSchedules/useUserSchedules.ts';
import { UserScheduleCrawlResponse } from '../../models/http/responses/userSchedule.response.models.ts';
import { CreateUserSchedule } from '../../models/http/requests/userSchedule.request.models.ts';
import { CrawlStatus } from '../../utils/enums/crawlStatus.enum.ts';

function Timetable() {
  const [showWelcome, setShowWelcome] = useState(
    window.localStorage.getItem('timetableWelcomeSeen') !== 'true',
  );

  const {
    loading: loadingUserSchedule,
    userSchedule,
    crawlSchedule,
    createUserSchedule,
    updateUserSchedule,
    deleteUserSchedule,
  } = useUserSchedule();

  const { loading: loadingClasses, classes, getAllClasses } = useClasses(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenResult,
    onClose: onCloseResult,
    onOpen: onOpenResult,
  } = useDisclosure();
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlResult, setCrawlResult] = useState<
    UserScheduleCrawlResponse | undefined
  >(undefined);
  const [events, setEvents] = useState<TimetableEvent[]>([]);
  const [eventsSet, setEventsSet] = useState(new Set<string>());
  const [selectedClassesIds, setSelectedClassesIds] = useState<Set<number>>(
    new Set(),
  );
  const [selectedSubjectsIds, setSelectedSubjectsIds] = useState<Set<number>>(
    new Set(),
  );
  const [hasChanges, setHasChanges] = useState(false);
  const startWeekDay = useMemo(() => moment().startOf('week'), []);

  async function handleCrawlSubmit(data: TimetableCrawlForm) {
    setIsCrawling(true);
    onOpenResult();
    const result = await crawlSchedule({
      n_usp: data.nusp,
      password: data.password,
    });
    setCrawlResult(result);
    if (result && result.user_schedule && result.status != CrawlStatus.ERROR) {
      loadUserScheduleInCalendar(result.user_schedule);
    }
    setIsCrawling(false);
  }

  function loadUserScheduleInCalendar(data = userSchedule) {
    if (!data || loadingClasses) {
      return;
    }

    const scheduleEvents: TimetableEvent[] = [];
    const scheduleEventsSet = new Set<string>();

    const classesIds: number[] = [];
    const subjectsIds: number[] = [];
    data.entries.forEach((entry) => {
      const schedule = entry.schedule_data;
      if (!schedule.class_code || !schedule.subject_code) {
        return;
      }
      const entryClass = classes.find((c) => c.id === schedule.class_id);
      if (!entryClass) {
        return;
      }
      classesIds.push(entryClass.id);
      subjectsIds.push(entryClass.subject_id);

      const id = `${schedule.id}`;
      scheduleEvents.push({
        id: id,
        title: `${schedule.subject_code} - ${classNumberFromClassCode(schedule.class_code)}`,
        start: `${startWeekDay
          .clone()
          .add((schedule.week_day || 0) + 1, 'days')
          .format('YYYY-MM-DD')}T${schedule.start_time}`,
        end: `${startWeekDay
          .clone()
          .add((schedule.week_day || 0) + 1, 'days')
          .format('YYYY-MM-DD')}T${schedule.end_time}`,
        extendedProps: {
          scheduleData: schedule,
          subjectCode: schedule.subject_code,
          classId: schedule.class_id,
        },
      });
      scheduleEventsSet.add(id);
    });

    setEvents(scheduleEvents);
    setEventsSet(scheduleEventsSet);
    setSelectedClassesIds(new Set(classesIds));
    setSelectedSubjectsIds(new Set(subjectsIds));
  }

  function handleClassClick(cls: ClassResponse) {
    if (selectedSubjectsIds.has(cls.subject_id)) {
      return;
    }

    setSelectedClassesIds((prev) => new Set(prev.add(cls.id)));
    setSelectedSubjectsIds((prev) => new Set(prev.add(cls.subject_id)));

    const schedules = cls.schedules.filter((s) => !eventsSet.has(`${s.id}`));
    const classEvents = schedules.map((s) => ({
      id: `${s.id}`,
      title: `${cls.subject_code} - ${classNumberFromClassCode(cls.code)}`,
      start: `${startWeekDay
        .clone()
        .add((s.week_day || 0) + 1, 'days')
        .format('YYYY-MM-DD')}T${s.start_time}`,
      end: `${startWeekDay
        .clone()
        .add((s.week_day || 0) + 1, 'days')
        .format('YYYY-MM-DD')}T${s.end_time}`,
      //   startTime: `${s.start_time}`,
      //   endTime: `${s.end_time}`,
      extendedProps: {
        scheduleData: s,
        classData: cls,
      },
    }));

    setEvents([...events, ...classEvents]);
    setEventsSet(new Set([...eventsSet, ...classEvents.map((e) => e.id)]));
  }

  function handleRemoveClass(classId: number) {
    const selectedClass = classes.find((c) => c.id === classId);
    if (!selectedClass) {
      return;
    }

    setSelectedClassesIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(classId);
      return newSet;
    });
    setSelectedSubjectsIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(selectedClass.subject_id);
      return newSet;
    });
    const schedules = selectedClass.schedules.map((s) => `${s.id}`);
    const newEvents = events.filter((e) => !schedules.includes(e.id));
    const newEventsSet = new Set(newEvents.map((e) => e.id));

    setEvents(newEvents);
    setEventsSet(newEventsSet);
  }

  function handleManualClick() {
    window.localStorage.setItem('timetableWelcomeSeen', 'true');
    setShowWelcome(false);
  }

  function checkHasChanges() {
    if (!userSchedule) {
      setHasChanges(events.length > 0);
      return;
    }
    const currentScheduleIds = new Set(
      userSchedule.entries.map((e) => e.schedule_id),
    );
    const currentSelectedIds = new Set(
      events
        .map((e) => Number(e.id))
        .filter((id): id is number => id !== undefined),
    );

    if (currentScheduleIds.size !== currentSelectedIds.size) {
      setHasChanges(true);
      return;
    }

    for (const id of currentScheduleIds) {
      if (!currentSelectedIds.has(id)) {
        setHasChanges(true);
        return;
      }
    }
    setHasChanges(false);
  }

  async function handleSaveChanges() {
    const data: CreateUserSchedule = {
      schedule_ids: Array.from(eventsSet).map((id) => Number(id)),
    };
    if (!userSchedule || userSchedule.id === undefined) {
      await createUserSchedule(data);
      return;
    }
    if (data.schedule_ids.length === 0) {
      await deleteUserSchedule(userSchedule.id);
      return;
    }
    await updateUserSchedule(userSchedule.id, data);
  }

  function getSaveChangesButtonText() {
    if (!userSchedule || userSchedule.id === undefined) {
      return 'Criar grade horária';
    }
    if (eventsSet.size === 0) {
      return 'Remover grade horária';
    }
    return 'Confirmar mudanças';
  }

  useEffect(() => {
    getAllClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loadingUserSchedule && !loadingClasses) {
      loadUserScheduleInCalendar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingClasses, loadingUserSchedule]);

  useEffect(() => {
    checkHasChanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, userSchedule]);

  return (
    <PageContent>
      <TimetableCrawlModal
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleCrawlSubmit}
      />
      <TimetableCrawlResultModal
        isOpen={isOpenResult}
        onClose={onCloseResult}
        crawling={isCrawling}
        result={crawlResult}
      />

      {showWelcome && (
        <TimetableWelcome
          handleImportClick={onOpen}
          handleManualClick={handleManualClick}
        />
      )}

      {!showWelcome && (
        <>
          <Flex align={'center'}>
            <PageHeader
              title='Minha Grade Horária'
              subtitle='Gerencie sua grade horária ou importe do JupiterWeb'
              leftIcon={<LuCalendarSync size={'32px'} />}
              fontSize='2xl'
              subtitleFontSize='md'
            />
            <Spacer />
            <Button
              leftIcon={<LuUpload />}
              onClick={async () => {
                await handleSaveChanges();
              }}
              hidden={!hasChanges}
              disabled={loadingUserSchedule || loadingClasses || isCrawling}
              mr={'5px'}
            >
              {getSaveChangesButtonText()}
            </Button>
            <Button
              leftIcon={<LuCalendarSync />}
              onClick={() => onOpen()}
              disabled={isCrawling || loadingUserSchedule || loadingClasses}
            >
              {isCrawling ? 'Sincronizando...' : 'Sincronizar pelo JupiterWeb'}
            </Button>
          </Flex>
          <Grid
            w={'100%'}
            h={'80vh'}
            maxH={'80vh'}
            templateColumns='repeat(5, 1fr)'
            gap={'15px'}
            mt={'10px'}
            border={'1px solid black'}
            borderRadius={'10px'}
          >
            <GridItem colSpan={1} maxH={'80vh'}>
              <ClassStack
                classes={classes}
                loading={loadingClasses}
                onClassClick={handleClassClick}
                selectedSubjectsIds={selectedSubjectsIds}
                selectedClassesIds={selectedClassesIds}
              />
            </GridItem>
            <GridItem colSpan={4} maxH={'80vh'}>
              <Skeleton
                isLoaded={!loadingUserSchedule && !loadingClasses}
                w={'full'}
                h={'full'}
              >
                <Flex w={'full'} h={'full'} overflowY={'auto'}>
                  <FullCalendar
                    plugins={[timeGridPlugin]}
                    initialView='timeGridWeek'
                    initialDate={undefined}
                    locale={'pt-br'}
                    height={'auto'}
                    firstDay={1}
                    slotMinTime='07:00'
                    views={{
                      timeGridWeek: {
                        slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
                        eventMaxStack: 1,
                      },
                    }}
                    dayHeaderFormat={{ weekday: 'long' }}
                    eventColor='#408080'
                    eventContent={(eventInfo) =>
                      TimetableEventContent(eventInfo, handleRemoveClass)
                    }
                    displayEventTime={false}
                    displayEventEnd={false}
                    headerToolbar={false}
                    allDaySlot={false}
                    events={events}
                    hiddenDays={[0]}
                  />
                </Flex>
              </Skeleton>
            </GridItem>
          </Grid>
        </>
      )}
    </PageContent>
  );
}

export default Timetable;
