import { Heading, Stack, Text } from '@chakra-ui/react';
import { EventContentArg } from '@fullcalendar/core';
import { EventExtendedProps } from '../../interfaces/allocation.interfaces';
import { classNumberFromClassCode } from 'utils/classes/classes.formatter';

export default function ClassroomCalendarEventContent(
  eventInfo: EventContentArg,
) {
  const eventData = eventInfo.event._def;
  const extendedProps: EventExtendedProps = eventData.extendedProps;
  const classData = extendedProps.class_data;
  const reservationData = extendedProps.reservation_data;

  return (
    <>
      {classData ? (
        <Stack spacing={0}>
          <Text noOfLines={1} textColor={'black'}>
            {eventInfo.timeText}
          </Text>
          <Heading
            size='sm'
            alignContent={'center'}
            textColor={'black'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            noOfLines={2}
          >
            {eventInfo.event.title}
          </Heading>
          <Text noOfLines={2} textColor={'black'}>
            Turma {classNumberFromClassCode(classData.code)}
          </Text>
        </Stack>
      ) : undefined}

      {reservationData ? (
        <Stack spacing={0}>
          <Text noOfLines={2} textColor={'black'}>
            {eventInfo.timeText}
          </Text>
          <Heading
            size='sm'
            alignContent={'center'}
            textColor={'black'}
            noOfLines={5}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            h={'fit-content'}
          >
            {eventInfo.event.title}
          </Heading>
        </Stack>
      ) : undefined}
    </>
  );
}
