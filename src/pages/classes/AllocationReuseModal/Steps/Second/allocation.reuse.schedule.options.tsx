import { Checkbox, Flex } from '@chakra-ui/react';
import { Collapsable } from '../../../../../components/common/Collapsable';
import { AllocationScheduleOptions } from '../../../../../models/http/responses/allocation.response.models';
import { getScheduleWithTimeString } from '../../../../../utils/schedules/schedule.formatter';
import { ScheduleAllocationData } from '../../allocation.reuse.modal';

interface AllocationReuseScheduleOptionsProps {
  data: AllocationScheduleOptions;
  allocationMap: Map<number, ScheduleAllocationData>;
  setAllocationMap: (map: Map<number, ScheduleAllocationData>) => void;
}

function AllocationReuseScheduleOptions({
  data,
  allocationMap,
  setAllocationMap,
}: AllocationReuseScheduleOptionsProps) {
  const schedules = data.options.filter(
    (option) => !!option.classroom && !!option.classroom_id,
  );
  const target = data.schedule_target;
  const selectedMap = allocationMap.get(data.schedule_target_id);
  const selectedCount = selectedMap ? selectedMap.classroom_ids.length : 0;

  return (
    <Collapsable
      title={`${getScheduleWithTimeString(target)} ${selectedCount > 1 ? '*Existirá uma agenda por sala' : ''}`}
      initiallyOpen={true}
      fontWeight='normal'
      titleSize='sm'
      titleColor={`${selectedCount > 1 ? 'uspolis.yellow' : 'uspolis.black'}`}
      iconSize={'30px'}
    >
      <Flex direction={'column'} gap={'10px'} ml={'20px'}>
        <Flex direction={'row'} alignItems={'flex-start'} gap={'10px'}>
          {schedules.map((option, index) => {
            return (
              <Checkbox
                key={index}
                fontWeight={'normal'}
                isChecked={
                  allocationMap.get(data.schedule_target_id)
                    ? allocationMap
                        .get(data.schedule_target_id)
                        ?.classroom_ids.includes(option.classroom_id as number)
                    : false
                }
                onChange={(event) => {
                  const newMap = new Map(allocationMap);
                  if (newMap.has(data.schedule_target_id)) {
                    const allocationData = newMap.get(
                      data.schedule_target_id,
                    ) as ScheduleAllocationData;
                    const classroomIdSet = new Set(
                      allocationData.classroom_ids,
                    );
                    const classroomSet = new Set(allocationData.classrooms);

                    if (event.target.checked && allocationData) {
                      classroomSet.add(option.classroom as string);
                      classroomIdSet.add(option.classroom_id as number);
                      allocationData.classroom_ids = Array.from(classroomIdSet);
                      allocationData.classrooms = Array.from(classroomSet);
                    }

                    if (!event.target.checked) {
                      allocationData.classroom_ids = [
                        ...allocationData.classroom_ids.filter(
                          (val) => val != option.classroom_id,
                        ),
                      ];
                      allocationData.classrooms = [
                        ...allocationData.classrooms.filter(
                          (val) => val != option.classroom,
                        ),
                      ];
                    }

                    setAllocationMap(newMap);
                  }
                }}
              >
                {option.classroom}
              </Checkbox>
            );
          })}
        </Flex>
        {schedules.length === 0 && (
          <Checkbox isDisabled={true} colorScheme={'red'} fontWeight={'normal'}>
            Nenhuma alocação encontrada
          </Checkbox>
        )}
      </Flex>
    </Collapsable>
  );
}

export default AllocationReuseScheduleOptions;
