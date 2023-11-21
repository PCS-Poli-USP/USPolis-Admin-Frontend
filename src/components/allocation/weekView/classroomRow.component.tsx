import { HStack, Text, StackDivider, VStack } from '@chakra-ui/react';
import { ClassEvent } from './classEvent.component';
import { EventByClassrooms } from '../../../models/event.model';
import { EventsByWeekDay } from 'utils/mappers/allocation.mapper';
import { useEffect, useState } from 'react';


interface ClassRoomRowProps {
  classroom: string;
  events: EventByClassrooms[];
}

export function ClassRoomRow(props: ClassRoomRowProps) {
  const initialEvents: EventByClassrooms[][] = [[]];
  const [eventsByWeek, setEventsByWeek] = useState(initialEvents);

  useEffect(() => {
    if (props.events) setEventsByWeek(EventsByWeekDay(props.events));
  }, [props.events]);

  console.log("Filtrado: ", eventsByWeek);

  return (
    <HStack w='full' alignItems='start' divider={<StackDivider borderColor='gray.200' />} >
      <Text w='full' maxW='150px'>{props.classroom}</Text>
      {eventsByWeek.map((dayEvents, index) => (
        <VStack w='full'spacing='3px' key={index} >
          {dayEvents.map((event) => (
            <ClassEvent classEvent={event} />
          ))}
        </VStack>
      ))}
    </HStack>
  )
}