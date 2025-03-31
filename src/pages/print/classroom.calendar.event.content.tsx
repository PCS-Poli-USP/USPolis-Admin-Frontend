import { Heading, Stack, Text } from '@chakra-ui/react';
import { EventContentArg } from '@fullcalendar/core';
import { classNumberFromClassCode } from 'utils/classes/classes.formatter';
import { MergedEventExtendedProps } from '../allocation/pdf/ClassroomsCalendarPDF/utils';

export default function ClassroomCalendarEventContent(
  eventInfo: EventContentArg,
) {
  const eventData = eventInfo.event._def;
  const extendedProps: MergedEventExtendedProps = eventData.extendedProps;
  const data = extendedProps.merged_data;

  function getClassCode(codes: string[]): string {
    const unique = [...new Set(codes)];
    const formated = unique.map((code) => classNumberFromClassCode(code));
    return formated.join(', ');
  }

  function getUniqueSubjectCodes(codes: string[]): string[] {
    return [...new Set(codes)];
  }

  return (
    <>
      {data ? (
        <Stack spacing={0}>
          <Text noOfLines={1} textColor={'black'}>
            {eventInfo.timeText}
          </Text>
          {getUniqueSubjectCodes(data.subjects_codes).map((subjectCode) => (
            <Heading
              size='sm'
              alignContent={'center'}
              textColor={'black'}
              textOverflow={'ellipsis'}
              overflow={'hidden'}
              noOfLines={1}
            >
              {subjectCode}
            </Heading>
          ))}
          {data.classes_codes.length > 0 && (
            <Text noOfLines={2} textColor={'black'}>
              Turmas {getClassCode(data.classes_codes)}
            </Text>
          )}
          {data.titles.length > 0 &&
            data.titles.map((title) => (
              <Heading
                size='sm'
                alignContent={'center'}
                textColor={'black'}
                textOverflow={'ellipsis'}
                overflow={'hidden'}
                noOfLines={3}
              >
                {title}
              </Heading>
            ))}
        </Stack>
      ) : undefined}
    </>
  );
}
