import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';

interface StatCardProps {
  label: string;
  value: number;
  active?: boolean;
  colorScheme: string;
  onClick: () => void;
  // Phones: three cards share a 360px row, so the value sits above the label
  // instead of beside it.
  compact?: boolean;
}

function StatCard({
  label,
  value,
  active,
  colorScheme,
  onClick,
  compact = false,
}: StatCardProps) {
  // The theme maps blue.600 to #264d4d in dark mode, nearly the page
  // background: the dark theme uses the light shade of each color instead.
  const valueColor = useColorModeValue(
    `${colorScheme}.600`,
    `${colorScheme}.300`,
  );
  const activeBg = useColorModeValue(`${colorScheme}.50`, 'whiteAlpha.100');
  return (
    <Box
      as='button'
      onClick={onClick}
      aria-pressed={active}
      textAlign={'left'}
      borderWidth={'2px'}
      borderStyle={'solid'}
      borderColor={active ? `${colorScheme}.500` : 'uspolis.border'}
      borderRadius={'10px'}
      p={compact ? '8px 10px' : '8px 16px'}
      w={compact ? 'full' : undefined}
      minH={compact ? '64px' : undefined}
      minW={0}
      bg={active ? activeBg : 'uspolis.white'}
      _hover={{ borderColor: `${colorScheme}.500` }}
      transition={'border-color 0.15s ease'}
    >
      <Flex
        direction={compact ? 'column' : 'row'}
        align={compact ? 'flex-start' : 'center'}
        gap={compact ? '2px' : '10px'}
      >
        <Text
          fontSize={compact ? '20px' : '22px'}
          lineHeight={compact ? 1.1 : undefined}
          fontWeight={'bold'}
          color={valueColor}
        >
          {value}
        </Text>
        <Text
          fontSize={compact ? '11.5px' : '12.5px'}
          lineHeight={compact ? 1.25 : undefined}
          fontWeight={'medium'}
          color={'uspolis.textMuted'}
        >
          {label}
        </Text>
      </Flex>
    </Box>
  );
}

export default StatCard;
