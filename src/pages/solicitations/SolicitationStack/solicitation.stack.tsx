import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Tab,
  TabList,
  Tabs,
  Tag,
  Text,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useContext, useMemo, useState } from 'react';

import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import { ReservationStatus } from '../../../utils/enums/reservations.enum';
import { appContext } from '../../../context/AppContext';
import TooltipSelect from '../../../components/common/TooltipSelect';
import SolicitationStackBody from './solicitation.stack.body';

type TabKey =
  | 'pending'
  | ReservationStatus.APPROVED
  | ReservationStatus.DENIED
  | 'all';

const TAB_DEFS: { key: TabKey; label: string }[] = [
  { key: 'pending', label: 'Pendentes' },
  { key: ReservationStatus.APPROVED, label: 'Aprovadas' },
  { key: ReservationStatus.DENIED, label: 'Negadas' },
  { key: 'all', label: 'Todas' },
];

interface SolicitationStackProps {
  pendingSolicitations: SolicitationResponse[];
  solicitationsPaginated: SolicitationResponse[];
  handleOnClick: (data: SolicitationResponse) => void;
  loading: boolean;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  totalPages: number;
  handleShowMore: (page: number) => Promise<void>;
}

function filterSolicitations(
  list: SolicitationResponse[],
  query: string,
  building: string,
) {
  const q = query.trim().toLowerCase();
  return list.filter((solicitation) => {
    if (building && solicitation.building !== building) return false;
    if (!q) return true;
    const classroom = solicitation.reservation.classroom_name || 'não especificada';
    const haystack = `${solicitation.reservation.title} ${solicitation.user} ${solicitation.building} ${classroom}`.toLowerCase();
    return haystack.includes(q);
  });
}

function SolicitationStack({
  pendingSolicitations,
  solicitationsPaginated,
  handleOnClick,
  loading,
  currentPage,
  setCurrentPage,
  totalPages,
  handleShowMore,
}: SolicitationStackProps) {
  const { loggedUser, isMobile } = useContext(appContext);
  const userBuildings = loggedUser ? loggedUser.buildings || [] : [];
  const hideBuildingFilter = userBuildings.length === 1 && !loggedUser?.is_admin;

  const [tab, setTab] = useState<TabKey>('pending');
  const [query, setQuery] = useState('');
  const [building, setBuilding] = useState('');

  const buildingOptions = useMemo(() => {
    const names = new Set<string>();
    pendingSolicitations.forEach((s) => names.add(s.building));
    solicitationsPaginated.forEach((s) => names.add(s.building));
    return Array.from(names).sort();
  }, [pendingSolicitations, solicitationsPaginated]);

  const base = useMemo(() => {
    switch (tab) {
      case 'pending':
        return [...pendingSolicitations].reverse();
      case ReservationStatus.APPROVED:
      case ReservationStatus.DENIED:
        return solicitationsPaginated.filter((s) => s.status === tab);
      case 'all':
      default:
        return solicitationsPaginated;
    }
  }, [tab, pendingSolicitations, solicitationsPaginated]);

  const filtered = useMemo(
    () => filterSolicitations(base, query, building),
    [base, query, building],
  );

  const counts: Record<TabKey, number> = {
    pending: pendingSolicitations.length,
    [ReservationStatus.APPROVED]: solicitationsPaginated.filter(
      (s) => s.status === ReservationStatus.APPROVED,
    ).length,
    [ReservationStatus.DENIED]: solicitationsPaginated.filter(
      (s) => s.status === ReservationStatus.DENIED,
    ).length,
    all: solicitationsPaginated.length,
  };

  const tabNames: Record<TabKey, string> = {
    pending: 'pendente',
    [ReservationStatus.APPROVED]: 'aprovada',
    [ReservationStatus.DENIED]: 'negada',
    all: '',
  };
  const total = filtered.length;
  const tabName = tabNames[tab];
  const resultText = `${total} solicitaç${total === 1 ? 'ão' : 'ões'}${
    tabName ? ' ' + tabName + (total === 1 ? '' : 's') : ''
  }`;

  const emptyText =
    tab === 'pending' && !query && !building
      ? 'Nenhuma solicitação pendente'
      : 'Nenhuma solicitação encontrada';

  const hasMore = tab !== 'pending' && currentPage < totalPages;

  async function handleShowMoreClick() {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await handleShowMore(nextPage);
  }

  const activeIndex = TAB_DEFS.findIndex((t) => t.key === tab);

  return (
    <Flex direction={'column'} w={'full'} flex={isMobile ? undefined : 1} minH={0}>
      <Box flexShrink={0}>
        <Tabs
          index={activeIndex}
          onChange={(index) => setTab(TAB_DEFS[index].key)}
          variant={'line'}
          mb={'12px'}
        >
          <TabList flexWrap={'wrap'} rowGap={'6px'} borderColor={'uspolis.border'}>
            {TAB_DEFS.map((t) => (
              <Tab key={t.key} whiteSpace={'nowrap'} gap={'8px'} fontWeight={'medium'}>
                <Text>{t.label}</Text>
                <Tag
                  borderRadius={'999px'}
                  size={'sm'}
                  colorScheme={tab === t.key ? 'blue' : 'gray'}
                  variant={tab === t.key ? 'solid' : 'subtle'}
                >
                  {counts[t.key]}
                </Tag>
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <Flex wrap={'wrap'} gap={'8px'} mb={'10px'}>
          <InputGroup flex={'1 1 260px'} minW={0}>
            <InputLeftElement pointerEvents={'none'}>
              <SearchIcon color={'uspolis.textMuted'} boxSize={'14px'} />
            </InputLeftElement>
            <Input
              placeholder={'Buscar por título, sala ou solicitante'}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>
          {!hideBuildingFilter && (
            <Box flex={'0 1 220px'} minW={'160px'}>
              <TooltipSelect
                isClearable
                placeholder={'Todos os prédios'}
                value={building ? { label: building, value: building } : null}
                options={buildingOptions.map((name) => ({ label: name, value: name }))}
                onChange={(option) => setBuilding(option ? String(option.value) : '')}
              />
            </Box>
          )}
        </Flex>

        <Text fontSize={'13.5px'} color={'uspolis.textMuted'} mb={'10px'}>
          {resultText}
        </Text>
      </Box>

      <Box
        flex={isMobile ? undefined : 1}
        minH={0}
        overflowY={isMobile ? 'visible' : 'auto'}
        pr={isMobile ? undefined : '4px'}
      >
        <Skeleton isLoaded={!loading}>
          <SolicitationStackBody
            solicitations={filtered}
            onSelect={handleOnClick}
            emptyText={emptyText}
            hasMore={hasMore}
            handleShowMoreClick={handleShowMoreClick}
          />
        </Skeleton>
      </Box>
    </Flex>
  );
}

export default SolicitationStack;
