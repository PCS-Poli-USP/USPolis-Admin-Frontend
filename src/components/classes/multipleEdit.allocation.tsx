import { HStack, Text, Box } from '@chakra-ui/react';
import { Select as CSelect } from '@chakra-ui/react';
import Select from 'react-select';
import { Building } from 'models/building.model';
import { Capitalize } from 'utils/formatters';
import { AvailableClassroom } from 'models/classroom.model';
import { useEffect, useState } from 'react';
import ClassroomsService from 'services/classrooms.service';
import { sortAvailableClassrooms } from 'utils/sorter';

interface MultipleEditAllocationProps {
  eventID: string;
  weekDay: string;
  startTime: string;
  endTime: string;
  buildingsList: Building[];
  building?: string;
  classroom?: string;
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
  building,
  classroom,
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

  async function setCurrentAllocation() {
    if (building && !selectedBuilding) {
      const currentBuilding = buildingsList.find(
        (build) => build.name === building,
      );
      if (currentBuilding) {
        setSelectedBuilding(currentBuilding);
        onSelectBuilding(currentBuilding?.id, eventID);

        if (classroom && !selectedClassroom) {
          try {
            const response =
              await classroomsService.getAvailableWithConflictIndicator({
                events_ids: [eventID],
                building_id: currentBuilding.id,
              });
            setAndSortAvailableClassrooms(response.data);
            setClassroomsLoading(false);

            if (response.data) {
              const currentClassroom = response.data.find(
                (cl) => cl.classroom_name === classroom,
              );
              if (currentClassroom) {
                setSelectedClassroom(currentClassroom);
                onSelectClassroom(classroom, eventID);
              }
            }
          } finally {
            setClassroomsLoading(false);
          }
        }
      }
    }
  }

  async function getAvailableClassrooms() {
    try {
      if (selectedBuilding) {
        setClassroomsLoading(true);
        await tryGetAvailableClassrooms();
      } else if (building && classroom) {
        await setCurrentAllocation();
        setClassroomsLoading(true);
      } else return;
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
    setAvailableClassrooms(value.sort(sortAvailableClassrooms));
  }

  function hasConflict() {
    if (selectedClassroom && classroom && selectedClassroom.classroom_name === classroom) return false;
    if (selectedClassroom) return selectedClassroom.conflicted;
    return false;
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
          value={
            selectedClassroom
              ? hasConflict()
                ? {
                    value: selectedClassroom.classroom_name,
                    label: `⚠️ ${selectedClassroom.classroom_name} - ${selectedClassroom.capacity}`,
                  }
                : {
                    value: selectedClassroom.classroom_name,
                    label: `${selectedClassroom.classroom_name} - ${selectedClassroom.capacity}`,
                  }
              : undefined
          }
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

      {hasConflict() && (
        <Text as={'b'} color={'yellow.500'} fontSize='sm' ml={2}>
          Esta alocação gerará conflitos
        </Text>
      )}
    </HStack>
  );
}
