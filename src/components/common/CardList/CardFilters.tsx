import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

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
  getSortValue?: (item: T) => string;
}

interface Props<T> {
  filters: CardFilter<T>[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  sortKey: string;
  sortDirection: 'asc' | 'desc';
  onSortKeyChange: (key: string) => void;
  onSortDirectionChange: (direction: 'asc' | 'desc') => void;
}

export default function CardFilters<T>({
  filters,
  values,
  onChange,
  onClear,
  sortKey,
  sortDirection,
  onSortKeyChange,
  onSortDirectionChange,
}: Props<T>) {
  const hasActiveTools =
    !!sortKey ||
    Object.values(values).some((value) => value !== '');

  return (
    <Stack spacing={5} w="100%">
      {filters.length > 0 && (
        <Accordion allowToggle>
          <AccordionItem bg="uspolis.white" border="1px solid" borderColor="uspolis.border" borderRadius="md">
            <AccordionButton>
              <Text flex={1} textAlign="left" fontWeight="semibold">
                Filtrar por
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                {filters.map((filter) => (
                  <FormControl key={filter.key}>
                    <FormLabel fontSize="sm" mb={1}>
                      {filter.label}
                    </FormLabel>
                    {filter.type === 'select' ? (
                      <Select
                        value={values[filter.key] ?? ''}
                        onChange={(event) =>
                          onChange(filter.key, event.target.value)
                        }
                        placeholder="Todos"
                        bg="uspolis.white"
                        color="uspolis.black"
                        sx={{
                          '& option': {
                            bg: 'uspolis.white',
                            color: 'uspolis.black',
                          },
                        }}
                      >
                        {(filter.options ?? []).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        value={values[filter.key] ?? ''}
                        onChange={(event) =>
                          onChange(filter.key, event.target.value)
                        }
                        placeholder={filter.placeholder ?? filter.label}
                      />
                    )}
                  </FormControl>
                ))}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}

      <Accordion allowToggle>
        <AccordionItem bg="uspolis.white" border="1px solid" borderColor="uspolis.border" borderRadius="md">
          <AccordionButton>
            <Text flex={1} textAlign="left" fontWeight="semibold">
              Ordenar por
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
              <FormControl>
                <FormLabel fontSize="sm" mb={1}>
                  Campo
                </FormLabel>
                <Select
                  value={sortKey}
                  onChange={(event) => onSortKeyChange(event.target.value)}
                  bg="uspolis.white"
                  color="uspolis.black"
                  sx={{
                    '& option': {
                      bg: 'uspolis.white',
                      color: 'uspolis.black',
                    },
                  }}
                >
                  <option value="">Ordem original</option>
                  {filters.map((filter) => (
                    <option key={filter.key} value={filter.key}>
                      {filter.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isDisabled={!sortKey}>
                <FormLabel fontSize="sm" mb={1}>
                  Direção
                </FormLabel>
                <RadioGroup
                  value={sortDirection}
                  onChange={(value) =>
                    onSortDirectionChange(value as 'asc' | 'desc')
                  }
                >
                  <Stack direction="row" spacing={4} minH="40px">
                    <Radio value="asc" isDisabled={!sortKey}>
                      Crescente
                    </Radio>
                    <Radio value="desc" isDisabled={!sortKey}>
                      Decrescente
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {hasActiveTools && (
        <Button
          alignSelf="flex-start"
          variant="outline"
          leftIcon={<CloseIcon />}
          onClick={onClear}
        >
          Limpar filtros e ordenação
        </Button>
      )}
    </Stack>
  );
}
