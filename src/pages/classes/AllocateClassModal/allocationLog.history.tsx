import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Flex, Skeleton, Text } from '@chakra-ui/react';
import useAllocationLog from '../../../hooks/useAllocationLog';
import { AllocationLogResponse } from '../../../models/http/responses/allocationLog.response.models';
import moment from 'moment';
import { useState } from 'react';
import { AllocationEnum } from '../../../utils/enums/allocation.enum';

interface AllocationLogHistoryProps {
  last_log?: AllocationLogResponse;
  schedule_id: number;
}

function AllocationLogHistory({
  last_log,
  schedule_id,
}: AllocationLogHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, logs, getLogs } = useAllocationLog();

  function getLogText(log: AllocationLogResponse) {
    if (log.new_building === AllocationEnum.UNALLOCATED)
      return `Desalocada - ${log.modified_by} às ${moment(
        log.modified_at,
      ).format('DD/MM/YYYY HH:mm')}`;
    return `${log.new_building}, ${log.new_classroom} - ${
      log.modified_by
    } às ${moment(log.modified_at).format('DD/MM/YYYY HH:mm')}`;
  }

  function handleLogClick() {
    if (!isOpen) {
      if (logs.length === 0) {
        getLogs(schedule_id);
      }
    }
    setIsOpen(!isOpen);
  }
  return (
    <Flex direction={'column'} maxH={'100px'} overflowY={'auto'}>
      {last_log ? (
        <Flex
          align={'center'}
          // justify={'center'}
          onClick={handleLogClick}
          gap={'5px'}
          fontWeight={'bold'}
        >
          {isOpen ? <MinusIcon /> : <AddIcon />}
          <Text>
            Última alteração: {last_log.modified_by} às{' '}
            {moment(last_log.modified_at).format('DD/MM/YYYY - HH:mm')}
          </Text>
        </Flex>
      ) : (
        <Text>Nenhum histórico de alocação</Text>
      )}
      <Skeleton isLoaded={!loading} h={'fit-content'} minH={'10px'}>
        {isOpen &&
          logs.length > 0 &&
          logs.map((log, index) => <Text key={index}>{getLogText(log)}</Text>)}
      </Skeleton>
    </Flex>
  );
}

export default AllocationLogHistory;
