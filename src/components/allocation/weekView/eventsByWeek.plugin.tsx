import { VStack, StackDivider } from '@chakra-ui/react';
import { createPlugin, sliceEvents } from '@fullcalendar/react';
import { EventsByClassroomMapper } from 'utils/mappers/allocation.mapper';
import { ClassRoomRow } from './classroomRow.component';
import { WeekDaysHeader } from './weekDaysHeader.component';
import { EventByClassrooms } from 'models/event.model';

interface CalendarWeekViewProps {}

function CalendarWeekView(props: any) {
  const startNumberDay = Number(String(props.dateProfile.activeRange.start).slice(8, 10)) + 1;
  const events = sliceEvents(props);
  const eventsByClassrooms = EventsByClassroomMapper(events).sort(sortEventsByClassrooms);

  return (
    <VStack margin='20px' divider={<StackDivider borderColor='gray.200' />}>
      <WeekDaysHeader startNumber={startNumberDay} />

      {eventsByClassrooms.map((eventsByClass, index) => (
        <ClassRoomRow key={index} classroom={eventsByClass[0]} events={eventsByClass[1]} />
      ))}
    </VStack>
  );
}

function sortEventsByClassrooms(A: [string, EventByClassrooms[]], B: [string, EventByClassrooms[]]) {
  if (A[0] < B[0]) return -1;
  else if (A[0] > B[0]) return 1;
  return 0;
}

export default createPlugin({
  views: {
    eventsByWeek: CalendarWeekView,
  },
});
