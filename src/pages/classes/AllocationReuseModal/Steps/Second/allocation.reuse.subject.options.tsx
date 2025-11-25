import { Alert, AlertIcon, Stack, StackDivider } from '@chakra-ui/react';
import { Collapsable } from '../../../../../components/common/Collapsable';
import { AllocationReuseTargetOptions } from '../../../../../models/http/responses/allocation.response.models';
import AllocationReuseClassOptions from './allocation.reuse.class.options';
import { ScheduleAllocationData } from '../../allocation.reuse.modal';

interface AllocationReuseSubjectOptionsProps {
  data: AllocationReuseTargetOptions;
  allocationMap: Map<number, ScheduleAllocationData>;
  setAllocationMap: (map: Map<number, ScheduleAllocationData>) => void;
}

function AllocationReuseSubjectOptions({
  data,
  allocationMap,
  setAllocationMap,
}: AllocationReuseSubjectOptionsProps) {
  const classOptions = data.class_options.sort((a, b) =>
    a.class_code.localeCompare(b.class_code),
  );
  return (
    <Collapsable
      title={`${data.subject_code} - ${data.subject_name}`}
      initiallyOpen={true}
      border='1px'
      p='10px 0px 10px 0px'
    >
      <Stack
        direction={'column'}
        gap={'5px'}
        ml={'20px'}
        mb={'20px'}
        divider={<StackDivider />}
      >
        {classOptions.length > 0 &&
          classOptions.map((option) => (
            <AllocationReuseClassOptions
              data={option}
              allocationMap={allocationMap}
              setAllocationMap={setAllocationMap}
            />
          ))}
        {classOptions.length === 0 && (
          <Alert status='warning' borderRadius={'20px'} w={'calc(100% - 20px)'}>
            <AlertIcon />
            Nenhuma alocação encontrada
          </Alert>
        )}
      </Stack>
    </Collapsable>
  );
}

export default AllocationReuseSubjectOptions;
