import {
  Box,
  Heading,
  Tooltip,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { EventContentArg } from '@fullcalendar/react';

export default function EventContent(eventInfo: EventContentArg) {
  const eventData = eventInfo.event._def;
  const isTimeGridView = eventInfo.view.type.includes('timeGrid');

  return (
    <Tooltip bg='white' label={ToolTipLabel(eventInfo)}>
      <Stack spacing={0}>
        {isTimeGridView && <Text noOfLines={1}>{eventInfo.timeText}</Text>}
        <Heading size='sm' alignContent={'center'} textColor={eventData.extendedProps?.has_to_be_allocated ? 'red.300' : 'white'} >{eventInfo.event.title}</Heading>
        {isTimeGridView && (
          <>
            <Text noOfLines={1}>{eventData.extendedProps?.professor}</Text>
            <Text noOfLines={1}>
              {eventData.extendedProps?.building} {eventData.resourceIds}
            </Text>
          </>
        )}
      </Stack>
    </Tooltip>
  );
}

function ToolTipLabel(eventInfo: EventContentArg) {
  const eventData = eventInfo.event._def;

  return (
    <VStack bg='white' spacing={2} w='300px' alignItems='start'>
      <Text fontSize='xl' textColor='#408080' fontWeight='bold'>
        {`${eventData.extendedProps.subject_code} - Turma ${eventData.extendedProps.class_code}`}
      </Text>
      <Box>
        <Text fontSize='xl' textColor='#408080' fontWeight='bold'>
          Professores
        </Text>
        {(eventData.extendedProps.professors as string[]).map(
          (professor, index) => (
            <Text fontSize='lg' textColor='#408080' key={index}>
              {professor}
            </Text>
          ),
        )}
      </Box>

      <Box>
        <Text fontSize='xl' textColor='#408080' fontWeight='bold'>
          Informações
        </Text>
        <Text fontSize='lg' textColor='#408080'>{`Sala: ${
          eventData.extendedProps.classroom
            ? eventData.extendedProps.classroom
            : 'NÃO ALOCADA'
        }`}</Text>
        <Text
          fontSize='lg'
          textColor='#408080'
        >{`Horário: ${eventData.extendedProps.start_time} - ${eventData.extendedProps.end_time}`}</Text>
        <Text
          fontSize='lg'
          textColor='#408080'
        >{`Inscritos: ${eventData.extendedProps.subscribers}`}</Text>
      </Box>
    </VStack>
  );
}
