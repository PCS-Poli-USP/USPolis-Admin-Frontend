import {
  Flex,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import CardFilters, {
  CardFilter,
} from './CardFilters';

interface Props<T> {
  items: T[];
  loading: boolean;
  emptyMessage: string;
  renderCard: (item: T) => React.ReactNode;

  filters?: CardFilter<T>[];
}

export default function CardList<T>({
  items,
  loading,
  emptyMessage,
  renderCard,
  filters = [],
}: Props<T>) {
  const [filterValues, setFilterValues] = useState<
    Record<string, string>
  >({});

  const handleFilterChange = (
    key: string,
    value: string,
  ) => {
    setFilterValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilterValues({});
  };

  const filteredItems = useMemo(() => {
    if (filters.length === 0) {
      return items;
    }

    return items.filter((item) => {
      return filters.every((filter) => {
        const filterValue = filterValues[filter.key];

        if (!filterValue) {
          return true;
        }

        const itemValue = filter.getValue
          ? filter.getValue(item)
          : String(
              (item as Record<string, unknown>)[filter.key] ?? '',
            );

        if (filter.type === 'select') {
          return itemValue === filterValue;
        }

        return itemValue
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      });
    });
  }, [items, filters, filterValues]);

  if (loading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <>
      {filters.length > 0 && (
        <CardFilters
          filters={filters}
          values={filterValues}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />
      )}

      {filteredItems.length === 0 ? (
        <Flex
          justify="center"
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          w="100%"
        >
          <Text color="gray.500">
            {filterValues &&
            Object.values(filterValues).some(
              (value) => value !== '',
            )
              ? 'Nenhum resultado encontrado para os filtros.'
              : emptyMessage}
          </Text>
        </Flex>
      ) : (
        <SimpleGrid
          columns={{ base: 1, sm: 2 }}
          spacing={4}
          w="100%"
        >
          {filteredItems.map(renderCard)}
        </SimpleGrid>
      )}
    </>
  );
}