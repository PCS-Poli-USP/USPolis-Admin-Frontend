import {
  Box,
  Flex,
  Heading,
  Text,
  Tooltip,
  useDisclosure,
  Wrap,
  WrapItem,
  useToast,
} from '@chakra-ui/react';
import { createPlugin, sliceEvents } from '@fullcalendar/react';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from 'components/common/dataTable.component';
import { Classrooms } from 'models/enums/clasrooms.enum';
import { EventByClassrooms } from 'models/database/event.model';
import { useEffect, useState } from 'react';
import { Capitalize } from 'utils/formatters';
import {
  ClassEventsMapper,
  EventsByClassroomMapper,
} from 'utils/mappers/allocation.mapper';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const classEvents = ClassEventsMapper(
      events,
      data.class_code,
      data.subject_code,
    );
    setselectedClass(classEvents);
    onOpen();
  }

  function handleAllocationSave(
    events_ids: string[],
    newClassroom: string,
    building_id: string,
  ) {
    setCanShowToast(true);
    eventsService
      .editManyAllocations({
        events_ids,
        classroom: newClassroom,
        building_id,
      })
      .then((it) => {
        setErrorMessage('');
        window.location.reload();
        // refetch data
        // TODO: create AllocationContext
      })
      .catch((error) => {
        setErrorMessage(`Erro ao editar alocação: ${error}`);
      });
  }

  function handleAllocationDelete(subjectCode: string, classCode: string) {
    eventsService
      .deleteClassAllocation(subjectCode, classCode)
      .then((it) => {
        toastSuccess(
          `Alocação de ${subjectCode} - ${classCode}  removida com sucesso!`,
        );
        window.location.reload();
      })
      .catch((error) => {
        toastError(
          `Erro ao remover alocação de ${subjectCode} - ${classCode}: ${error}`,
        );
      });
  }

  function colDef(classroom: string): ColumnDef<EventByClassrooms>[] {
    return [
      {
        accessorKey: 'subject_code',
        header: classroom,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => {
          const data = row.original;
          return (
            <Flex
              as='button'
              textAlign='start'
              minW={200}
              onClick={() => handleEventClick(row.original)}
            >
              <Box
                bg={'uspolis.blue'}
                color='white'
                paddingX={2}
                paddingY={1}
                marginRight={2}
              >
                <Text fontSize='xs'>{data.start_time}</Text>
                <Heading size='sm'>{Capitalize(data.week_day)}</Heading>
                <Text fontSize='xs'>{data.end_time}</Text>
              </Box>
              <Box paddingY={1}>
                <Heading
                  size='sm'
                  noOfLines={1}
                  textColor={
                    row.original.has_to_be_allocated
                      ? 'red.300'
                      : 'uspolis.blue'
                  }
                >
                  {data.subject_code}
                </Heading>
                <Text>{data.class_code_text}</Text>
                <Tooltip label='Professores'>
                  <Text>
                    {data.professors.join().length > 25
                      ? data.professors[0] + '...'
                      : data.professors.join()}
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
          <DataTable
            data={unallocatedClassroomData}
            columns={colDef(Classrooms.UNALLOCATED)}
          />
        </Flex>
      )}
      <Wrap py={4}>
        <EditEventModal
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleAllocationSave}
          onDelete={handleAllocationDelete}
          classEvents={selectedClass}
        />
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
