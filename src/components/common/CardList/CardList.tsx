import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  SimpleGrid,
  SimpleGridProps,
  Spinner,
  Text,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { LuSettings2 } from 'react-icons/lu';

import CardFilters, {
  CardFilter,
} from './CardFilters';

interface Props<T> {
  items: T[];
  loading: boolean;
  emptyMessage: string;
  renderCard: (item: T) => React.ReactNode;
  columns?: SimpleGridProps['columns'];
  toolbarAction?: React.ReactNode;

  filters?: CardFilter<T>[];
}

export default function CardList<T>({
  items,
  loading,
  emptyMessage,
  renderCard,
  columns = { base: 1, sm: 2 },
  toolbarAction,
  filters = [],
}: Props<T>) {
  const [filterValues, setFilterValues] = useState<
    Record<string, string>
  >({});
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toolsBackground = useColorModeValue('uspolis.white', 'uspolis.white');
  const toolsColor = useColorModeValue('uspolis.text', 'uspolis.black');

  const handleFilterChange = (
    key: string,
    value: string,
  ) => {
    setFilterValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleClearTools = () => {
    setFilterValues({});
    setSortKey('');
    setSortDirection('asc');
  };

  const visibleItems = useMemo(() => {
    const filteredItems = filters.length === 0
      ? items
      : items.filter((item) => {
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

    if (!sortKey) return filteredItems;

    const sortFilter = filters.find((filter) => filter.key === sortKey);
    if (!sortFilter) return filteredItems;

    const getValue = (item: T) => (
      sortFilter.getSortValue
        ? sortFilter.getSortValue(item)
        : sortFilter.getValue
          ? sortFilter.getValue(item)
        : String((item as Record<string, unknown>)[sortFilter.key] ?? '')
    );
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base',
    });

    return [...filteredItems].sort((left, right) => {
      const result = collator.compare(getValue(left), getValue(right));
      return sortDirection === 'asc' ? result : -result;
    });
  }, [items, filters, filterValues, sortKey, sortDirection]);

  return (
    <>
      {filters.length > 0 && (
        <Flex gap={2} mb={4} w="100%">
          <Button
            leftIcon={<LuSettings2 />}
            variant="outline"
            bg={toolsBackground}
            color={toolsColor}
            borderColor="uspolis.border"
            _hover={{ bg: 'uspolis.hover' }}
            onClick={onOpen}
            flex={toolbarAction ? 1 : undefined}
            w={toolbarAction ? undefined : '100%'}
          >
            Filtros
          </Button>
          {toolbarAction && (
            <Flex flex={1} minW={0} sx={{ '& > *': { width: '100%' } }}>
              {toolbarAction}
            </Flex>
          )}
        </Flex>
      )}
      {filters.length > 0 && (
        <>
          <Drawer
            isOpen={isOpen}
            onClose={onClose}
            placement="bottom"
            size="full"
          >
            <DrawerOverlay />
            <DrawerContent
              h="80vh"
              maxH="80vh"
              bg="uspolis.white"
              color="uspolis.text"
              borderTopRadius="16px"
              overflow="hidden"
            >
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px">
                Filtros e ordenação
              </DrawerHeader>
              <DrawerBody overflowY="auto" py={5}>
                <CardFilters
                  filters={filters}
                  values={filterValues}
                  onChange={handleFilterChange}
                  onClear={handleClearTools}
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSortKeyChange={setSortKey}
                  onSortDirectionChange={setSortDirection}
                />
              </DrawerBody>
              <DrawerFooter borderTopWidth="1px">
                <Button colorScheme="blue" w="full" onClick={onClose}>
                  Aplicar
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      )}

      {loading ? (
        <Flex justify="center" py={10}>
          <Spinner size="lg" />
        </Flex>
      ) : visibleItems.length === 0 ? (
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
          columns={columns}
          spacing={4}
          w="100%"
        >
          {visibleItems.map(renderCard)}
        </SimpleGrid>
      )}
    </>
  );
}