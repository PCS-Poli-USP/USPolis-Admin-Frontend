import { Tooltip, Text, VStack } from '@chakra-ui/react';
import { EventContentArg } from '@fullcalendar/react';
import { ClassroomEventExtendedProps } from './classroom.time.grid.interface';

export default function ClassroomTimeGridEventContent(
  eventInfo: EventContentArg,
) {
  const eventData = eventInfo.event._def;
  const extendedProps = eventData.extendedProps as ClassroomEventExtendedProps;

  return (
    <Tooltip bg='white' label={ToolTipLabel(eventInfo)}>
      <VStack
        align={'flex-start'}
        alignContent={'flex-start'}
        w={'full'}
        spacing={0}
      >
        <Text
          overflowX={'hidden'}
          textOverflow={'ellipsis'}
          size='sm'
          fontWeight={'bold'}
        >
          {`${extendedProps.type}`}
        </Text>
        <Text
          overflowX={'hidden'}
          textOverflow={'ellipsis'}
          size='sm'
          fontWeight={'bold'}
        >
          {extendedProps.name}
        </Text>
      </VStack>
    </Tooltip>
  );
}

function ToolTipLabel(eventInfo: EventContentArg) {
  const eventData = eventInfo.event._def;
  const extendedProps = eventData.extendedProps as ClassroomEventExtendedProps;

  return (
    <VStack bg='white' spacing={2} alignItems='start'>
      <Text fontSize='sm' textColor='#408080' fontWeight='bold'>
        {`${extendedProps.name}`}
      </Text>
    </VStack>
  );
}
