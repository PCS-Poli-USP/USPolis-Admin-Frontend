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
  const emptyData: ScheduleAllocationData = {
    classroom_ids: [],
    classrooms: [],
  };
  const schedules = data.options.filter((option) => !!option.classroom);
  const selected = allocationMap.get(data.schedule_target_id) || emptyData;
  const length = selected.classroom_ids.length;
  const target = data.schedule_target;

  return (
    <Collapsable
      title={`${getScheduleWithTimeString(target)} - [${length}/${data.options.length}] salas selecionadas`}
      initiallyOpen={true}
      fontWeight='normal'
      titleSize='sm'
      iconSize={'30px'}
      titleColor={length > 0 ? 'uspolis.blue' : 'red.500'}
    >
      <Flex direction={'column'} gap={'10px'} ml={'20px'}>
        <Flex direction={'column'} alignItems={'flex-start'} gap={'10px'}>
          {schedules.map((option, index) => {
            const isChecked =
              !!option.classroom_id &&
              selected.classroom_ids.includes(option.classroom_id);
            return (
              <Checkbox
                key={index}
                fontWeight={'normal'}
                isChecked={isChecked}
                onChange={(e) => {
                  const newMap = new Map(allocationMap);
                  const currentIds = new Set(
                    newMap.get(data.schedule_target_id)?.classroom_ids || [],
                  );
                  const currentClassrooms = new Set(
                    newMap.get(data.schedule_target_id)?.classrooms || [],
                  );
                  if (e.target.checked) {
                    currentIds.add(option.classroom_id as number);
                    currentClassrooms.add(option.classroom as string);
                  }
                  if (!e.target.checked) {
                    currentIds.delete(option.classroom_id as number);
                    currentClassrooms.delete(option.classroom as string);
                  }
                  newMap.set(data.schedule_target_id, {
                    classroom_ids: Array.from(currentIds),
                    classrooms: Array.from(currentClassrooms),
                  });
                  setAllocationMap(newMap);
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
