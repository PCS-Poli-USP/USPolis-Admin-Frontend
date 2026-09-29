import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useMemo } from 'react';

import TooltipSelect, { Option } from '../TooltipSelect';

export interface CardFilterOption {
  value: string;
  label: string;
}

export interface CardFilter<T> {
  key: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: CardFilterOption[];
  getValue?: (item: T) => string;
}

interface Props<T> {
  filters: CardFilter<T>[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

export default function CardFilters<T>({
  filters,
  values,
  onChange,
  onClear,
}: Props<T>) {
  const activeFilterCount = useMemo(
    () =>
      Object.values(values).filter(
        (value) => value !== '',
      ).length,
    [values],
  );

  const hasActiveFilters = activeFilterCount > 0;

  const renderFilter = (filter: CardFilter<T>) => {
    if (filter.type === 'select') {
      const options: Option[] =
        filter.options?.map((option) => ({
          value: option.value,
          label: option.label,
        })) ?? [];

      const selectedOption =
        options.find(
          (option) =>
            option.value === values[filter.key],
        ) ?? null;

      return (
        <Box
          key={filter.key}
          w="100%"
        >
          <TooltipSelect
            placeholder={filter.label}
            options={options}
            value={selectedOption}
            onChange={(option) =>
              onChange(
                filter.key,
                option?.value?.toString() ?? '',
              )
            }
            isClearable
            isSearchable={false}
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: '32px',
                height: '32px',
                boxSizing: 'border-box',
                borderRadius: '0',
                borderColor: state.isFocused
                  ? '#3182CE'
                  : '#CBD5E0',
                boxShadow: state.isFocused
                  ? '0 0 0 1px #3182CE'
                  : 'none',
                '&:hover': {
                  borderColor: '#3182CE',
                },
              }),

              valueContainer: (base) => ({
                ...base,
                height: '30px',
                minHeight: '0',
                padding: '0 12px',
              }),

              input: (base) => ({
                ...base,
                margin: '0',
                padding: '0',
              }),

              placeholder: (base) => ({
                ...base,
                color: '#718096',
                fontSize: '16px',
                margin: '0',
              }),

              singleValue: (base) => ({
                ...base,
                fontSize: '16px',
                margin: '0',
              }),

              indicatorsContainer: (base) => ({
                ...base,
                height: '30px',
              }),

              dropdownIndicator: (base) => ({
                ...base,
                padding: '4px 10px',
              }),

              clearIndicator: (base) => ({
                ...base,
                padding: '4px 6px',
              }),

              menu: (base) => ({
                ...base,
                zIndex: 10,
              }),
            }}
          />
        </Box>
      );
    }

    return (
      <Input
        key={filter.key}
        value={values[filter.key] ?? ''}
        onChange={(event) =>
          onChange(
            filter.key,
            event.target.value,
          )
        }
        placeholder={
          filter.placeholder ?? filter.label
        }
        size="sm"
        w="100%"
      />
    );
  };

  return (
    <Box mb={4} w="100%">
      <Accordion allowToggle>
        <AccordionItem
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
        >
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Text fontWeight="medium">
                Filtros
                {hasActiveFilters &&
                  ` (${activeFilterCount})`}
              </Text>
            </Box>

            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel pb={4}>
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              wrap="wrap"
              gap={3}
              w="100%"
            >
              {filters.map(renderFilter)}

              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<CloseIcon />}
                  onClick={onClear}
                  w={{
                    base: '100%',
                    sm: 'auto',
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}