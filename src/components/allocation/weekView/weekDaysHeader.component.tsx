import { Box, HStack, StackDivider, Text } from '@chakra-ui/react';
import { Day } from './day.component';
import { WeekDaysDict } from 'models/enums/weekDays.enum';

interface DaysHeaderProps {
  startDate: Date;
}

type WeekDaysKeyNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6

export function WeekDaysHeader(props: DaysHeaderProps) {
  const currentDate: Date = new Date(props.startDate);
  const daysNumber: number[] = [];

  for (let i = 0; i < 7; i++) {
    daysNumber.push(currentDate.getDate() + 1);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <HStack w='full' divider={<StackDivider borderColor='gray.200' />}>
      <Box w='full' maxW='150px'>
        <Text fontWeight='bold' size='xl '>
          Salas
        </Text>
      </Box>
      {daysNumber.map((value, index) => (
        <Day weekDay={WeekDaysDict[index as WeekDaysKeyNumber ].slice(0, 3).toUpperCase()} numberDay={value} key={index} />
      ))}
    </HStack>
  );
}
