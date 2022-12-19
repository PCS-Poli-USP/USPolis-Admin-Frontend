import { Box, Flex, Heading, Text, Tooltip, useDisclosure, Wrap, WrapItem } from '@chakra-ui/react';
import { createPlugin, sliceEvents } from '@fullcalendar/react';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from 'components/common/dataTable.component';
import { Classrooms } from 'models/enums/clasrooms.enum';
import { EventByClassrooms } from 'models/event.model';
import { useState } from 'react';
import { Capitalize } from 'utils/formatters';
import { ClassEventsMapper, EventsByClassroomMapper } from 'utils/mappers/allocation.mapper';
import EditEventModal from './editEvent.modal';

function ClassroomsTables(props: any) {
  const events = sliceEvents(props);
  const eventsByClassrooms = EventsByClassroomMapper(events);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedClass, setselectedClass] = useState<EventByClassrooms[]>([]);

  const unallocatedClassroomData = eventsByClassrooms.find(
    ([classroom, _data]) => classroom === Classrooms.UNALLOCATED,
  )?.[1];

  function handleEventClick(data: EventByClassrooms) {
    const classEvents = ClassEventsMapper(events, data.classCode, data.subjectCode);
    setselectedClass(classEvents);
    onOpen();
  }

  function colDef(classroom: string): ColumnDef<EventByClassrooms>[] {
    return [
      {
        accessorKey: 'subjectCode',
        header: classroom,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => {
          const data = row.original;
          return (
            <Flex as='button' textAlign='start' minW={200} onClick={() => handleEventClick(row.original)}>
              <Box bg='uspolis.blue' color='white' paddingX={2} paddingY={1} marginRight={2}>
                <Text fontSize='xs'>{data.startTime}</Text>
                <Heading size='sm'>{Capitalize(data.weekday)}</Heading>
                <Text fontSize='xs'>{data.endTime}</Text>
              </Box>
              <Box paddingY={1}>
                <Heading size='sm' noOfLines={1}>
                  {data.subjectCode}
                </Heading>
                <Text>{data.classCodeText}</Text>
                <Tooltip label={data.professor}>
                  <Text>
                    {data.professor?.slice(0, 25)}
                    {data.professor?.length > 25 && '...'}
                  </Text>
                </Tooltip>
              </Box>
            </Flex>
          );
        },
      },
    ];
  }

  return (
    <>
      {unallocatedClassroomData && (
        <Flex>
          <DataTable data={unallocatedClassroomData} columns={colDef(Classrooms.UNALLOCATED)} />
        </Flex>
      )}
      <Wrap py={4}>
        <EditEventModal isOpen={isOpen} onClose={onClose} classEvents={selectedClass} />
        {eventsByClassrooms
          .filter(([classroom, _data]) => classroom !== Classrooms.UNALLOCATED)
          .map(([classroom, data]) => {
            const columns = colDef(classroom);

            return (
              <WrapItem key={classroom}>
                <DataTable data={data} columns={columns} />
              </WrapItem>
            );
          })}
      </Wrap>
    </>
  );
}

export default createPlugin({
  views: {
    eventsByClassrooms: ClassroomsTables,
  },
});
