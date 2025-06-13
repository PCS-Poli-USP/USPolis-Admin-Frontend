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
  const target = data.schedule_target;
  return (
    <Collapsable
      title={`${getScheduleWithTimeString(target)}`}
      initiallyOpen={true}
      fontWeight='normal'
      titleSize='sm'
      iconSize={'30px'}
    >
      <Flex direction={'column'} gap={'10px'} ml={'20px'}>
        <Flex direction={'column'} alignItems={'flex-start'} gap={'10px'}>
          {schedules.map((option, index) => {
            return (
              <Checkbox key={index} fontWeight={'normal'}>
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
