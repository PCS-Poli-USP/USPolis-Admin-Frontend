import {
  Box,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tag,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import { ReservationStatus } from '../../../utils/enums/reservations.enum';

export type SolicitationFilter = ReservationStatus | 'all';

interface MySolicitationFiltersProps {
  filter: SolicitationFilter;
  onFilterChange: (filter: SolicitationFilter) => void;
  counts: Record<SolicitationFilter, number>;
  query: string;
  onQueryChange: (query: string) => void;
}

const FILTER_OPTIONS: { key: SolicitationFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: ReservationStatus.PENDING, label: 'Pendentes' },
  { key: ReservationStatus.APPROVED, label: 'Aprovadas' },
  { key: ReservationStatus.DENIED, label: 'Negadas' },
  { key: ReservationStatus.CANCELLED, label: 'Canceladas' },
];

function MySolicitationFilters({
  filter,
  onFilterChange,
  counts,
  query,
  onQueryChange,
}: MySolicitationFiltersProps) {
  return (
    <Stack direction={{ base: 'column', md: 'row' }} spacing={'10px'} align={{ base: 'stretch', md: 'center' }}>
      <HStack
        spacing={'6px'}
        overflowX={'auto'}
        flexWrap={'nowrap'}
        py={'2px'}
        sx={{ '::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}
      >
        {FILTER_OPTIONS.map((option) => {
          const active = filter === option.key;
          const scheme =
            option.key === 'all'
              ? 'blue'
              : ReservationStatus.getColorScheme(option.key);
          return (
            <Tag
              key={option.key}
              as={'button'}
              onClick={() => onFilterChange(option.key)}
              size={'lg'}
              borderRadius={'20px'}
              cursor={'pointer'}
              flexShrink={0}
              fontWeight={active ? 'medium' : 'normal'}
              variant={active ? 'solid' : 'outline'}
              colorScheme={active ? 'blue' : 'gray'}
              gap={'7px'}
              whiteSpace={'nowrap'}
            >
              <Box
                w={'8px'}
                h={'8px'}
                borderRadius={'full'}
                bg={active ? 'whiteAlpha.800' : `${scheme}.400`}
              />
              {option.label}
              <Tag
                as={'span'}
                size={'sm'}
                borderRadius={'10px'}
                bg={active ? 'whiteAlpha.300' : 'uspolis.surfaceSubtle'}
                color={active ? 'white' : 'uspolis.textMuted'}
              >
                {counts[option.key] ?? 0}
              </Tag>
            </Tag>
          );
        })}
      </HStack>
      <Box flex={1} display={{ base: 'none', md: 'block' }} />
      <InputGroup w={{ base: 'full', md: '280px' }} flexShrink={0} bg={'uspolis.white'} borderRadius={'8px'}>
        <InputLeftElement pointerEvents={'none'}>
          <SearchIcon color={'uspolis.textMuted'} boxSize={'14px'} />
        </InputLeftElement>
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={'Buscar por título, sala ou prédio'}
          fontSize={'14px'}
        />
      </InputGroup>
    </Stack>
  );
}

export default MySolicitationFilters;
