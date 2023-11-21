import { VStack, StackDivider } from '@chakra-ui/react';
import { createPlugin, sliceEvents } from '@fullcalendar/react';
import { EventsByClassroomMapper } from 'utils/mappers/allocation.mapper';
import { ClassRoomRow } from './weekView/classroomRow.component';
import { WeekDaysHeader } from './weekView/weekDays.component';

interface CalendarWeekViewProps {

}

function CalendarWeekView(props: any) {
  const startNumberDay = Number(String(props.dateProfile.activeRange.start).slice(8, 10)) + 1;

  const events = sliceEvents(props);
  const eventsByClassrooms = EventsByClassroomMapper(events);

  console.log(events);
  console.log(eventsByClassrooms);

  return (
    <>
      <VStack margin='20px' divider={<StackDivider borderColor='gray.200' />} >

        <WeekDaysHeader startNumber={startNumberDay} />

        {eventsByClassrooms.map((eventsByClass, index) => (
          <ClassRoomRow key={index} classroom={eventsByClass[0]} events={eventsByClass[1]}/>
        ))}

      </VStack>
    </>
  );
}

export default createPlugin({
  views: {
    eventsByWeek: CalendarWeekView,
  },
});
