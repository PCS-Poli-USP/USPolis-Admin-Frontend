import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Flex, Text } from '@chakra-ui/react';
import { AllocationLogResponse } from 'models/http/responses/allocationLog.response.models';
import moment from 'moment';
import { useState } from 'react';
import { AllocationEnum } from 'utils/enums/allocation.enum';

interface AllocationLogHistoryProps {
  logs: AllocationLogResponse[];
}

function AllocationLogHistory({ logs }: AllocationLogHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  function getLogText(log: AllocationLogResponse) {
    if (log.new_building === AllocationEnum.UNALLOCATED)
      return `Desalocada - ${log.modified_by} às ${moment(
        log.modified_at,
      ).format('DD/MM/YYYY HH:mm')}`;
    return `${log.new_building}, ${log.new_classroom} - ${
      log.modified_by
    } às ${moment(log.modified_at).format('DD/MM/YYYY HH:mm')}`;
  }
  return (
    <Flex direction={'column'} maxH={'100px'} overflowY={'auto'}>
      {logs.length > 0 ? (
        <Flex
          align={'center'}
          // justify={'center'}
          onClick={() => setIsOpen(!isOpen)}
          gap={'5px'}
          fontWeight={'bold'}
        >
          {isOpen ? <MinusIcon /> : <AddIcon />}
          <Text>
            Última alteração: {logs[0].modified_by} às{' '}
            {moment(logs[0].modified_at).format('DD/MM/YYYY - HH:mm')}
          </Text>
        </Flex>
      ) : (
        <Text>Nenhum histórico de alocação</Text>
      )}
      {isOpen &&
        logs.map((log, index) => <Text key={index}>{getLogText(log)}</Text>)}
    </Flex>
  );
}

export default AllocationLogHistory;
