import { Checkbox, Flex } from '@chakra-ui/react';
import { Collapsable } from '../../../../../components/common/Collapsable';
import { AllocationScheduleOptions } from '../../../../../models/http/responses/allocation.response.models';
import { getScheduleWithTimeString } from '../../../../../utils/schedules/schedule.formatter';

interface AllocationReuseScheduleOptionsProps {
  data: AllocationScheduleOptions;
  allocationMap: Map<number, number[]>;
  setAllocationMap: (map: Map<number, number[]>) => void;
}

function AllocationReuseScheduleOptions({
  data,
  allocationMap,
  setAllocationMap,
}: AllocationReuseScheduleOptionsProps) {
  const schedules = data.options.filter((option) => !!option.classroom);
  const selectedIds = allocationMap.get(data.schedule_target_id) || [];
  const target = data.schedule_target;

  return (
    <Collapsable
      title={`${getScheduleWithTimeString(target)} - [${selectedIds.length}/${data.options.length}] salas selecionadas`}
      initiallyOpen={true}
      fontWeight='normal'
      titleSize='sm'
      iconSize={'30px'}
      titleColor={selectedIds.length > 0 ? 'uspolis.blue' : 'red.500'}
    >
      <Flex direction={'column'} gap={'10px'} ml={'20px'}>
        <Flex direction={'column'} alignItems={'flex-start'} gap={'10px'}>
          {schedules.map((option, index) => {
            const isChecked = selectedIds.includes(option.id);
            return (
              <Checkbox
                key={index}
                fontWeight={'normal'}
                isChecked={isChecked}
                onChange={(e) => {
                  const newMap = new Map(allocationMap);
                  const currentIds = new Set(
                    newMap.get(data.schedule_target_id) || [],
                  );
                  if (e.target.checked) {
                    currentIds.add(option.id);
                  }
                  if (!e.target.checked) {
                    currentIds.delete(option.id);
                  }
                  newMap.set(data.schedule_target_id, Array.from(currentIds));
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
