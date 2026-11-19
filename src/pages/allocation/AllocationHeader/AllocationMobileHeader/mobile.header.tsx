
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, LockIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdCalendarToday,
  MdFileDownload,
  MdFilterList,
  MdShare,
} from 'react-icons/md';
import { TbReportAnalytics } from 'react-icons/tb';
import { FaHandPointer } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import { Share } from '@capacitor/share';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Calendar } from '@capacitor/calendar';
import { appContext } from '../../../../context/AppContext';
import { AllocationHeaderProps } from '../index';
import HeaderFilter from '../HeaderFilter/header.filter';
import ClassesPDFModal from '../ClassesPDFModal';
import ClassroomPDFModal from '../ClassroomCalendarPDF';
import SubjectReportModal from '../SubjectReportModal';
import EmptyClassroomsReportModal from '../EmptyClassroomsrReportModal';
 
// Mude para true só em desenvolvimento para exibir as ações de teste
const SHOW_DEV_TOOLS = false;
 
/* ────────────────────────── helpers de data ────────────────────────── */
const DAY_MIN = 7 * 60; // início da linha do tempo (07:00)
const DAY_MAX = 23 * 60; // fim da linha do tempo (23:00)
const HOUR_H = 56; // altura de 1h na linha do tempo (px)
const GUTTER = 52; // coluna das horas (px)
 
const pad = (n: number) => String(n).padStart(2, '0');
const hm = (m: number) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;
const toMin = (t: string) => {
  const [h, m] = String(t).split(':');
  return Number(h) * 60 + Number(m || 0);
};
// "2026-11-19" vira data local (new Date("2026-11-19") seria UTC e voltaria 1 dia no Brasil)
const parseDate = (v: any): Date => {
  if (v instanceof Date) return v;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v));
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(v);
};
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const sameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
 
/* ────────────────────────── helpers de filtro ────────────────────────── */
const norm = (s: unknown) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
const toStr = (v: any) =>
  v && typeof v === 'object' ? v.label ?? v.value ?? v.title ?? v.id ?? '' : v;
const matches = (filter: unknown, ...fields: unknown[]) => {
  const active = (Array.isArray(filter) ? filter : [filter])
    .map((f) => norm(toStr(f)))
    .filter(Boolean);
  if (!active.length) return true;
  return active.some((f) => fields.some((x) => norm(x).includes(f)));
};
const countActive = (v: unknown) =>
  Array.isArray(v) ? (v.length ? 1 : 0) : norm(toStr(v)).trim() ? 1 : 0;
 
const hueOf = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
};
 
/* ────────────────────────── modelo do calendário ────────────────────────── */
type Item = {
  id: string;
  eventId: string;
  title: string;
  sub: string;
  s: number;
  e: number;
  roomId: string;
  room: string;
  building: string;
  hue: number;
};
type Room = { id: string; name: string; building: string };
 
/**
 * ADAPTER: ocorrência do evento em um dia.
 * Aceita eventos no formato FullCalendar: únicos (start/end) ou
 * recorrentes (daysOfWeek + startTime/endTime + startRecur/endRecur).
 * Se o seu formato for diferente, ajuste só esta função.
 */
const occurrence = (ev: any, day: Date): { s: number; e: number } | null => {
  if (ev.daysOfWeek) {
    if (!ev.daysOfWeek.map(Number).includes(day.getDay())) return null;
    if (ev.startRecur && day < startOfDay(parseDate(ev.startRecur))) return null;
    if (ev.endRecur && day >= startOfDay(parseDate(ev.endRecur))) return null;
    return { s: toMin(ev.startTime), e: toMin(ev.endTime) };
  }
  if (!ev.start) return null;
  const s = parseDate(ev.start);
  if (!sameDay(s, day)) return null;
  const e = parseDate(ev.end ?? ev.start);
  return {
    s: s.getHours() * 60 + s.getMinutes(),
    e: sameDay(e, day) ? e.getHours() * 60 + e.getMinutes() : 24 * 60,
  };
};
 
// Posiciona eventos sobrepostos lado a lado (como a visão "Dia" do Google Agenda)
const layoutLanes = (list: Item[]) => {
  const out: { it: Item; lane: number; lanes: number }[] = [];
  let cluster: typeof out = [];
  let ends: number[] = [];
  let clusterEnd = 0;
  const flush = () => {
    cluster.forEach((c) => (c.lanes = ends.length));
    out.push(...cluster);
    cluster = [];
    ends = [];
    clusterEnd = 0;
  };
  list.forEach((it) => {
    if (cluster.length && it.s >= clusterEnd) flush();
    let lane = ends.findIndex((x) => x <= it.s);
    if (lane < 0) {
      lane = ends.length;
      ends.push(it.e);
    } else ends[lane] = it.e;
    cluster.push({ it, lane, lanes: 1 });
    clusterEnd = Math.max(clusterEnd, it.e);
  });
  flush();
  return out;
};
 
type ActionItem = { icon: React.ReactElement; label: string; run: () => void };
 
function AllocationMobileHeader({
  isOpen,
  onOpen,
  onClose,
  onAllocationClick,
  buildingSearchValue,
  setBuildingSearchValue,
  classroomSearchValue,
  setClassroomSearchValue,
  nameSearchValue,
  setNameSearchValue,
  classSearchValue,
  setClassSearchValue,
  events,
  buildingResources,
  classroomResources,
  buildings,
  subjects,
  loadingSubjects,
  loadingBuildings,
  loadingSolicitation,
}: AllocationHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedUser } = useContext(appContext);
 
  const today = startOfDay(new Date());
  const [selected, setSelected] = useState<Date>(today);
  const [view, setView] = useState<'list' | 'timeline'>('list');
  const [roomId, setRoomId] = useState('');
  const touch = useRef<{ x: number; y: number } | null>(null);
 
  const { isOpen: isOpenFilters, onToggle: onToggleFilters } = useDisclosure();
  const { isOpen: isOpenActions, onOpen: onOpenActions, onClose: onCloseActions } = useDisclosure();
  const { isOpen: isOpenClassesPDF, onClose: onCloseClassesPDF, onOpen: onOpenClassesPDF } = useDisclosure();
  const { isOpen: isOpenClassroomsPDF, onClose: onCloseClassroomsPDF, onOpen: onOpenClassroomsPDF } = useDisclosure();
  const { isOpen: isOpenSubjectReport, onClose: onCloseSubjectReport, onOpen: onOpenSubjectReport } = useDisclosure();
  const { isOpen: isOpenEmptyClassroomsReport, onClose: onCloseEmptyClassroomsReport, onOpen: onOpenEmptyClassroomsReport } = useDisclosure();
 
  const activeFilters =
    countActive(buildingSearchValue) +
    countActive(classroomSearchValue) +
    countActive(nameSearchValue) +
    countActive(classSearchValue);
 
  /* ───────── dados do calendário ───────── */
  const rooms = useMemo(() => {
    const bList: any[] = (buildingResources as any) ?? [];
    const map = new Map<string, Room>();
    ((classroomResources as any[]) ?? []).forEach((r) => {
      const building =
        r.building ??
        r.extendedProps?.building ??
        bList.find((b) => String(b.id) === String(r.parentId ?? r.groupId ?? r.building_id))?.title ??
        '';
      map.set(String(r.id), { id: String(r.id), name: r.title ?? r.name ?? String(r.id), building });
    });
    return map;
  }, [buildingResources, classroomResources]);
 
  const itemsFor = useMemo(
    () =>
      (day: Date): Item[] => {
        const list: Item[] = [];
        ((events as any[]) ?? []).forEach((ev, i) => {
          const occ = occurrence(ev, day);
          if (!occ) return;
          const room = rooms.get(String(ev.resourceId));
          const title = ev.title ?? '';
          const building = room?.building ?? '';
          const roomName = room?.name ?? 'Sem sala';
          if (
            !matches(nameSearchValue, title, ev.extendedProps?.professor) ||
            !matches(classSearchValue, title, ev.extendedProps?.class_code, ev.extendedProps?.subject_code) ||
            !matches(buildingSearchValue, building) ||
            !matches(classroomSearchValue, roomName)
          )
            return;
          list.push({
            id: `${ev.id ?? i}-${day.getTime()}`,
            eventId: String(ev.id ?? ''),
            title,
            sub: ev.extendedProps?.professor ?? ev.description ?? '',
            s: occ.s,
            e: Math.max(occ.e, occ.s + 15),
            roomId: String(ev.resourceId ?? ''),
            room: roomName,
            building,
            hue: hueOf(building || roomName),
          });
        });
        return list.sort((a, b) => a.s - b.s || a.e - b.e);
      },
    [events, rooms, nameSearchValue, classSearchValue, buildingSearchValue, classroomSearchValue],
  );
 
  const items = useMemo(() => itemsFor(selected), [itemsFor, selected]);
 
  const week = useMemo(() => {
    const start = addDays(selected, -selected.getDay());
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selected]);
  const weekHasItems = useMemo(() => week.map((d) => itemsFor(d).length > 0), [week, itemsFor]);
 
  // Lista: agrupa por sala
  const groups = useMemo(() => {
    const m = new Map<string, Item[]>();
    items.forEach((it) => m.set(it.roomId, [...(m.get(it.roomId) ?? []), it]));
    return [...m.values()].sort((a, b) =>
      `${a[0].building}${a[0].room}`.localeCompare(`${b[0].building}${b[0].room}`),
    );
  }, [items]);
 
  // Linha do tempo: seletor de sala agrupado por prédio
  const roomOptions = useMemo(() => {
    const all = new Map(rooms);
    items.forEach((it) => {
      if (!all.has(it.roomId)) all.set(it.roomId, { id: it.roomId, name: it.room, building: it.building });
    });
    const byBuilding = new Map<string, Room[]>();
    [...all.values()]
      .filter((r) => matches(buildingSearchValue, r.building) && matches(classroomSearchValue, r.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((r) => byBuilding.set(r.building, [...(byBuilding.get(r.building) ?? []), r]));
    return [...byBuilding.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [rooms, items, buildingSearchValue, classroomSearchValue]);
 
  const flatRooms = roomOptions.flatMap(([, r]) => r);
  const currentRoom =
    flatRooms.find((r) => r.id === roomId) ??
    flatRooms.find((r) => items.some((it) => it.roomId === r.id)) ??
    flatRooms[0];
  const roomItems = items.filter((it) => it.roomId === currentRoom?.id);
 
  /* ───────── ações ───────── */
  const handleRequestRoom = () => {
    if (!loggedUser) {
      navigate('/auth', { replace: true, state: { from: location } });
      return;
    }
    onOpen();
  };
 
  const handleShare = async () => {
    await Share.share({
      title: 'Mapa de Salas - USPolis',
      text: 'Confira o Mapa de Salas do USPolis.',
    });
  };
 
  const testCalendar = async () => {
    try {
      const permission = await Calendar.requestPermissions({
        permissions: ['readCalendar', 'writeCalendar'],
      });
      if (permission.readCalendar !== 'granted' || permission.writeCalendar !== 'granted') {
        console.log('Permissão de calendário não concedida');
        return;
      }
      const result = await Calendar.listCalendars();
      console.log('Calendários disponíveis:', JSON.stringify(result, null, 2));
      const startDate = Date.now() + 30 * 1000;
      const event = await Calendar.createEvent({
        calendarId: '5',
        title: 'Teste USPolis',
        location: 'Sala de Teste',
        notes: 'Evento criado pelo aplicativo USPolis.',
        startDate,
        endDate: startDate + 60 * 60 * 1000,
      });
      console.log('Evento criado:', event);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };
 
  const testNotification = async () => {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') {
      console.log('Permissão de notificação não concedida');
      return;
    }
    const at = new Date(Date.now() + 30 * 1000);
    await LocalNotifications.schedule({
      notifications: [
        { id: 2, title: 'Aula em 5 minutos', body: 'Sua aula de começa em 5 minutos', schedule: { at } },
      ],
    });
    console.log('Notificação agendada para:', at.toLocaleString());
  };
 
  const actionGroups: { title: string; items: ActionItem[] }[] = [
    {
      title: 'Alocações gerais',
      items: [
        { icon: <TbReportAnalytics size={20} />, label: 'Alocação das disciplinas', run: onOpenClassesPDF },
        { icon: <BsCalendar3 size={18} />, label: 'Mapa de Salas', run: onOpenClassroomsPDF },
      ],
    },
    {
      title: 'Alocações específicas',
      items: [{ icon: <FaHandPointer size={18} />, label: 'Disciplinas escolhidas', run: onOpenSubjectReport }],
    },
    {
      title: 'Relatórios',
      items: [{ icon: <MdCalendarToday size={20} />, label: 'Disponibilidade de salas', run: onOpenEmptyClassroomsReport }],
    },
    {
      title: 'Mais',
      items: [
        { icon: <MdShare size={20} />, label: 'Compartilhar', run: handleShare },
        ...(SHOW_DEV_TOOLS
          ? [
              { icon: <MdCalendarToday size={20} />, label: 'Testar calendário', run: testCalendar },
              { icon: <MdCalendarToday size={20} />, label: 'Testar notificação', run: testNotification },
            ]
          : []),
      ],
    },
  ];
 
  /* ───────── gestos: arrastar para o lado troca o dia ───────── */
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      setSelected((d) => addDays(d, dx < 0 ? 1 : -1));
    }
  };
 
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const isToday = sameDay(selected, today);
  const dayLabel = cap(
    selected.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
  );
 
  /* ───────── blocos de UI ───────── */
  const renderCard = (it: Item) => (
    <Box
      as='button'
      type='button'
      key={it.id}
      w='100%'
      p={0}
      border={0}
      bg='transparent'
      textAlign='left'
      cursor='pointer'
      aria-label={`${it.title}, ${it.room}, ${it.building}, ${hm(it.s)}–${hm(it.e)}`}
      onClick={() => onAllocationClick?.(it.eventId)}
    >
      <Flex
        gap={3}
        p={3}
        rounded='lg'
        bgColor={`hsl(${it.hue}, 80%, 95%)`}
        borderLeftWidth='4px'
        borderLeftColor={`hsl(${it.hue}, 60%, 42%)`}
      >
        <Box minW='48px'>
          <Text fontSize='sm' fontWeight='semibold'>{hm(it.s)}</Text>
          <Text fontSize='sm' color='gray.600'>{hm(it.e)}</Text>
        </Box>
        <Box minW={0}>
          <Text fontWeight='medium' lineHeight='short'>{it.title}</Text>
          {it.sub && <Text fontSize='sm' color='gray.600'>{it.sub}</Text>}
        </Box>
      </Flex>
    </Box>
  );
 
  const listView = (
    <Flex direction='column' gap={5}>
      {groups.map((g) => (
        <Box key={g[0].roomId}>
          <Flex align='center' gap={2} mb={2} px={1}>
            <Box w='10px' h='10px' rounded='full' bgColor={`hsl(${g[0].hue}, 60%, 42%)`} />
            <Text fontWeight='semibold' flex={1}>
              {g[0].room}
              {g[0].building && (
                <Text as='span' fontWeight='normal' color='gray.600'>{` – ${g[0].building}`}</Text>
              )}
            </Text>
            <Text fontSize='sm' color='gray.500'>{g.length}</Text>
          </Flex>
          <Flex direction='column' gap={2}>{g.map((it) => renderCard(it))}</Flex>
        </Box>
      ))}
    </Flex>
  );
 
  const timelineView = (
    <Box>
      <Select
        mb={4}
        rounded='lg'
        aria-label='Escolher sala'
        value={currentRoom?.id ?? ''}
        onChange={(e) => setRoomId(e.target.value)}
      >
        {roomOptions.map(([b, list]) => (
          <optgroup key={b} label={b || 'Sem prédio'}>
            {list.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </optgroup>
        ))}
      </Select>
      <Box position='relative' h={`${((DAY_MAX - DAY_MIN) / 60) * HOUR_H}px`}>
        {Array.from({ length: (DAY_MAX - DAY_MIN) / 60 + 1 }, (_, i) => (
          <Box key={i} position='absolute' left={0} right={0} top={`${i * HOUR_H}px`}>
            <Text position='absolute' top='-9px' fontSize='xs' color='gray.500' w={`${GUTTER - 8}px`} textAlign='right'>
              {pad(DAY_MIN / 60 + i)}:00
            </Text>
            <Box ml={`${GUTTER}px`} borderTop='1px' borderColor='blackAlpha.200' />
          </Box>
        ))}
        {layoutLanes(roomItems).map(({ it, lane, lanes }) => {
          const s = Math.max(it.s, DAY_MIN);
          const e = Math.min(it.e, DAY_MAX);
          if (e <= s) return null;
          return (
            <Box
              as='button'
              type='button'
              key={it.id}
              position='absolute'
              border={0}
              top={`${((s - DAY_MIN) / 60) * HOUR_H + 1}px`}
              h={`${Math.max(((e - s) / 60) * HOUR_H - 2, 26)}px`}
              left={`calc(${GUTTER + 4}px + (100% - ${GUTTER + 4}px) * ${lane / lanes})`}
              w={`calc((100% - ${GUTTER + 4}px) / ${lanes} - 2px)`}
              overflow='hidden'
              px={2}
              py={1}
              rounded='md'
              bgColor={`hsl(${it.hue}, 80%, 92%)`}
              borderLeftWidth='4px'
              borderLeftColor={`hsl(${it.hue}, 60%, 42%)`}
              textAlign='left'
              cursor='pointer'
              aria-label={`${it.title}, ${it.room}, ${it.building}, ${hm(it.s)}–${hm(it.e)}`}
              onClick={() => onAllocationClick?.(it.eventId)}
            >
              <Text fontSize='sm' fontWeight='medium' lineHeight='short'>{it.title}</Text>
              <Text fontSize='xs' color='gray.600'>{hm(it.s)} – {hm(it.e)}</Text>
            </Box>
          );
        })}
        {isToday && nowMin >= DAY_MIN && nowMin <= DAY_MAX && (
          <Flex
            position='absolute'
            left={`${GUTTER - 5}px`}
            right={0}
            top={`${((nowMin - DAY_MIN) / 60) * HOUR_H}px`}
            align='center'
            pointerEvents='none'
          >
            <Box w='10px' h='10px' rounded='full' bgColor='red.500' />
            <Box flex={1} h='2px' bgColor='red.500' />
          </Flex>
        )}
      </Box>
    </Box>
  );
 
  return (
    <Box w='100%' onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* ───────── Barra superior + seletor de semana (fixos) ───────── */}
      <Box
        as='header'
        position='sticky'
        top={0}
        zIndex={10}
        bgColor='uspolis.white'
        borderBottom='1px'
        borderColor='blackAlpha.200'
      >
        <Flex align='center' h='56px' px={2} gap={1}>
          <Text as='h1' flex={1} pl={2} fontSize='xl' fontWeight='semibold' noOfLines={1}>
            {cap(selected.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))}
          </Text>
          {!isToday && (
            <Button size='sm' variant='outline' rounded='full' onClick={() => setSelected(today)}>
              Hoje
            </Button>
          )}
          <Box position='relative'>
            <IconButton
              aria-label={isOpenFilters ? 'Fechar filtros' : 'Abrir filtros'}
              aria-expanded={isOpenFilters}
              icon={<MdFilterList size={24} />}
              variant={isOpenFilters ? 'solid' : 'ghost'}
              colorScheme={isOpenFilters ? 'blue' : undefined}
              isRound
              onClick={onToggleFilters}
            />
            {activeFilters > 0 && (
              <Flex
                position='absolute'
                top='2px'
                right='2px'
                minW='16px'
                h='16px'
                px='4px'
                align='center'
                justify='center'
                rounded='full'
                bgColor='blue.500'
                color='white'
                fontSize='10px'
                fontWeight='bold'
                pointerEvents='none'
              >
                {activeFilters}
              </Flex>
            )}
          </Box>
          <IconButton
            aria-label='Baixar, relatórios e compartilhar'
            icon={<MdFileDownload size={24} />}
            variant='ghost'
            isRound
            onClick={onOpenActions}
          />
        </Flex>
 
        {/* Semana: 7 alvos de toque que ocupam toda a largura, sem rolagem lateral */}
        <Flex align='center' px={1} pb={2}>
          <IconButton
            aria-label='Semana anterior'
            icon={<ChevronLeftIcon boxSize={6} />}
            variant='ghost'
            size='sm'
            isRound
            onClick={() => setSelected((d) => addDays(d, -7))}
          />
          <Flex flex={1}>
            {week.map((d, i) => {
              const sel = sameDay(d, selected);
              const tod = sameDay(d, today);
              return (
                <Flex
                  key={d.getTime()}
                  as='button'
                  flex={1}
                  direction='column'
                  align='center'
                  gap={1}
                  py={1}
                  aria-label={d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  aria-pressed={sel}
                  onClick={() => setSelected(d)}
                >
                  <Text fontSize='xs' color='gray.600'>
                    {d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                  </Text>
                  <Flex
                    w='36px'
                    h='36px'
                    align='center'
                    justify='center'
                    rounded='full'
                    fontWeight={sel || tod ? 'bold' : 'normal'}
                    bgColor={sel ? 'blue.500' : 'transparent'}
                    color={sel ? 'white' : tod ? 'blue.500' : 'inherit'}
                    borderWidth={tod && !sel ? '2px' : 0}
                    borderColor='blue.500'
                  >
                    {d.getDate()}
                  </Flex>
                  <Box w='5px' h='5px' rounded='full' bgColor={weekHasItems[i] ? 'blue.300' : 'transparent'} />
                </Flex>
              );
            })}
          </Flex>
          <IconButton
            aria-label='Próxima semana'
            icon={<ChevronRightIcon boxSize={6} />}
            variant='ghost'
            size='sm'
            isRound
            onClick={() => setSelected((d) => addDays(d, 7))}
          />
        </Flex>
 
        {/* Painel de filtros: fica sempre montado para o HeaderFilter manter estado e modais */}
        <Collapse in={isOpenFilters} animateOpacity>
          <Box px={4} pt={2} pb={4} maxH='60vh' overflowY='auto' borderTop='1px' borderColor='blackAlpha.100'>
            <HeaderFilter
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              buildingSearchValue={buildingSearchValue}
              setBuildingSearchValue={setBuildingSearchValue}
              classroomSearchValue={classroomSearchValue}
              setClassroomSearchValue={setClassroomSearchValue}
              nameSearchValue={nameSearchValue}
              setNameSearchValue={setNameSearchValue}
              classSearchValue={classSearchValue}
              setClassSearchValue={setClassSearchValue}
              events={events}
              buildingResources={buildingResources}
              classroomResources={classroomResources}
              subjects={subjects}
              loadingSubjects={loadingSubjects}
              buildings={buildings}
              loadingBuildings={loadingBuildings}
              loadingSolicitation={loadingSolicitation}
            />
          </Box>
        </Collapse>
      </Box>
 
      {/* ───────── Conteúdo do dia ───────── */}
      <Box px={4} pt={4} pb='calc(96px + env(safe-area-inset-bottom, 0px))' minH='60vh'>
        <Flex align='center' justify='space-between' gap={3} mb={4}>
          <Box minW={0}>
            <Text fontWeight='semibold' noOfLines={1}>{dayLabel}</Text>
            <Text fontSize='sm' color='gray.600'>
              {items.length === 0
                ? 'Sem alocações'
                : `${items.length} ${items.length === 1 ? 'alocação' : 'alocações'} em ${groups.length} ${groups.length === 1 ? 'sala' : 'salas'}`}
            </Text>
          </Box>
          <ButtonGroup isAttached size='sm'>
            <Button colorScheme={view === 'list' ? 'blue' : undefined} variant={view === 'list' ? 'solid' : 'outline'} onClick={() => setView('list')}>
              Lista
            </Button>
            <Button colorScheme={view === 'timeline' ? 'blue' : undefined} variant={view === 'timeline' ? 'solid' : 'outline'} onClick={() => setView('timeline')}>
              Horários
            </Button>
          </ButtonGroup>
        </Flex>
 
        {view === 'timeline' ? (
          timelineView
        ) : items.length === 0 ? (
          <Flex direction='column' align='center' textAlign='center' py={16} gap={2} color='gray.600'>
            <MdCalendarToday size={40} />
            <Text fontWeight='medium'>Nenhuma alocação neste dia</Text>
            <Text fontSize='sm'>Deslize para os lados para trocar de dia ou ajuste os filtros.</Text>
          </Flex>
        ) : (
          listView
        )}
      </Box>
 
      {/* ───────── Botão flutuante: Solicitar sala ───────── */}
      <IconButton
        aria-label={loggedUser ? 'Solicitar sala' : 'Entre para solicitar uma sala'}
        icon={loggedUser ? <MdAdd size={30} /> : <LockIcon boxSize={5} />}
        colorScheme='blue'
        isRound
        w='56px'
        h='56px'
        position='fixed'
        right='16px'
        bottom='calc(20px + env(safe-area-inset-bottom, 0px))'
        zIndex={20}
        boxShadow='0 4px 12px rgba(0, 0, 0, 0.3)'
        isLoading={loadingSolicitation}
        onClick={handleRequestRoom}
      />
 
      {/* ───────── Folha de ações (bottom sheet) ───────── */}
      <Drawer isOpen={isOpenActions} onClose={onCloseActions} placement='bottom'>
        <DrawerOverlay />
        <DrawerContent
          bgColor='uspolis.white'
          borderTopRadius='20px'
          maxH='85vh'
          pb='env(safe-area-inset-bottom, 0px)'
        >
          <Box mx='auto' mt={2} w='36px' h='4px' rounded='full' bgColor='blackAlpha.300' />
          <DrawerHeader fontSize='lg' pb={1}>Mapa de Salas</DrawerHeader>
          <DrawerBody px={2} pb={4}>
            {actionGroups.map((g, gi) => (
              <Box key={g.title}>
                {gi > 0 && <Divider my={2} />}
                <Text px={4} pt={2} pb={1} fontSize='sm' color='gray.600'>{g.title}</Text>
                {g.items.map((a) => (
                  <Button
                    key={a.label}
                    variant='ghost'
                    justifyContent='flex-start'
                    h='52px'
                    w='100%'
                    px={4}
                    fontWeight='normal'
                    leftIcon={a.icon}
                    iconSpacing={4}
                    onClick={() => {
                      onCloseActions();
                      a.run();
                    }}
                  >
                    {a.label}
                  </Button>
                ))}
              </Box>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
 
      {/* ───────── Modais ───────── */}
      <ClassesPDFModal isOpen={isOpenClassesPDF} onClose={onCloseClassesPDF} buildings={buildings} />
      <ClassroomPDFModal isOpen={isOpenClassroomsPDF} onClose={onCloseClassroomsPDF} buildings={buildings} />
      <SubjectReportModal
        isOpen={isOpenSubjectReport}
        onClose={onCloseSubjectReport}
        loading={loadingSubjects || loadingBuildings}
        subjects={subjects}
        buildings={buildings}
      />
      <EmptyClassroomsReportModal
        isOpen={isOpenEmptyClassroomsReport}
        onClose={onCloseEmptyClassroomsReport}
        buildings={buildings}
      />
    </Box>
  );
}
 
export default AllocationMobileHeader;