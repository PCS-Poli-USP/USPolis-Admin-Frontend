import { Tooltip, HStack, Text, VStack, Heading, Box } from '@chakra-ui/react';
import { EventContentArg } from '@fullcalendar/react';

export default function CalendarViewEventContent(eventInfo: EventContentArg) {

  return (
    <Tooltip bg='white' label={ToolTipLabel(eventInfo)}>
      <HStack ml={3} align={'center'} w={'full'}>
        <Text
          noOfLines={1}
          overflowX={'auto'}
          textOverflow={'ellipsis'}
          size='sm'
          fontWeight={'bold'}
          align={'center'}
        >
          {eventInfo.event.title}
        </Text>
      </HStack>
    </Tooltip>
  );
}

function ToolTipLabel(eventInfo: EventContentArg) {
  const eventData = eventInfo.event._def;

  return (
    <VStack bg='white' spacing={2} alignItems='start'>
      <Text fontSize='sm' textColor='#408080' fontWeight='bold'>
        {`Criado por ${eventData.extendedProps.created_by}`}
      </Text>
    </VStack>
  );
}
