import { Tooltip, HStack, Text, VStack } from '@chakra-ui/react';
import { EventContentArg } from '@fullcalendar/react';
import { CalendarEventExtendedProps } from './calendarView.modal.interface';

export default function CalendarViewEventContent(eventInfo: EventContentArg) {
  const eventData = eventInfo.event._def;
  const extendedProps = eventData.extendedProps as CalendarEventExtendedProps;

  return (
    <Tooltip bg='white' label={ToolTipLabel(eventInfo)}>
      <HStack ml={3} align={'center'} w={'full'}>
        <Text
          noOfLines={1}
          overflowX={'hidden'}
          textOverflow={'ellipsis'}
          size='sm'
          fontWeight={'bold'}
          align={'center'}
        >
          {`${eventInfo.event.title} - ${extendedProps.name}`}
        </Text>
      </HStack>
    </Tooltip>
  );
}

function ToolTipLabel(eventInfo: EventContentArg) {
  const eventData = eventInfo.event._def;
  const extendedProps = eventData.extendedProps as CalendarEventExtendedProps;

  return (
    <VStack bg='white' spacing={2} alignItems='start'>
      <Text fontSize='sm' textColor='#408080' fontWeight='bold'>
        {`${extendedProps.category_name} - ${extendedProps.name}`}
      </Text>
      <Text fontSize='sm' textColor='#408080' fontWeight='bold'>
        {`Criado por ${extendedProps.created_by}`}
      </Text>
    </VStack>
  );
}
