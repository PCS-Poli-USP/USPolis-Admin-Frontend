/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateCalendar, DayCalendarSkeleton } from '@mui/x-date-pickers';
import ServerDay from './ServerDay/serverday';
import moment, { Moment } from 'moment';
import { DateCalendarPickerProps } from './datecalendarpicker.interface';
import { Box, Flex, Text } from '@chakra-ui/react';

function DateCalendarPicker(props: DateCalendarPickerProps) {
  const currentYear = moment().year();
  const minDate = moment({ year: currentYear, month: 0, day: 1 }); // Janeiro 1º do ano atual
  const maxDate = moment({ year: currentYear + 1, month: 11, day: 31 }); // Dezembro 31 do ano atual
  return (
    <Flex direction={'column'} justify={'stretch'} h={'fit-content'}>
      <Flex direction={'row'} justify={'center'} align={'center'} gap={'5px'}>
        {props.readOnly ? (
          <Text fontSize={'sm'} fontWeight={'bold'}>
            Apenas Visualização
          </Text>
        ) : undefined}
        {props.header ? (
          <Text
            fontSize={'sm'}
            textAlign={'center'}
            justifyContent={'center'}
            fontWeight={'bold'}
          >
            {props.header}
          </Text>
        ) : undefined}
      </Flex>
      <Box h={'fit-content'} mb={0}>
        <DateCalendar
          disabled={props.disabled}
          readOnly={props.readOnly}
          minDate={props.minDate ? props.minDate : minDate}
          maxDate={props.maxDate ? props.maxDate : maxDate}
          views={['day']}
          renderLoading={() => <DayCalendarSkeleton />}
          disableHighlightToday={true}
          showDaysOutsideCurrentMonth
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              selectedDays: props.selectedDays,
              highlightedDays: props.highlightedDays,
              occupiedDays: props.occupiedDays,
              selectIcon: props.selectIcon,
              highlightIcon: props.highlightIcon,
            } as any,
          }}
          onChange={(newValue: Moment) => {
            if (props.readOnly) return;
            const date = moment(newValue).format('YYYY-MM-DD');
            props.dayClick(date);
          }}
        />
      </Box>
      <Flex
        direction={'column'}
        justify={'center'}
        align={'center'}
        gap={'2px'}
        maxW={'300px'}
      >
        {props.helpText ? (
          <>
            <Text fontSize={'sm'} noOfLines={2}>
              Clique para selecionar, clique de novo para remover.
            </Text>
          </>
        ) : undefined}
      </Flex>
    </Flex>
  );
}

export default DateCalendarPicker;
