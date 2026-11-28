import { Box, Flex, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface StatTileProps {
  label: string;
  // Already formatted (numbers, percentages, positions)
  value: string;
  detail?: string;
  color?: string;
  // Rendered next to the label, e.g. a HelpPopover
  help?: ReactNode;
}

function StatTile({ label, value, detail, color, help }: StatTileProps) {
  return (
    <Box
      border={'1px solid'}
      borderColor={'uspolis.border'}
      borderRadius={'lg'}
      p={4}
      bg={'uspolis.white'}
    >
      <Flex align={'center'} gap={1} minH={'24px'}>
        <Text fontSize={'sm'} color={'uspolis.textMuted'}>
          {label}
        </Text>
        {help}
      </Flex>
      <Text
        fontSize={'3xl'}
        fontWeight={'bold'}
        lineHeight={1.2}
        color={color}
        fontFamily={'monospace'}
      >
        {value}
      </Text>
      {detail && (
        <Text fontSize={'xs'} color={'uspolis.textMuted'}>
          {detail}
        </Text>
      )}
    </Box>
  );
}

export default StatTile;
