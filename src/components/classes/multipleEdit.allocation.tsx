import {
  HStack,
  Text,
  Box,
} from '@chakra-ui/react';
import { Select as CSelect } from '@chakra-ui/react';
import Select from 'react-select';
import { Building } from 'models/building.model';
import { Capitalize } from 'utils/formatters';
import { AvailableClassroom } from 'models/classroom.model';
import { useEffect, useState } from 'react';
import ClassroomsService from 'services/classrooms.service';

interface MultipleEditAllocationProps {
  eventID: string;
  weekDay: string;
  startTime: string;
  endTime: string;
  buildingsList: Building[];
  onSelectClassroom: (classroom: string, event_id: string) => void;
  onSelectBuilding: (building_id: string, event_id: string) => void;
}

interface ClassroomOption {
  value: string;
  label: string;
}

export function MultipleEditAllocation({
  eventID,
  weekDay,
  startTime,
  endTime,
  buildingsList,
  onSelectClassroom,
  onSelectBuilding,
}: MultipleEditAllocationProps) {
  const [availableClassrooms, setAvailableClassrooms] = useState<
    AvailableClassroom[]
  >([]);
  const [selectedClassroom, setSelectedClassroom] =
    useState<AvailableClassroom>();
  const [classroomsLoading, setClassroomsLoading] = useState(false);

  const [selectedBuilding, setSelectedBuilding] = useState<Building>();

  const classroomsService = new ClassroomsService();

  useEffect(() => {
    if (buildingsList.length === 1) {
      setSelectedBuilding(buildingsList[0]);
      onSelectBuilding(buildingsList[0].id, eventID);
    }
  }, [buildingsList, eventID, onSelectBuilding]);

  useEffect(() => {
    getAvailableClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuilding]);

  async function getAvailableClassrooms() {
    if (!selectedBuilding) return;
    try {
      setClassroomsLoading(true);
      await tryGetAvailableClassrooms();
    } finally {
      setClassroomsLoading(false);
    }
  }

  async function tryGetAvailableClassrooms() {
    setSelectedClassroom(undefined);
    const response = await classroomsService.getAvailableWithConflictIndicator({
      events_ids: [eventID],
      building_id: selectedBuilding?.id!,
    });
    setAndSortAvailableClassrooms(response.data);
    setClassroomsLoading(false);
  }

  function setAndSortAvailableClassrooms(value: AvailableClassroom[]) {
    setAvailableClassrooms(
      value.sort((a, b) => {
        if (a.conflicted && !b.conflicted) return 1;
        if (!a.conflicted && b.conflicted) return -1;
        if (a.classroom_name < b.classroom_name) return -1;
        if (a.classroom_name > b.classroom_name) return 1;
        return 0;
      }),
    );
  }

  return (
    <HStack w={'full'} spacing={10} mb={4}>
      <Text w={'fit-content'} noOfLines={1} as={'b'}>{`${Capitalize(
        weekDay,
      )} - ${startTime} às ${endTime}: `}</Text>
      {buildingsList.length !== 1 && (
        <Box>
          <Text>Prédio</Text>
          <CSelect
            w={'fit-content'}
            placeholder='Selecionar prédio'
            onChange={(event) => {
              onSelectBuilding(event.target.value, eventID);
              setSelectedBuilding(
                buildingsList.find((it) => it.id === event.target.value),
              );
            }}
            value={selectedBuilding?.id}
          >
            {buildingsList.map((it) => (
              <option key={it.id} value={it.id}>
                {it.name}
              </option>
            ))}
          </CSelect>
          {!selectedBuilding && (
            <Text fontSize={'sm'} color={'red'}>
              Selecione um prédio
            </Text>
          )}
        </Box>
      )}

      <Box>
        <Text>Salas disponíveis</Text>
        <Select
          menuPosition={'fixed'}
          placeholder={'Sala - Capacidade'}
          isLoading={classroomsLoading}
          options={availableClassrooms.map((it) =>
            it.conflicted
              ? {
                  value: it.classroom_name,
                  label: `⚠️ ${it.classroom_name} - ${it.capacity}`,
                }
              : {
                  value: it.classroom_name,
                  label: `${it.classroom_name} - ${it.capacity}`,
                },
          )}
          onChange={(selected) => {
            const selectedClassroom = selected as ClassroomOption;
            setSelectedClassroom(
              availableClassrooms.find(
                (it) => selectedClassroom.value === it.classroom_name,
              ),
            );
            onSelectClassroom(selectedClassroom.value, eventID);
          }}
        />
        {!selectedClassroom && (
          <Text color={'red'} fontSize={'sm'}>
            Selecione uma sala
          </Text>
        )}
      </Box>

      {selectedClassroom?.conflicted && (
        <Text colorScheme={'yellow'} fontSize='sm' ml={4}>
          Esta alocação gerará conflitos
        </Text>
      )}
    </HStack>
  );
}
