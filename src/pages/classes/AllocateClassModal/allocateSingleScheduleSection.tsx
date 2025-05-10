import { Checkbox, Flex, Text, VStack } from '@chakra-ui/react';
import Select, { SingleValue } from 'react-select';
import useClassroomsService from '../../../hooks/API/services/useClassroomsService';
import Classroom, {
  ClassroomWithConflictCount,
} from '../../../models/common/classroom.model';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import { ScheduleResponse } from '../../../models/http/responses/schedule.response.models';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { formatClassroomForSelection } from '../../../utils/classrooms/classroom.formatter';
import { sortClassroomResponse } from '../../../utils/classrooms/classrooms.sorter';
import { Recurrence } from '../../../utils/enums/recurrence.enum';
import { WeekDay } from '../../../utils/enums/weekDays.enum';
import AllocationLogHistory from './allocationLog.history';
import { UserResponse } from '../../../models/http/responses/user.response.models';
import { UsersValidator } from '../../../utils/users/users.validator';

export interface AllocateSingleScheduleSectionRef {
  reset(): void;
  getData(): { schedule_id: number; classroom_id: number } | null;
}

interface props {
  schedule: ScheduleResponse;
  user: UserResponse;
  allowedBuildings: BuildingResponse[];
  loadingBuildings: boolean;
  initialBuildingId?: number;
}

interface BuildingOption {
  label: string;
  value: number;
}

interface ClassroomOption {
  label: string;
  value: number;
}

const AllocateSingleScheduleSection = forwardRef<
  AllocateSingleScheduleSectionRef,
  props
>(
  (
    {
      schedule,
      user,
      allowedBuildings,
      loadingBuildings,
      initialBuildingId = undefined,
    }: props,
    ref,
  ) => {
    useImperativeHandle(ref, () => ({
      reset() {
        reset();
      },
      getData(): { schedule_id: number; classroom_id: number } | null {
        if (!schedule) return null;
        if (removeAllocation)
          return {
            schedule_id: schedule.id,
            classroom_id: -1,
          };
        if (!selectedClassroom) return null;
        return {
          schedule_id: schedule.id,
          classroom_id: Number(selectedClassroom.id),
        };
      },
    }));
    // hooks
    const classroomsService = useClassroomsService();

    // data
    const [classrooms, setClassrooms] = useState<ClassroomWithConflictCount[]>(
      [],
    );

    // selectedData
    const [selectedBuilding, setSelectedBuilding] =
      useState<BuildingResponse>();
    const [selecteBuildingOption, setSelecteBuildingOption] =
      useState<BuildingOption>();
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom>();
    const [selecteClassroomOption, setSelecteClassroomOption] =
      useState<BuildingOption>();

    // loadings
    const [classroomsLoading, setClassroomsLoading] = useState(false);

    // logic
    const [removeAllocation, setRemoveAllocation] = useState<boolean>(false);
    const [resetClassroomsOnceLoaded, setResetClassroomsOnceLoaded] =
      useState(false);
    const [hasSetInitialBuilding, setHasSetInitialBuilding] = useState(false);
    const [hasConflict, setHasConflict] = useState(false);
    const [intentionalConflict, setIntentionalConflict] = useState(false);

    useEffect(() => {
      reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allowedBuildings, schedule]);

    useEffect(() => {
      if (
        !schedule.building_id &&
        !hasSetInitialBuilding &&
        initialBuildingId &&
        allowedBuildings.length > 0
      ) {
        const building = allowedBuildings.find(
          (building) => building.id === initialBuildingId,
        );
        setSelectedBuilding(building);
        setSelecteBuildingOption(
          building
            ? {
                label: building.name,
                value: building.id,
              }
            : undefined,
        );
        setHasSetInitialBuilding(true);
      }
    }, [schedule, hasSetInitialBuilding, initialBuildingId, allowedBuildings]);

    useEffect(() => {
      if (!schedule) return;
      if (resetClassroomsOnceLoaded && classrooms.length > 0) {
        const classroom = classrooms.find(
          (classroom) => classroom.id === schedule.classroom_id,
        );
        setSelectedClassroom(classroom);
        setSelecteClassroomOption(
          classroom
            ? {
                label: formatClassroomForSelection(classroom),
                value: Number(classroom.id),
              }
            : undefined,
        );
        setResetClassroomsOnceLoaded(false);
      }
    }, [schedule, resetClassroomsOnceLoaded, classrooms]);

    useEffect(() => {
      if (!selectedBuilding || !schedule) return;
      setClassroomsLoading(true);
      setSelecteClassroomOption(undefined);
      setSelectedClassroom(undefined);
      classroomsService
        .getWithConflictCount(schedule.id, selectedBuilding.id)
        .then((response) => {
          const validator = new UsersValidator(user);
          setClassrooms(
            response.data
              .filter((value) =>
                validator.checkUserClassroomPermission([Number(value.id)]),
              )
              .sort(sortClassroomResponse),
          );
        })
        .finally(() => {
          setClassroomsLoading(false);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBuilding, schedule]);

    function reset() {
      setRemoveAllocation(false);
      if (schedule) {
        if (schedule.classroom_id) {
          if (selectedBuilding?.id !== schedule.building_id)
            setResetClassroomsOnceLoaded(true);
          else {
            setSelecteClassroomOption(undefined);
            setSelectedClassroom(
              classrooms.find(
                (classroom) => classroom.id === schedule.classroom_id,
              ),
            );
          }
        } else {
          setSelectedClassroom(undefined);
          setSelecteClassroomOption(undefined);
        }
        if (schedule.building_id) {
          const building = allowedBuildings.find(
            (building) => building.id === schedule.building_id,
          );
          setSelecteBuildingOption(
            building ? { label: building.name, value: building.id } : undefined,
          );
          setSelectedBuilding(building);
        } else {
          setSelecteBuildingOption(undefined);
          setSelectedBuilding(undefined);
        }
      }
    }

    return (
      <>
        {schedule && (
          <Flex flexDir={'column'} gap={'5px'}>
            <Flex flexDir={'column'}>
              <Text>
                Recorrencia:{' '}
                <strong>{Recurrence.translate(schedule.recurrence)}</strong>
              </Text>
              {schedule.recurrence !== Recurrence.CUSTOM && (
                <Text>
                  Dia da Semana:{' '}
                  <strong>
                    {schedule.week_day !== undefined
                      ? WeekDay.translate(schedule.week_day)
                      : 'Sem dia da semana'}
                  </strong>
                </Text>
              )}
              <Text>
                Horário:{' '}
                <strong>
                  {schedule.start_time.substring(0, 5)} ~{' '}
                  {schedule.end_time.substring(0, 5)}
                </strong>
              </Text>
              <Text>
                Periodo: {schedule.start_date} ~ {schedule.end_date}
              </Text>
            </Flex>
            <VStack alignItems={'flex-start'}>
              <Flex direction={'row'} gap={'25px'} w={'100%'}>
                <Checkbox
                  colorScheme='red'
                  isChecked={removeAllocation}
                  onChange={(e) => {
                    setRemoveAllocation(e.target.checked);
                  }}
                >
                  Remover alocação
                </Checkbox>
                <Checkbox
                  hidden={!hasConflict || removeAllocation}
                  colorScheme='red'
                  isChecked={intentionalConflict}
                  onChange={(e) => {
                    setIntentionalConflict(e.target.checked);
                  }}
                >
                  Conflito intencional
                </Checkbox>
              </Flex>

              {!removeAllocation && (
                <Flex direction={'column'} gap={'5px'} w={'100%'}>
                  <Select
                    placeholder={
                      loadingBuildings
                        ? 'Carregando prédios...'
                        : 'Selecione o prédio'
                    }
                    isLoading={loadingBuildings}
                    isMulti={false}
                    value={selecteBuildingOption}
                    options={allowedBuildings.map((building) => ({
                      label: building.name,
                      value: building.id,
                    }))}
                    onChange={(option: SingleValue<BuildingOption>) => {
                      if (option) {
                        setSelecteBuildingOption(option as BuildingOption);
                        setSelectedBuilding(
                          allowedBuildings.find(
                            (building) => building.id === option?.value,
                          ),
                        );
                      } else {
                        setSelecteBuildingOption(undefined);
                        setSelectedBuilding(undefined);
                        setHasConflict(false);
                      }
                    }}
                  />
                  <Select
                    placeholder={
                      classroomsLoading
                        ? 'Carregando salas...'
                        : 'Selecione a sala'
                    }
                    isLoading={classroomsLoading}
                    options={classrooms.map((classroom) => ({
                      label: formatClassroomForSelection(classroom),
                      value: Number(classroom.id),
                    }))}
                    onChange={(option: SingleValue<ClassroomOption>) => {
                      if (option) {
                        const classroom = classrooms.find(
                          (classroom) => Number(classroom.id) === option.value,
                        );
                        setSelecteClassroomOption(option as ClassroomOption);
                        setSelectedClassroom(classroom);
                        setHasConflict(
                          classroom ? classroom.conflicts > 0 : false,
                        );
                      } else {
                        setSelecteClassroomOption(undefined);
                        setSelectedClassroom(undefined);
                        setHasConflict(false);
                      }
                    }}
                    value={selecteClassroomOption}
                    isDisabled={!selectedBuilding || classroomsLoading}
                  />
                </Flex>
              )}
              <AllocationLogHistory
                last_log={schedule.last_log}
                schedule_id={schedule.id}
              />
            </VStack>
          </Flex>
        )}
      </>
    );
  },
);

export default AllocateSingleScheduleSection;
