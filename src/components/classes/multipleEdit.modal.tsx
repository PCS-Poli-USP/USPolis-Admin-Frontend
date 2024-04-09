import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Skeleton,
} from '@chakra-ui/react';
import Class from 'models/class.model';
import MultipleEditAccordion from './multipleEdit.accordion';
import { useEffect, useState } from 'react';
import { CalendarIcon } from '@chakra-ui/icons';
import { BsSearch } from 'react-icons/bs';
import EventsService from 'services/events.service';
import { ClassesBySubject } from 'utils/mappers/classes.mapper';
import { sortClassMapBySubject, sortClassroomScheduleMap } from 'utils/sorter';
import { ConflictCalculator } from 'utils/conflict.calculator';
import { ClassroomSchedule } from 'models/classroom.model';
import ClassroomsService from 'services/classrooms.service';

interface MultipleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  classes: Class[];
}

interface Allocation {
  event_id: string;
  classroom?: string;
  building_id?: string;
}

export default function MultipleEditModal({
  isOpen,
  onClose,
  onRefresh,
  classes,
}: MultipleEditModalProps) {
  const [subjectSearchValue, setSubjectSearchValue] = useState('');
  const [map, setMap] = useState<[string, Class[]][]>([]);
  const [filteredMap, setFilteredMap] = useState<[string, Class[]][]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [allocationMap, setAllocationMap] = useState<Allocation[]>([]);
  const [classroomSchedulesMap, setClassroomSchedulesMap] = useState<
    [string, string, ClassroomSchedule][]
  >([]);
  const [hasMissingData, setHasMissingData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [isUpdatingSchedules, setIsUpdatingSchedules] = useState(false);

  const eventsService = new EventsService();
  const classroomsService = new ClassroomsService();

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

  useEffect(() => {
    if (classes.length > 0) {
      const newAllocationMap: Allocation[] = [];
      classes.forEach((cl) => {
        cl.events_ids.forEach((id) => {
          newAllocationMap.push({ event_id: id });
        });
      });
      setAllocationMap(newAllocationMap);
      if (filteredClasses.length > 0)
        setFilteredMap(
          ClassesBySubject(filteredClasses).sort(sortClassMapBySubject),
        );
      else setMap(ClassesBySubject(classes));
    } else setMap([]);
  }, [classes, filteredClasses]);

  function addBuildingInAllocMap(event_id: string, building_id: string) {
    const newAllocationMap = [...allocationMap];
    newAllocationMap.forEach((alloc) => {
      if (alloc.event_id === event_id) {
        alloc.building_id = building_id;
      }
    });
    setAllocationMap(newAllocationMap);
  }

  function addClassroomInAllocMap(event_id: string, new_classroom: string) {
    const newAllocationMap = [...allocationMap];
    newAllocationMap.forEach((alloc) => {
      if (alloc.event_id === event_id) {
        alloc.classroom = new_classroom;
      }
    });
    setAllocationMap(newAllocationMap);
  }

  function removeClassroomInAllocMap(event_id: string) {
    const newAllocationMap = [...allocationMap];
    const alloc = newAllocationMap.find((alloc) => alloc.event_id === event_id);
    if (alloc) {
      delete alloc.classroom;
      setAllocationMap(newAllocationMap);
    }
  }

  function handleSelectBuilding(
    building_id: string,
    building_name: string,
    event_id: string,
  ) {
    setHasMissingData(false);
    addBuildingInAllocMap(event_id, building_id);

    // Já adicionou os calendários daquele prédio
    if (classroomSchedulesMap.find((map) => map[1] === building_name)) return;

    setIsLoadingSchedules(true);
    // O front verifica os conflitos
    classroomsService
      .getClassroomsSchedulesByBuilding(building_name)
      .then((it) => {
        const newScheduleMap = [...classroomSchedulesMap];
        it.data.forEach((schedule) => {
          ConflictCalculator.classroomHasTimeConflict(schedule);
          newScheduleMap.push([
            schedule.classroom_name,
            building_name,
            schedule,
          ]);
        });
        setClassroomSchedulesMap(newScheduleMap.sort(sortClassroomScheduleMap));
      })
      .finally(() => setIsLoadingSchedules(false));
  }

  function handleSelectClassroom(
    new_classroom: string,
    new_building: string,
    event_id: string,
    week_day: string,
    start_time: string,
    end_time: string,
    old_classroom?: string,
  ) {
    setHasMissingData(false);
    // Caso em que ele seleciona a mesma sala
    if (new_classroom === old_classroom) {
      return;
    }
    setIsUpdatingSchedules(true);
    addClassroomInAllocMap(event_id, new_classroom);

    const newClassroomSchedulesMap = [...classroomSchedulesMap];
    // Tem que remover o antigo horário e validar ele
    if (old_classroom) {
      let oldScheduleIndex = -1;
      newClassroomSchedulesMap.forEach((map, index) => {
        if (map[0] === old_classroom) {
          oldScheduleIndex = index;
        }
      });
      if (oldScheduleIndex >= 0) {
        const oldSchedule = { ...newClassroomSchedulesMap[oldScheduleIndex] };
        oldSchedule[2] = ConflictCalculator.removeTimeInClassroomSchedule(
          oldSchedule[2],
          week_day,
          start_time,
          end_time,
        );
        newClassroomSchedulesMap[oldScheduleIndex] = oldSchedule;
      }
    }

    // Atualizar o calendário da sala que foi selecionada
    let newScheduleIndex = -1;
    newClassroomSchedulesMap.forEach((map, index) => {
      if (map[0] === new_classroom && map[1] === new_building) {
        newScheduleIndex = index;
      }
    });

    if (newScheduleIndex >= 0) {
      const newScheduleMap = classroomSchedulesMap[newScheduleIndex];
      let newSchedule = { ...newScheduleMap[2] };
      newSchedule = ConflictCalculator.addTimeInClassroomSchedule(
        newSchedule,
        week_day,
        start_time,
        end_time,
      );
      newClassroomSchedulesMap[newScheduleIndex] = [
        newScheduleMap[0],
        newScheduleMap[1],
        newSchedule,
      ];

      setClassroomSchedulesMap(
        newClassroomSchedulesMap.sort(sortClassroomScheduleMap),
      );
    }
    setIsUpdatingSchedules(false);
  }

  function handleRemoveClassroom(
    classroom: string,
    building: string,
    event_id: string,
    week_day: string,
    start_time: string,
    end_time: string,
  ) {
    setHasMissingData(false);
    // Tem que remover o antigo horário e validar ele
    if (classroom && building) {
      setIsUpdatingSchedules(true);
      removeClassroomInAllocMap(event_id);
      const newClassroomSchedulesMap = [...classroomSchedulesMap];
      let oldScheduleIndex = -1;
      newClassroomSchedulesMap.forEach((map, index) => {
        if (map[0] === classroom && map[1] === building) {
          oldScheduleIndex = index;
        }
      });
      if (oldScheduleIndex >= 0) {
        const oldSchedule = { ...newClassroomSchedulesMap[oldScheduleIndex] };
        oldSchedule[2] = ConflictCalculator.removeTimeInClassroomSchedule(
          oldSchedule[2],
          week_day,
          start_time,
          end_time,
        );
        newClassroomSchedulesMap[oldScheduleIndex] = oldSchedule;
        setClassroomSchedulesMap(
          newClassroomSchedulesMap.sort(sortClassroomScheduleMap),
        );
      }
      setIsUpdatingSchedules(false);
    }
  }

  function handleAllocationClick() {
    const data = getAllocationData();
    if (
      data.events_ids.length === data.classrooms.length &&
      data.events_ids.length === data.buildings_ids.length
    ) {
      setIsLoading(true);
      eventsService
        .editManyAllocationsInManyBuildings(data)
        .then((it) => {
          toastSuccess('Alocações editadas com sucesso!');
          // refetch data
          // TODO: create AllocationContext
        })
        .catch((error) => {
          toastError(`Erro ao editar alocações: ${error}`);
        })
        .finally(() => {
          setIsLoading(false);
          onRefresh();
          onClose();
        });
    } else {
      setHasMissingData(true);
      return;
    }
  }

  function getAllocationData() {
    const events_ids: string[] = [];
    const classrooms: string[] = [];
    const buildings_ids: string[] = [];
    allocationMap.forEach((alloc) => {
      events_ids.push(alloc.event_id);
      if (alloc.classroom) classrooms.push(alloc.classroom);
      if (alloc.building_id) buildings_ids.push(alloc.building_id);
    });
    return { events_ids, classrooms, buildings_ids };
  }

  function handleCloseClick() {
    setHasMissingData(false);
    setMap([]);
    setFilteredMap([]);
    setFilteredClasses([]);
    setAllocationMap([]);
    setClassroomSchedulesMap([]);
    onClose();
  }

  function FilterSubjects(subjectValue: string) {
    if (subjectValue) {
      const filtered = classes.filter((cl) =>
        cl.subject_code.includes(subjectValue),
      );
      setFilteredClasses(filtered);
      setFilteredMap(ClassesBySubject(filteredClasses));
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCloseClick} size={'5xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edição de Turmas Selecionadas</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={2} mb={4} alignItems={'flex-start'}>
            <Text as={'b'}>Opções:</Text>
            <HStack spacing={2}>
              <InputGroup w='fit-content'>
                <InputLeftElement pointerEvents='none'>
                  <BsSearch color='gray.300' />
                </InputLeftElement>
                <Input
                  type='text'
                  placeholder='Filtrar disciplinas'
                  value={subjectSearchValue}
                  onChange={(event) => {
                    setSubjectSearchValue(event.target.value.toUpperCase());
                    FilterSubjects(event.target.value.toUpperCase());
                  }}
                />
              </InputGroup>
            </HStack>
          </VStack>

          <Skeleton isLoaded={!isLoading}>
            <MultipleEditAccordion
              subjectsMap={subjectSearchValue ? filteredMap : map}
              schedulesMap={classroomSchedulesMap}
              isLoadingSchedules={isLoadingSchedules}
              isUpdatingSchedules={isUpdatingSchedules}
              handleSelectBuilding={handleSelectBuilding}
              handleSelectClassroom={handleSelectClassroom}
              handleRemoveClassroom={handleRemoveClassroom}
            />
          </Skeleton>
        </ModalBody>

        <ModalFooter>
          <VStack>
            {hasMissingData ? (
              <Alert status={'error'}>
                <AlertIcon />
                Todas turmas selecionadas devem ser alocadas
              </Alert>
            ) : undefined}
            {hasMissingData && subjectSearchValue ? (
              <Alert status={'warning'}>
                <AlertIcon />
                Cuidado, o filtro está ativo
              </Alert>
            ) : undefined}
            <HStack spacing={2}>
              <Button
                colorScheme={'yellow'}
                leftIcon={<CalendarIcon />}
                onClick={handleAllocationClick}
                disabled={map.length === 0 || hasMissingData}
              >
                Alocar selecionados
              </Button>

              <Button colorScheme={'blue'} mr={3} onClick={handleCloseClick}>
                Fechar
              </Button>
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
