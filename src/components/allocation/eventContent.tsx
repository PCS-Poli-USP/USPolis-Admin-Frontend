import { Heading, Stack, Text, Tooltip } from '@chakra-ui/react';
import { EventContentArg } from '@fullcalendar/react';

export default function EventContent(eventInfo: EventContentArg) {
  const eventData = eventInfo.event._def;
  const isTimeGridView = eventInfo.view.type.includes('timeGrid');

  return (
    <Tooltip label={ToolTipLabel(eventInfo)}>
      <Stack spacing={0}>
        {isTimeGridView && <Text noOfLines={1}>{eventInfo.timeText}</Text>}
        <Heading size='sm' noOfLines={1}>
          {eventInfo.event.title} - {eventData.extendedProps?.classCodeText}
        </Heading>
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
    <Stack spacing={0}>
      <Text noOfLines={1}>{eventInfo.timeText}</Text>
      <Heading size='sm' noOfLines={1}>
        {eventInfo.event.title} - {eventData.extendedProps?.classCodeText}
      </Heading>
      <Text noOfLines={1}>{eventData.extendedProps?.professor}</Text>
      <Text noOfLines={1}>
        {eventData.extendedProps?.building} {eventData.resourceIds}
      </Text>
    </Stack>
  );
}
