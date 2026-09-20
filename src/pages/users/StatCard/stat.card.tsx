import { Box, Flex, Text } from '@chakra-ui/react';

interface StatCardProps {
  label: string;
  value: number;
  active?: boolean;
  colorScheme: string;
  onClick: () => void;
}

function StatCard({ label, value, active, colorScheme, onClick }: StatCardProps) {
  return (
    <Box
      as='button'
      onClick={onClick}
      textAlign={'left'}
      borderWidth={'2px'}
      borderStyle={'solid'}
      borderColor={active ? `${colorScheme}.500` : 'uspolis.border'}
      borderRadius={'10px'}
      p={'8px 16px'}
      bg={active ? `${colorScheme}.50` : 'uspolis.white'}
      _hover={{ borderColor: `${colorScheme}.500` }}
      transition={'border-color 0.15s ease'}
    >
      <Flex align={'center'} gap={'10px'}>
        <Text fontSize={'22px'} fontWeight={'bold'} color={`${colorScheme}.600`}>
          {value}
        </Text>
        <Text fontSize={'12.5px'} fontWeight={'medium'} color={'uspolis.gray'}>
          {label}
        </Text>
      </Flex>
    </Box>
  );
}

export default StatCard;
