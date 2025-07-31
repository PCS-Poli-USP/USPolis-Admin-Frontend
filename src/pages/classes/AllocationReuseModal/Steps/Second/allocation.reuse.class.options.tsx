import { Flex, Text } from '@chakra-ui/react';
import { Collapsable } from '../../../../../components/common/Collapsable';
import { AllocationClassOptions } from '../../../../../models/http/responses/allocation.response.models';
import { classNumberFromClassCode } from '../../../../../utils/classes/classes.formatter';
import AllocationReuseScheduleOptions from './allocation.reuse.schedule.options';
import { ScheduleAllocationData } from '../../allocation.reuse.modal';

interface AllocationReuseClassOptionsProps {
  data: AllocationClassOptions;
  allocationMap: Map<number, ScheduleAllocationData>;
  setAllocationMap: (map: Map<number, ScheduleAllocationData>) => void;
}

function AllocationReuseClassOptions({
  data,
  allocationMap,
  setAllocationMap,
}: AllocationReuseClassOptionsProps) {
  const hasOptions = !!data.schedule_options.some(
    (option) => option.options.length > 0,
  );
  return (
    <>
      {!hasOptions && (
        <Text
          ml={'20px'}
        >{`Turma ${classNumberFromClassCode(data.class_code)} - Não encontrou opções`}</Text>
      )}
      {hasOptions && (
        <Collapsable
          title={`Turma ${classNumberFromClassCode(data.class_code)} - Atual`}
          initiallyOpen={true}
          fontWeight='normal'
          titleSize='sm'
          iconSize={'30px'}
        >
          <Flex direction={'column'} gap={'10px'} ml={'20px'}>
            {data.schedule_options.map((option) => {
              return (
                <AllocationReuseScheduleOptions
                  key={option.schedule_target_id}
                  data={option}
                  allocationMap={allocationMap}
                  setAllocationMap={setAllocationMap}
                />
              );
            })}
          </Flex>
        </Collapsable>
      )}
    </>
  );
}

export default AllocationReuseClassOptions;
