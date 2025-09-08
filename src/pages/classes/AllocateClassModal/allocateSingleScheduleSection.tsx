import { Checkbox, Flex, Text, VStack } from '@chakra-ui/react';
import Select, { SingleValue } from 'react-select';
import useClassroomsService from '../../../hooks/API/services/useClassroomsService';
import { ClassroomWithConflictCount } from '../../../models/http/responses/classroom.response.models';
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
import IntentionalConflictPopover from './IntentionalConflictPopover';
import TooltipSelect from '../../../components/common/TooltipSelect';
import moment from 'moment';

export interface AllocateSingleScheduleSectionRef {
  reset(): void;
  getData(): {
    schedule_id: number;
    classroom_id: number;
    intentional_conflict: boolean;
    intentional_occurrence_ids: number[];
  } | null;
}

interface props {
  schedule: ScheduleResponse;
  user: UserResponse;
  allowedBuildings: BuildingResponse[];
  loadingBuildings: boolean;
  readonly: boolean;
  readonlyData?: ReadonlyData;
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

interface ReadonlyData {
  buildingOpt: BuildingOption;
  classroomOpt: ClassroomOption;
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
      readonly,
      readonlyData,
      initialBuildingId = undefined,
    }: props,
    ref,
  ) => {
    useImperativeHandle(ref, () => ({
      reset() {
        reset();
      },
      getData(): {
        schedule_id: number;
        classroom_id: number;
        intentional_conflict: boolean;
        intentional_occurrence_ids: number[];
      } | null {
        if (!schedule) return null;
        if (readonly) return null;
        if (removeAllocation)
          return {
            schedule_id: schedule.id,
            classroom_id: -1,
            intentional_conflict: false,
            intentional_occurrence_ids: [],
          };
        if (!selectedClassroom) return null;
        return {
          schedule_id: schedule.id,
          classroom_id: Number(selectedClassroom.id),
          intentional_conflict: intentionalConflict,
          intentional_occurrence_ids: intentionalOccurrenceIds,
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
    const [selectedClassroom, setSelectedClassroom] =
      useState<ClassroomWithConflictCount>();
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
    const [intentionalOccurrenceIds, setIntentionalOccurrenceIds] = useState<
      number[]
    >([]);

    useEffect(() => {
      reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allowedBuildings, schedule, readonly]);

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
    }, [
      schedule,
      hasSetInitialBuilding,
      initialBuildingId,
      allowedBuildings,
      readonly,
    ]);

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
        setHasConflict(
          classroom ? classroom.conflicts_infos.length > 0 : false,
        );
        setResetClassroomsOnceLoaded(false);
      }
    }, [schedule, resetClassroomsOnceLoaded, classrooms, readonly]);

    useEffect(() => {
      if (!selectedBuilding || !schedule) return;
      setClassroomsLoading(true);
      setSelecteClassroomOption(undefined);
      setSelectedClassroom(undefined);
      classroomsService
        .getWithConflictCountForSchedule(selectedBuilding.id, schedule.id)
        .then((response) => {
          const validator = new UsersValidator(user);
          setClassrooms(
            response.data
              .filter(
                (value) =>
                  readonly ||
                  validator.checkUserClassroomPermission([Number(value.id)]),
              )
              .sort(sortClassroomResponse),
          );
        })
        .finally(() => {
          setClassroomsLoading(false);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBuilding, schedule, readonly]);

    function reset() {
      setRemoveAllocation(false);
      if (schedule) {
        if (schedule.classroom_id) {
          if (selectedBuilding?.id !== schedule.building_id)
            setResetClassroomsOnceLoaded(true);
          else {
            const classroom = classrooms.find(
              (classroom) => classroom.id === schedule.classroom_id,
            );
            setSelecteClassroomOption(
              classroom
                ? {
                    label: formatClassroomForSelection(classroom),
                    value: Number(classroom.id),
                  }
                : undefined,
            );
            setSelectedClassroom(classroom);
            setHasConflict(
              classroom ? classroom.conflicts_infos.length > 0 : false,
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
              {readonly && (
                <Text color={'red'}>
                  Apenas leitura, voce não possui acesso a essa sala
                </Text>
              )}
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
                Periodo: {moment(schedule.start_date).format('DD/MM/YYYY')} ~{' '}
                {moment(schedule.end_date).format('DD/MM/YYYY')}
              </Text>
            </Flex>
            <VStack alignItems={'flex-start'}>
              <Flex direction={'row'} gap={'25px'} w={'100%'} hidden={readonly}>
                <Checkbox
                  colorScheme='red'
                  isChecked={removeAllocation}
                  onChange={(e) => {
                    setRemoveAllocation(e.target.checked);
                  }}
                >
                  Remover alocação
                </Checkbox>
                <IntentionalConflictPopover
                  hidden={!hasConflict || removeAllocation}
                  classroom={selectedClassroom}
                  handleConfirm={(map, infos) => {
                    if (!infos) return;
                    const occurrences_ids: number[] = [];
                    infos.forEach((info, index) => {
                      if (map[index]) {
                        console.log(info);
                        let ids = info.unintentional_ids;
                        if (ids.length === 0) ids = info.intentional_ids;
                        occurrences_ids.push(...ids);
                      }
                    });
                    setIntentionalOccurrenceIds(occurrences_ids);
                    setIntentionalConflict(true);
                  }}
                  handleCancel={() => {
                    setIntentionalConflict(false);
                    setIntentionalOccurrenceIds([]);
                  }}
                />
              </Flex>

              {!removeAllocation && !readonly && (
                <Flex direction={'column'} gap={'5px'} w={'100%'}>
                  <Select
                    placeholder={
                      loadingBuildings
                        ? 'Carregando prédios...'
                        : 'Selecione o prédio'
                    }
                    isLoading={loadingBuildings}
                    isMulti={false}
                    isDisabled={readonly}
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
                  <TooltipSelect
                    placeholder={
                      classroomsLoading
                        ? 'Carregando salas...'
                        : 'Selecione a sala'
                    }
                    isLoading={classroomsLoading}
                    options={classrooms.map((classroom) => ({
                      value: Number(classroom.id),
                      label: formatClassroomForSelection(classroom),
                      tooltip: classroom.observation,
                    }))}
                    onChange={(option) => {
                      if (option) {
                        const classroom = classrooms.find(
                          (classroom) => Number(classroom.id) === option.value,
                        );
                        setSelecteClassroomOption(option as ClassroomOption);
                        setSelectedClassroom(classroom);
                        setHasConflict(
                          classroom
                            ? classroom.conflicts_infos.length > 0
                            : false,
                        );
                      } else {
                        setSelecteClassroomOption(undefined);
                        setSelectedClassroom(undefined);
                        setHasConflict(false);
                      }
                    }}
                    value={selecteClassroomOption}
                    isDisabled={
                      !selectedBuilding || classroomsLoading || readonly
                    }
                  />
                </Flex>
              )}

              {readonly && (
                <Flex direction={'column'} gap={'5px'} w={'100%'}>
                  <Select
                    isMulti={false}
                    isDisabled={readonly}
                    value={readonlyData ? readonlyData.buildingOpt : undefined}
                  />
                  <TooltipSelect
                    value={readonlyData ? readonlyData.classroomOpt : undefined}
                    isDisabled={readonly}
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
