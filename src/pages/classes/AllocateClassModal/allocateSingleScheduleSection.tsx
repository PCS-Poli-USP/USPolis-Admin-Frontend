import {
  Checkbox,
  Flex,
  Select,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import useClassroomsService from 'hooks/API/services/useClassroomsService';
import Classroom, {
  ClassroomWithConflictCount,
} from 'models/common/classroom.model';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import { ScheduleResponse } from 'models/http/responses/schedule.response.models';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { formatClassroomForSelection } from 'utils/classrooms/classroom.formatter';
import { sortClassroomResponse } from 'utils/classrooms/classrooms.sorter';
import { Recurrence } from 'utils/enums/recurrence.enum';
import { WeekDay } from 'utils/enums/weekDays.enum';
import AllocationLogHistory from './allocationLog.history';

export interface AllocateSingleScheduleSectionRef {
  reset(): void;
  getData(): { schedule_id: number; classroom_id: number } | null;
}

interface props {
  schedule: ScheduleResponse;
  allowedBuildings: BuildingResponse[];
  loadingBuildings: boolean;
  initialBuildingId?: number;
}

const AllocateSingleScheduleSection = forwardRef<
  AllocateSingleScheduleSectionRef,
  props
>(
  (
    {
      schedule,
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
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom>();
    const [removeAllocation, setRemoveAllocation] = useState<boolean>(false);

    // loadings
    const [classroomsLoading, setClassroomsLoading] = useState(false);

    // logic
    const [resetClassroomsOnceLoaded, setResetClassroomsOnceLoaded] =
      useState(false);
    const [hasSetInitialBuilding, setHasSetInitialBuilding] = useState(false);

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
        setSelectedBuilding(
          allowedBuildings.find(
            (building) => building.id === initialBuildingId,
          ),
        );
        setHasSetInitialBuilding(true);
      }
    }, [schedule, hasSetInitialBuilding, initialBuildingId, allowedBuildings]);

    useEffect(() => {
      if (!schedule) return;
      if (resetClassroomsOnceLoaded && classrooms.length > 0) {
        setSelectedClassroom(
          classrooms.find(
            (classroom) => classroom.id === schedule.classroom_id,
          ),
        );
        setResetClassroomsOnceLoaded(false);
      }
    }, [schedule, resetClassroomsOnceLoaded, classrooms]);

    useEffect(() => {
      if (!selectedBuilding || !schedule) return;
      setClassroomsLoading(true);
      classroomsService
        .getWithConflictCount(schedule.id, selectedBuilding.id)
        .then((response) => {
          setClassrooms(response.data.sort(sortClassroomResponse));
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
          else
            setSelectedClassroom(
              classrooms.find(
                (classroom) => classroom.id === schedule.classroom_id,
              ),
            );
        } else {
          setSelectedClassroom(undefined);
        }
        if (schedule.building_id) {
          setSelectedBuilding(
            allowedBuildings.find(
              (building) => building.id === schedule.building_id,
            ),
          );
        } else {
          setSelectedBuilding(undefined);
        }
      }
    }

    return (
      <>
        {schedule && (
          <Flex flexDir={'column'} gap={4}>
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
              <Checkbox
                colorScheme='red'
                isChecked={removeAllocation}
                onChange={(e) => {
                  setRemoveAllocation(e.target.checked);
                }}
              >
                Remover alocação
              </Checkbox>
              {!removeAllocation && (
                <>
                  <Select
                    placeholder='Selecione o prédio'
                    icon={loadingBuildings ? <Spinner /> : undefined}
                    onChange={(e) => {
                      setSelectedBuilding(
                        allowedBuildings.find(
                          (building) => building.id === Number(e.target.value),
                        ),
                      );
                    }}
                    value={selectedBuilding ? selectedBuilding.id : 0}
                  >
                    {allowedBuildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </Select>
                  <Select
                    placeholder='Selecione a sala'
                    icon={classroomsLoading ? <Spinner /> : undefined}
                    onChange={(e) => {
                      setSelectedClassroom(
                        classrooms.find(
                          (classroom) =>
                            Number(classroom.id) === Number(e.target.value),
                        ),
                      );
                    }}
                    value={selectedClassroom ? Number(selectedClassroom.id) : 0}
                    disabled={!selectedBuilding || classroomsLoading}
                  >
                    {classrooms.map((classroom) => (
                      <option key={classroom.id} value={Number(classroom.id)}>
                        {formatClassroomForSelection(classroom)}
                      </option>
                    ))}
                  </Select>
                </>
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
