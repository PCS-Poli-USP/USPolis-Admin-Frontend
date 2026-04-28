import {
  Heading,
  Stack,
  Text,
  Flex,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { EventContentArg } from '@fullcalendar/core';
import { TimetableEventExtendedProps } from '../timetable.interface';
import { classNumberFromClassCode } from '../../../utils/classes/classes.formatter';
import { CloseIcon } from '@chakra-ui/icons';

export default function TimetableEventContent(
  eventInfo: EventContentArg,
  handleRemoveClass: (classId: number) => void,
) {
  const eventData = eventInfo.event._def;
  const extendedProps: TimetableEventExtendedProps = eventData.extendedProps;
  const scheduleData = extendedProps.scheduleData;
  const classData = extendedProps.classData;
  const allocated = scheduleData?.allocated;
  const subjectCode =
    extendedProps.subjectCode || classData?.subject_code || 'N/A';
  const classId = extendedProps.classId || classData?.id || 0;

  return (
    <>
      {scheduleData ? (
        <Stack spacing={0} overflowY={'hidden'}>
          <Text noOfLines={1}>{eventInfo.timeText}</Text>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Heading
              size='sm'
              alignContent={'center'}
              textColor={scheduleData.allocated ? 'white' : 'red.300'}
            >
              {subjectCode} Turma{' '}
              {scheduleData.class_code
                ? classNumberFromClassCode(scheduleData.class_code)
                : ''}
            </Heading>
            <Tooltip label='Remover turma da grade'>
              <IconButton
                aria-label='remove-class-from-timetable'
                icon={<CloseIcon />}
                size={'xs'}
                onClick={() => {
                  if (classId) {
                    handleRemoveClass(classId);
                  }
                }}
              />
            </Tooltip>
          </Flex>
          <Text noOfLines={1}>
            {'Professores: '}
            {classData?.professors.join(', ')}
          </Text>
          <Text noOfLines={1}>
            {allocated
              ? `Local: ${scheduleData.building} - ${scheduleData.classroom}`
              : 'Local: Não alocado'}
          </Text>
        </Stack>
      ) : undefined}

      {!scheduleData && (
        <Heading size='sm' alignContent={'center'} textColor={'white'}>
          {eventInfo.event.title}
        </Heading>
      )}
    </>
  );
}
