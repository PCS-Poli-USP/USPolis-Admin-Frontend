import { Box, Flex, Text, VStack, Wrap } from '@chakra-ui/react';
import moment from 'moment/min/moment-with-locales';
import 'moment/locale/pt-br';
import {
  WeekDaysKeyNumber,
  WeekDaysShortDict,
} from '../../../utils/enums/weekDays.enum';

moment.locale('pt-br');

interface ClassroomTimeGridDatesProps {
  dates: string[];
  startTimes: string[];
  endTimes: string[];
  fallbackStart: string;
  fallbackEnd: string;
  selectedDate?: string;
  onSelectDate: (date: string) => void;
}

interface DateCardData {
  iso: string;
  weekday: string;
  day: string;
  fullDate: string;
  timeRange: string;
}

interface DateGroup {
  monthKey: string;
  monthLabel: string;
  items: DateCardData[];
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toHHmm(time: string): string {
  return time.substring(0, 5);
}

function groupDatesByMonth(
  dates: string[],
  startTimes: string[],
  endTimes: string[],
  fallbackStart: string,
  fallbackEnd: string,
): DateGroup[] {
  const groups = new Map<string, DateGroup>();
  dates.forEach((date, idx) => {
    const m = moment(date);
    const monthKey = `${m.year()}-${m.month()}`;
    const appWeekDay = ((m.day() + 6) % 7) as WeekDaysKeyNumber;
    if (!groups.has(monthKey)) {
      groups.set(monthKey, {
        monthKey,
        monthLabel: `${capitalize(m.format('MMMM'))} de ${m.year()}`,
        items: [],
      });
    }
    groups.get(monthKey)?.items.push({
      iso: date,
      weekday: WeekDaysShortDict[appWeekDay],
      day: m.format('DD'),
      fullDate: m.format('DD/MM/YYYY'),
      timeRange: `${toHHmm(startTimes[idx] || fallbackStart)} - ${toHHmm(endTimes[idx] || fallbackEnd)}`,
    });
  });
  return Array.from(groups.values());
}

function ClassroomTimeGridDates({
  dates,
  startTimes,
  endTimes,
  fallbackStart,
  fallbackEnd,
  selectedDate,
  onSelectDate,
}: ClassroomTimeGridDatesProps) {
  if (dates.length === 0) {
    return <Text>Nenhuma data, verifique a agenda</Text>;
  }

  const groups = groupDatesByMonth(
    dates,
    startTimes,
    endTimes,
    fallbackStart,
    fallbackEnd,
  );

  return (
    <VStack align={'flex-start'} spacing={'14px'} w={'full'}>
      <Text
        fontSize={'13px'}
        fontWeight={'bold'}
        color={'uspolis.blue'}
        textTransform={'uppercase'}
        letterSpacing={'0.04em'}
      >
        Datas e horários solicitados
      </Text>
      {groups.map((group) => (
        <VStack
          key={group.monthKey}
          align={'flex-start'}
          spacing={'8px'}
          w={'full'}
        >
          <Text fontSize={'13px'} fontWeight={'bold'} color={'uspolis.gray'}>
            {group.monthLabel}
          </Text>
          <Wrap spacing={'8px'}>
            {group.items.map((item) => {
              const selected = item.iso === selectedDate;
              return (
                <Flex
                  as={'button'}
                  key={item.iso}
                  onClick={() => onSelectDate(item.iso)}
                  align={'center'}
                  gap={'8px'}
                  bg={selected ? 'uspolis.blue' : '#F4FBFB'}
                  border={'1px solid'}
                  borderColor={
                    selected ? 'uspolis.darkBlue' : 'uspolis.lightBlue'
                  }
                  borderRadius={'8px'}
                  px={'12px'}
                  py={'8px'}
                  boxShadow={
                    selected ? '0 2px 8px rgba(64,128,128,0.35)' : 'none'
                  }
                >
                  <VStack
                    align={'center'}
                    justify={'center'}
                    spacing={0}
                    bg={selected ? 'uspolis.darkBlue' : 'uspolis.blue'}
                    color={'uspolis.white'}
                    borderRadius={'6px'}
                    w={'38px'}
                    h={'38px'}
                    flexShrink={0}
                  >
                    <Text
                      fontSize={'9px'}
                      fontWeight={'bold'}
                      textTransform={'uppercase'}
                      lineHeight={1}
                    >
                      {item.weekday}
                    </Text>
                    <Text
                      fontSize={'14px'}
                      fontWeight={'bold'}
                      lineHeight={1.2}
                    >
                      {item.day}
                    </Text>
                  </VStack>
                  <Box textAlign={'left'}>
                    <Text
                      fontSize={'12.5px'}
                      fontWeight={'bold'}
                      color={selected ? 'uspolis.white' : 'uspolis.darkBlue'}
                    >
                      {item.timeRange}
                    </Text>
                    <Text
                      fontSize={'11px'}
                      color={selected ? 'uspolis.lightBlue' : 'uspolis.gray'}
                    >
                      {item.fullDate}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </Wrap>
        </VStack>
      ))}
    </VStack>
  );
}

export default ClassroomTimeGridDates;
