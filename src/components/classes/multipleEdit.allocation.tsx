import { HStack, Text, Box } from '@chakra-ui/react';
import { Select as CSelect } from '@chakra-ui/react';
import Select from 'react-select';
import { Building } from 'models/building.model';
import { Capitalize } from 'utils/formatters';
import { ClassroomSchedule } from 'models/classroom.model';
import { useEffect, useState } from 'react';
import { WeekDaysShortText } from 'models/enums/weekDays.enum';
import { ConflictCalculator } from 'utils/conflict.calculator';

interface MultipleEditAllocationProps {
  eventID: string;
  weekDay: string;
  startTime: string;
  endTime: string;
  buildingsList: Building[];
  scheduleList: ClassroomSchedule[];
  isLoadingSchedules: boolean;
  isUpdatingSchedules: boolean;
  building?: string;
  classroom?: string;
  onSelectClassroom: (
    new_classroom: string,
    new_building: string,
    event_id: string,
    week_day: string,
    start_time: string,
    end_time: string,
    old_classroom?: string,
  ) => void;
  onRemoveClassroom: (
    classroom: string,
    building: string,
    event_id: string,
    week_day: string,
    start_time: string,
    end_time: string,
  ) => void;
  onSelectBuilding: (
    building_id: string,
    building_name: string,
    event_id: string,
  ) => void;
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
  scheduleList,
  building,
  classroom,
  isLoadingSchedules,
  isUpdatingSchedules,
  onSelectClassroom,
  onRemoveClassroom,
  onSelectBuilding,
}: MultipleEditAllocationProps) {
  const [selectedSchedule, setSelectedSchedule] = useState<ClassroomSchedule>();
  const [filteredSchedules, setFilteredSchedules] =
    useState<ClassroomSchedule[]>();

  const [selectedBuilding, setSelectedBuilding] = useState<Building>();

  const [hasConflict, setHasConflict] = useState(false);

  useEffect(() => {
    if (scheduleList.length > 0 && building && !selectedBuilding) {
      const list: ClassroomSchedule[] = [];
      scheduleList.forEach((it) => {
        if (it.building === building) list.push(it);
      });
      setFilteredSchedules(list);
    }

    if (scheduleList.length > 0 && selectedBuilding) {
      const list: ClassroomSchedule[] = [];
      scheduleList.forEach((it) => {
        if (it.building === selectedBuilding.name) list.push(it);
      });
      setFilteredSchedules(list);
    }

    if (scheduleList.length > 0 && classroom && !selectedSchedule) {
      const newSchedule = scheduleList.find(
        (schedule) => schedule.classroom_name === classroom,
      );
      setSelectedSchedule(newSchedule);
      const conflict = verifyConflict(newSchedule);
      setHasConflict(conflict);
    }

    if (scheduleList.length > 0 && selectedSchedule) {
      const newSchedule = scheduleList.find(
        (schedule) =>
          schedule.classroom_name === selectedSchedule.classroom_name,
      );
      setSelectedSchedule(newSchedule);
      const conflict = verifyConflict(newSchedule);
      setHasConflict(conflict);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    scheduleList,
    building,
    classroom,
    selectedBuilding,
    selectedSchedule,
    hasConflict,
  ]);

  useEffect(() => {
    if (buildingsList.length === 1 && !selectedBuilding) {
      const newBuilding = buildingsList[0];
      async function fetchBuilding() {
        setSelectedBuilding(newBuilding);
        onSelectBuilding(newBuilding.id, newBuilding.name, eventID);
      }
      fetchBuilding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingsList, eventID, onSelectBuilding]);

  useEffect(() => {
    if ((classroom || building) && !selectedBuilding) {
      setCurrentAllocation();
    }
    // eslint-disable-next-line
  }, [selectedBuilding]);

  async function setCurrentAllocation() {
    if (building && !selectedBuilding) {
      const currentBuilding = buildingsList.find(
        (build) => build.name === building,
      );
      if (currentBuilding) {
        setSelectedBuilding(currentBuilding);
        onSelectBuilding(currentBuilding.id, currentBuilding.name, eventID);
      }
    }
  }

  async function handleSelectBuilding(building: Building) {
    setSelectedBuilding(building);
    onSelectBuilding(building.id, building.name, eventID);
  }

  function verifyConflict(schedule: ClassroomSchedule | undefined) {
    if (schedule) {
      const times = schedule.conflict_map[weekDay as WeekDaysShortText];
      return ConflictCalculator.isTimeInTimeTupleArray(
        times,
        startTime,
        endTime,
      );
    }
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
            disabled={isLoadingSchedules}
            placeholder='Selecionar prédio'
            onChange={(event) => {
              const newBuilding = buildingsList.find(
                (it) => it.id === event.target.value,
              );
              if (newBuilding) {
                // Já estava alocado agora tem que remover do calendário antigo
                handleSelectBuilding(newBuilding);
                if (selectedBuilding && selectedSchedule)
                  onRemoveClassroom(
                    selectedSchedule.classroom_name,
                    selectedBuilding.name,
                    eventID,
                    weekDay,
                    startTime,
                    endTime,
                  );

                setSelectedSchedule(undefined);
              }
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
          isLoading={isUpdatingSchedules}
          isDisabled={
            isUpdatingSchedules || isLoadingSchedules || !selectedBuilding
          }
          value={
            selectedSchedule
              ? hasConflict
                ? {
                    value: selectedSchedule.classroom_name,
                    label: `⚠️ ${selectedSchedule.classroom_name} - ${selectedSchedule.capacity}`,
                  }
                : {
                    value: selectedSchedule.classroom_name,
                    label: `${selectedSchedule.classroom_name} - ${selectedSchedule.capacity}`,
                  }
              : null
          }
          options={
            filteredSchedules
              ? filteredSchedules.map((it) =>
                  verifyConflict(it)
                    ? {
                        value: it.classroom_name,
                        label: `⚠️ ${it.classroom_name} - ${it.capacity}`,
                      }
                    : {
                        value: it.classroom_name,
                        label: `${it.classroom_name} - ${it.capacity}`,
                      },
                )
              : undefined
          }
          onChange={(selected) => {
            const selectedClassroomOp = selected as ClassroomOption;

            const classroomSchedule = filteredSchedules
              ? filteredSchedules.find(
                  (it) => selectedClassroomOp.value === it.classroom_name,
                )
              : undefined;

            if (classroomSchedule && selectedBuilding) {
              onSelectClassroom(
                classroomSchedule.classroom_name,
                selectedBuilding.name,
                eventID,
                weekDay,
                startTime,
                endTime,
                selectedSchedule ? selectedSchedule.classroom_name : undefined,
              );
              setSelectedSchedule(classroomSchedule);
            }
          }}
        />
        {!selectedSchedule && (
          <Text color={'red'} fontSize={'sm'}>
            Selecione uma sala
          </Text>
        )}
      </Box>

      {selectedSchedule && hasConflict && (
        <Text as={'b'} color={'yellow.500'} fontSize='sm' ml={2}>
          Esta alocação gerará conflitos
        </Text>
      )}
    </HStack>
  );
}
