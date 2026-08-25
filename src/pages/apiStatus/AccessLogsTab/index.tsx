import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Skeleton,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useApiAccessLogs from '../../../hooks/apiAccessLogs/useApiAccessLogs';
import { ApiAccessLogFilters } from '../../../hooks/API/services/useApiAccessLogService';
import { ApiAccessLogResponse } from '../../../models/http/responses/apiAccessLog.response.models';
import { ApiSecurityLevel } from '../../../utils/enums/apiSecurityLevel.enum';
import { PageSize } from '../../../utils/enums/pageSize.enum';
import { statusCodeColorScheme, formatLogDateTime } from '../apiStatus.utils';
import AccessLogDetailDrawer from './AccessLogDetailDrawer';
import TooltipSelect from '../../../components/common/TooltipSelect';
import { CloseIcon } from '@chakra-ui/icons';

const METHOD_OPTIONS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];
const METHOD_SELECT_OPTIONS = METHOD_OPTIONS.map((m) => ({
  label: m,
  value: m,
}));
const SECURITY_SELECT_OPTIONS = ApiSecurityLevel.values().map((lv) => ({
  label: ApiSecurityLevel.translate(lv),
  value: lv,
}));

interface AccessLogsTabProps {
  selectedLog: ApiAccessLogResponse | null;
  onSelectLog: (log: ApiAccessLogResponse | null) => void;
}

function AccessLogsTab({ selectedLog, onSelectLog }: AccessLogsTabProps) {
  const { pageResponse, loading, getAccessLogs } = useApiAccessLogs();
  const [page, setPage] = useState(1);
  const [pageSize] = useState<PageSize>(PageSize.SIZE_10);
  const [filters, setFilters] = useState<ApiAccessLogFilters>({});

  useEffect(() => {
    getAccessLogs(page, pageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filters]);

  function updateFilter(patch: Partial<ApiAccessLogFilters>) {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  return (
    <Flex direction={'column'} gap={'16px'}>
      <Flex wrap={'wrap'} gap={'10px'} align={'center'} w={'100%'}>
        <NumberInput
          // placeholder={'Código de Status'}
          w={'180px'}
          min={400}
          max={599}
          value={filters.status_code ?? ''}
          onChange={(value) =>
            updateFilter({
              status_code: value ? Number(value) : undefined,
            })
          }
        >
          <NumberInputField placeholder={'Código de Status'} />
        </NumberInput>
        <Box w={'180px'}>
          <TooltipSelect
            isClearable
            placeholder={'Métodos'}
            options={METHOD_SELECT_OPTIONS}
            value={
              filters.method
                ? { label: filters.method, value: filters.method }
                : null
            }
            onChange={(option) =>
              updateFilter({ method: (option?.value as string) || undefined })
            }
          />
        </Box>
        <Box w={'220px'}>
          <TooltipSelect
            isClearable
            placeholder={'Níveis de segurança'}
            options={SECURITY_SELECT_OPTIONS}
            value={
              filters.security_level
                ? {
                    label: ApiSecurityLevel.translate(filters.security_level),
                    value: filters.security_level,
                  }
                : null
            }
            onChange={(option) =>
              updateFilter({
                security_level: option?.value as ApiSecurityLevel | undefined,
              })
            }
          />
        </Box>
        <Text fontSize={'12px'} color={'uspolis.gray'}>
          desde
        </Text>
        <Input
          type={'date'}
          w={'180px'}
          value={filters.since ?? ''}
          onChange={(e) => updateFilter({ since: e.target.value || undefined })}
        />
        <Text fontSize={'12px'} color={'uspolis.gray'}>
          até
        </Text>
        <Input
          type={'date'}
          w={'180px'}
          value={filters.until ?? ''}
          onChange={(e) => updateFilter({ until: e.target.value || undefined })}
        />
        <Spacer />
        <Button
          leftIcon={<CloseIcon />}
          variant={'outline'}
          onClick={() =>
            updateFilter({
              status_code: undefined,
              method: undefined,
              security_level: undefined,
              since: undefined,
              until: undefined,
            })
          }
        >
          Limpar filtros
        </Button>
      </Flex>

      <Skeleton isLoaded={!loading}>
        <TableContainer
          border={'1px solid'}
          borderColor={'uspolis.lightGray'}
          borderRadius={'8px'}
        >
          <Table size={'sm'}>
            <Thead>
              <Tr>
                <Th>Hora</Th>
                <Th>Método</Th>
                <Th>Endpoint</Th>
                <Th>Status</Th>
                <Th>Segurança</Th>
                <Th isNumeric>ms</Th>
                <Th>Usuário</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pageResponse.data.map((row) => (
                <Tr
                  key={row.id}
                  cursor={'pointer'}
                  _hover={{ bg: 'uspolis.lightBlue' }}
                  onClick={() => onSelectLog(row)}
                >
                  <Td
                    whiteSpace={'nowrap'}
                    fontFamily={'monospace'}
                    fontSize={'12px'}
                  >
                    {formatLogDateTime(row.timestamp)}
                  </Td>
                  <Td fontFamily={'monospace'} fontSize={'12px'}>
                    {row.method}
                  </Td>
                  <Td
                    fontFamily={'monospace'}
                    fontSize={'12px'}
                    maxW={'320px'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    whiteSpace={'nowrap'}
                  >
                    {row.endpoint}
                  </Td>
                  <Td>
                    <Badge colorScheme={statusCodeColorScheme(row.status_code)}>
                      {row.status_code}
                    </Badge>
                  </Td>
                  <Td fontSize={'12px'}>
                    {ApiSecurityLevel.translate(row.security_level)}
                  </Td>
                  <Td isNumeric fontFamily={'monospace'} fontSize={'12px'}>
                    {row.response_time_ms ?? 'N/A'}
                  </Td>
                  <Td
                    fontSize={'12px'}
                    maxW={'180px'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    whiteSpace={'nowrap'}
                  >
                    {row.user_email ?? 'N/A'}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {pageResponse.data.length === 0 && (
            <Flex justify={'center'} py={'40px'}>
              <Text color={'uspolis.lightGray'} fontSize={'13px'}>
                Nenhum log de acesso encontrado para esses filtros.
              </Text>
            </Flex>
          )}
        </TableContainer>
      </Skeleton>

      <Flex justify={'space-between'} align={'center'}>
        <Text fontSize={'12px'} color={'uspolis.gray'}>
          {pageResponse.total_items > 0
            ? `Página ${pageResponse.page} de ${pageResponse.total_pages} · ${pageResponse.total_items} itens`
            : '0 itens'}
        </Text>
        <Flex gap={'6px'}>
          <IconButton
            aria-label={'página anterior'}
            icon={<FaChevronLeft />}
            size={'sm'}
            isDisabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          />
          <IconButton
            aria-label={'próxima página'}
            icon={<FaChevronRight />}
            size={'sm'}
            isDisabled={page >= pageResponse.total_pages}
            onClick={() =>
              setPage((p) => Math.min(pageResponse.total_pages, p + 1))
            }
          />
        </Flex>
      </Flex>

      <AccessLogDetailDrawer
        isOpen={!!selectedLog}
        onClose={() => onSelectLog(null)}
        log={selectedLog}
      />
    </Flex>
  );
}

export default AccessLogsTab;
