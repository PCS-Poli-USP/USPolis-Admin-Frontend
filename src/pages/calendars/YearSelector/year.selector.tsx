import { Button, HStack, Text } from '@chakra-ui/react';

interface YearSelectorProps {
  year: number;
  years?: number[];
  onChange: (year: number) => void;
}

/**
 * Seletor de ano em formato de "pills", usado no cabeçalho da página de
 * calendários. Por padrão oferece o ano anterior, o atual e o próximo.
 */
export function YearSelector({ year, years, onChange }: YearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const options = years ?? [currentYear - 1, currentYear, currentYear + 1];

  return (
    <HStack
      spacing={2}
      border={'1px solid'}
      borderColor={'uspolis.blue'}
      borderRadius={'40px'}
      h={'40px'}
      pl={'14px'}
      pr={'6px'}
    >
      <Text
        fontWeight={'bold'}
        color={'uspolis.text'}
        fontSize={'15px'}
        whiteSpace={'nowrap'}
      >
        {`Ano: ${year}`}
      </Text>
      <HStack spacing={'2px'}>
        {options.map((option) => {
          const active = option === year;
          return (
            <Button
              key={option}
              size={'sm'}
              h={'28px'}
              px={'9px'}
              borderRadius={'20px'}
              fontSize={'13px'}
              fontWeight={active ? 'bold' : 'normal'}
              variant={active ? 'solid' : 'ghost'}
              bg={active ? 'uspolis.blue' : 'transparent'}
              color={active ? 'white' : 'uspolis.textMuted'}
              _hover={
                active ? { bg: 'uspolis.darkBlue' } : { bg: 'uspolis.hover' }
              }
              onClick={() => onChange(option)}
            >
              {option}
            </Button>
          );
        })}
      </HStack>
    </HStack>
  );
}

export default YearSelector;
