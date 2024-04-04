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
    old_building?: string,
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
  onSelectClassroom,
  onSelectBuilding,
}: MultipleEditAllocationProps) {
  const [selectedSchedule, setSelectedSchedule] = useState<ClassroomSchedule>();
  const [filteredSchedules, setFilteredSchedules] =
    useState<ClassroomSchedule[]>();

  const [classroomsLoading, setClassroomsLoading] = useState(false);
  const [allocationLoading, setAllocationLoading] = useState(false);

  const [selectedBuilding, setSelectedBuilding] = useState<Building>();
  const [lastBuildingName, setLastBuildingName] = useState('');

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
        setClassroomsLoading(true);
        setSelectedBuilding(newBuilding);
        setLastBuildingName(newBuilding.name);
        onSelectBuilding(newBuilding.id, newBuilding.name, eventID);
        setClassroomsLoading(false);
      }
      fetchBuilding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingsList, eventID, onSelectBuilding]);

  useEffect(() => {
    if ((classroom || building) && !selectedBuilding && !allocationLoading) {
      setClassroomsLoading(true);
      setAllocationLoading(true);
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
        setLastBuildingName(currentBuilding.name);
        onSelectBuilding(currentBuilding.id, currentBuilding.name, eventID);
        setClassroomsLoading(false);
      }
    }
  }

  async function handleSelectBuilding(building: Building) {
    if (selectedBuilding) setLastBuildingName(selectedBuilding.name);
    setSelectedBuilding(building);
    setClassroomsLoading(true);
    onSelectBuilding(building.id, building.name, eventID);
    setClassroomsLoading(false);
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
            placeholder='Selecionar prédio'
            onChange={(event) => {
              const newBuilding = buildingsList.find(
                (it) => it.id === event.target.value,
              );
              if (newBuilding) handleSelectBuilding(newBuilding);
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
              : undefined
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
                lastBuildingName ? lastBuildingName : undefined,
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
