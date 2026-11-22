import { Button, Wrap, WrapItem } from '@chakra-ui/react';
import { SearchEntityType } from '../../../utils/enums/searchEntityType.enum';

interface SearchTypeFilterProps {
  value: SearchEntityType | null;
  onChange: (value: SearchEntityType | null) => void;
}

const options: Array<{ value: SearchEntityType | null; label: string }> = [
  { value: null, label: 'Tudo' },
  ...SearchEntityType.values().map((type) => ({
    value: type,
    label: SearchEntityType.translatePlural(type),
  })),
];

function SearchTypeFilter({ value, onChange }: SearchTypeFilterProps) {
  return (
    <Wrap
      spacing={2}
      justify={'center'}
      role={'group'}
      aria-label={'Filtrar resultados por tipo'}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <WrapItem key={option.label}>
            <Button
              size={'sm'}
              borderRadius={'full'}
              variant={active ? 'solid' : 'outline'}
              aria-pressed={active}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Button>
          </WrapItem>
        );
      })}
    </Wrap>
  );
}

export default SearchTypeFilter;
