import { Box, HStack, StackDivider, Text } from '@chakra-ui/react';
import { Day } from './day.component';

interface DaysHeaderProps {
  startNumber: number;
}

export function WeekDaysHeader(props: DaysHeaderProps) {
  return (
    <HStack w='full' divider={<StackDivider borderColor='gray.200' />}>
      <Box w='full' maxW='150px'>
        <Text fontWeight='bold' size='xl '>
          Salas
        </Text>
      </Box>
      <Day weekDay='SEG' numberDay={props.startNumber} />
      <Day weekDay='TER' numberDay={props.startNumber + 1} />
      <Day weekDay='QUA' numberDay={props.startNumber + 2} />
      <Day weekDay='QUI' numberDay={props.startNumber + 3} />
      <Day weekDay='SEX' numberDay={props.startNumber + 4} />
      <Day weekDay='SAB' numberDay={props.startNumber + 5} />
      <Day weekDay='DOM' numberDay={props.startNumber + 6} />
    </HStack>
  );
}
