import { HStack, Text, Box } from '@chakra-ui/react';
import { Select as CSelect } from '@chakra-ui/react';
import Select from 'react-select';
import { Building } from 'models/building.model';
import { Capitalize } from 'utils/formatters';
import Classroom, { ClassroomSchedule } from 'models/classroom.model';
import { useEffect, useState } from 'react';
import ClassroomsService from 'services/classrooms.service';
import { sortClassrooms } from 'utils/sorter';

interface MultipleEditAllocationProps {
  eventID: string;
  weekDay: string;
  startTime: string;
  endTime: string;
  buildingsList: Building[];
  schedule: ClassroomSchedule;
  building?: string;
  classroom?: string;
  onSelectClassroom: (
    new_classroom: Classroom,
    old_classroom: Classroom,
    event_id: string,
    week_day?: string,
    start_time?: string,
    end_time?: string,
  ) => void;
  onSelectBuilding: (
    building_id: string,
    building_name: string,
    event_id: string,
    classrooms: Classroom[],
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
  building,
  classroom,
  schedule,
  onSelectClassroom,
  onSelectBuilding,
}: MultipleEditAllocationProps) {
  const [availableClassrooms, setAvailableClassrooms] = useState<Classroom[]>(
    [],
  );
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom>();
  const [classroomsLoading, setClassroomsLoading] = useState(false);
  const [allocationLoading, setAllocationLoading] = useState(false);

  const [selectedBuilding, setSelectedBuilding] = useState<Building>();

  const classroomsService = new ClassroomsService();

  useEffect(() => {
    if (buildingsList.length === 1 && !selectedBuilding) {
      console.log('Carregando para o caso COMUM');
      const newBuilding = buildingsList[0];
      setSelectedBuilding(newBuilding);
      async function fetchBuilding() {
        setClassroomsLoading(true);
        const response = await classroomsService.getClassroomsByBuilding(
          newBuilding.name,
        );
        setAndSortBuildingClassrooms(response.data);
        setClassroomsLoading(false);
        onSelectBuilding(
          newBuilding.id,
          newBuilding.name,
          eventID,
          response.data,
        );
      }
      fetchBuilding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingsList, eventID, onSelectBuilding]);

  // useEffect(() => {
  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedBuilding]);

  useEffect(() => {
    if (selectedBuilding && !classroomsLoading) {
      console.log('Caso de construção selecionada');
      setClassroomsLoading(true);
      setBuildingClassrooms(selectedBuilding.name);
    }
    // eslint-disable-next-line
  }, [selectedBuilding]);

  useEffect(() => {
    if ((classroom || building) && !selectedBuilding && !allocationLoading) {
      console.log('Caso de alocação definida');
      setClassroomsLoading(true);
      setAllocationLoading(true);
      setCurrentAllocation();
    }
    // eslint-disable-next-line
  }, [selectedBuilding]);

  // async function fetchData() {
  //   console.log('Chamando fetch Data');
  //   if (selectedBuilding) {
  //     console.log('Caso de construção selecionada');
  //     setClassroomsLoading(true);
  //     setBuildingClassrooms(selectedBuilding.name);
  //   } else if ((classroom || building) && !allocationLoading) {
  //     console.log('Caso de alocação definida');
  //     setClassroomsLoading(true);
  //     setAllocationLoading(true);
  //     setCurrentAllocation();
  //   }
  // }

  async function setCurrentAllocation() {
    if (building && !selectedBuilding) {
      const currentBuilding = buildingsList.find(
        (build) => build.name === building,
      );
      if (currentBuilding) {
        console.log('FAZENDO QUERY DAS SAALAS De', currentBuilding.name);
        setSelectedBuilding(currentBuilding);
        classroomsService
          .getClassroomsByBuilding(building)
          .then((response) => {
            setAndSortBuildingClassrooms(response.data);
            setClassroomsLoading(false);
            onSelectBuilding(
              currentBuilding.id,
              currentBuilding.name,
              eventID,
              response.data,
            );

            if (classroom && !selectedClassroom) {
              const currentClassroom = response.data.find(
                (cl) => cl.classroom_name === classroom,
              );

              if (currentClassroom) {
                setSelectedClassroom(currentClassroom);
                onSelectClassroom(currentClassroom, currentClassroom, eventID);
              }
            }
          })
          .finally(() => setAllocationLoading(false));
      }
    }
  }

  async function handleSelectBuilding(building: Building) {
    setSelectedBuilding(building);
    setClassroomsLoading(true);
    const response = await classroomsService.getClassroomsByBuilding(
      building.name,
    );
    setAndSortBuildingClassrooms(response.data);
    setClassroomsLoading(false);
    onSelectBuilding(building.id, building.name, eventID, response.data);
  }

  async function setBuildingClassrooms(building: string) {
    const response = await classroomsService
      .getClassroomsByBuilding(building)
      .finally(() => setClassroomsLoading(false));
    setAndSortBuildingClassrooms(response.data);
  }

  function setAndSortBuildingClassrooms(value: Classroom[]) {
    setAvailableClassrooms(value.sort(sortClassrooms));
  }

  function hasConflict() {
    if (
      selectedClassroom &&
      classroom &&
      selectedClassroom.classroom_name === classroom
    )
      return false;
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
            true
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
            const selectedClassroomOp = selected as ClassroomOption;
            const classroom = availableClassrooms.find(
              (it) => selectedClassroomOp.value === it.classroom_name,
            );
            if (classroom) {
              onSelectClassroom(
                classroom,
                selectedClassroom ? selectedClassroom : classroom,
                eventID,
                weekDay,
                startTime,
                endTime,
              );
              setSelectedClassroom(classroom);
            }
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
