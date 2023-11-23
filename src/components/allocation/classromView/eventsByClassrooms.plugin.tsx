import { Box, Flex, Heading, Text, Tooltip, useDisclosure, Wrap, WrapItem, useToast } from '@chakra-ui/react';
import { createPlugin, sliceEvents } from '@fullcalendar/react';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from 'components/common/dataTable.component';
import { Classrooms } from 'models/enums/clasrooms.enum';
import { EventByClassrooms } from 'models/event.model';
import { useEffect, useState } from 'react';
import { Capitalize } from 'utils/formatters';
import { ClassEventsMapper, EventsByClassroomMapper } from 'utils/mappers/allocation.mapper';
import EditEventModal from '../editEvent.modal';
import EventsService from 'services/events.service';

function ClassroomsTables(props: any) {
  const eventsService = new EventsService();
  const events = sliceEvents(props);
  const eventsByClassrooms = EventsByClassroomMapper(events);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedClass, setselectedClass] = useState<EventByClassrooms[]>([]);
  const [canShowToast, setCanShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const unallocatedClassroomData = eventsByClassrooms.find(
    ([classroom, _data]) => classroom === Classrooms.UNALLOCATED,
  )?.[1];

    useEffect(() => {
      if (canShowToast) {
        if (!errorMessage) toastSuccess('Alocação editada com sucesso!');
        else toastError(errorMessage);
        setCanShowToast(false);
        setErrorMessage('');
      }
    }, [canShowToast, errorMessage]);

  const toast = useToast();
  const toastSuccess = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Sucesso!',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const toastError = (message: string) => {
    toast({
      position: 'top-left',
      title: 'Erro!',
      description: message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  function handleEventClick(data: EventByClassrooms) {
    const classEvents = ClassEventsMapper(events, data.classCode, data.subjectCode);
    setselectedClass(classEvents);
    onOpen();
  }

  function handleAllocationSave(subjectCode: string, classCode: string, weekDays: string[], newClassroom: string, building: string) {
    setCanShowToast(true);
    eventsService.edit(subjectCode, classCode, weekDays, newClassroom, building)
    .then((it) => {
      setErrorMessage('');
      window.location.reload();
      // refetch data
      // TODO: create AllocationContext
    }).catch((error) => {
      setErrorMessage(`Erro ao editar alocação: ${error}`);
    });
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
                <Tooltip label='Professores'>
                  <Text>
                    {(data.professors.join().length > 25) ? data.professors[0] + '...' : data.professors.join()}
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
        <EditEventModal isOpen={isOpen} onClose={onClose} onSave={handleAllocationSave} classEvents={selectedClass} />
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
