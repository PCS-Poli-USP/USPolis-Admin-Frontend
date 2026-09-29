import {
  Badge,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Select,
  Skeleton,
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
import useApiIncidentReports from '../../../hooks/apiIncidentReports/useApiIncidentReports';
import { ApiIncidentReportFilters } from '../../../hooks/API/services/useApiIncidentReportService';
import { IncidentReportLevel } from '../../../utils/enums/incidentReportLevel.enum';
import { IncidentReportStatus } from '../../../utils/enums/incidentReportStatus.enum';
import { PageSize } from '../../../utils/enums/pageSize.enum';
import { statusCodeColorScheme, formatLogDateTime } from '../apiStatus.utils';

interface IncidentsTabProps {
  onOpenLog: (accessLogId: number) => void;
}

function IncidentsTab({ onOpenLog }: IncidentsTabProps) {
  const { pageResponse, loading, getIncidents, updateIncidentStatus } =
    useApiIncidentReports();
  const [page, setPage] = useState(1);
  const [pageSize] = useState<PageSize>(PageSize.SIZE_10);
  const [filters, setFilters] = useState<ApiIncidentReportFilters>({});

  useEffect(() => {
    getIncidents(page, pageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filters]);

  function updateFilter(patch: Partial<ApiIncidentReportFilters>) {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  async function handleChangeStatus(id: number, status: IncidentReportStatus) {
    const updated = await updateIncidentStatus(id, status);
    if (updated) getIncidents(page, pageSize, filters);
  }

  return (
    <Flex direction={'column'} gap={'16px'}>
      <Flex wrap={'wrap'} gap={'10px'} align={'center'}>
        <Select
          w={'200px'}
          size={'sm'}
          value={filters.status ?? ''}
          onChange={(e) =>
            updateFilter({
              status: (e.target.value || undefined) as IncidentReportStatus,
            })
          }
        >
          <option value=''>Todos os status</option>
          {IncidentReportStatus.values().map((s) => (
            <option key={s} value={s}>
              {IncidentReportStatus.translate(s)}
            </option>
          ))}
        </Select>
        <Select
          w={'200px'}
          size={'sm'}
          value={filters.level ?? ''}
          onChange={(e) =>
            updateFilter({
              level: (e.target.value || undefined) as IncidentReportLevel,
            })
          }
        >
          <option value=''>Todas as severidades</option>
          {IncidentReportLevel.values().map((lv) => (
            <option key={lv} value={lv}>
              {IncidentReportLevel.translate(lv)}
            </option>
          ))}
        </Select>
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
                <Th>ID</Th>
                <Th>Nível</Th>
                <Th>Log vinculado</Th>
                <Th>Descrição</Th>
                <Th>Criado</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pageResponse.data.map((incident) => (
                <Tr key={incident.id}>
                  <Td fontFamily={'monospace'} fontSize={'12px'}>
                    #{incident.id}
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={IncidentReportLevel.getColorScheme(
                        incident.level,
                      )}
                    >
                      {IncidentReportLevel.translate(incident.level)}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex align={'center'} gap={'8px'}>
                      <Badge
                        colorScheme={statusCodeColorScheme(
                          incident.access_log_status_code,
                        )}
                      >
                        {incident.access_log_status_code}
                      </Badge>
                      <Text
                        as={'button'}
                        onClick={() => onOpenLog(incident.access_log_id)}
                        fontFamily={'monospace'}
                        fontSize={'12px'}
                        color={'uspolis.blue'}
                        textDecoration={'underline'}
                        maxW={'220px'}
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
                        whiteSpace={'nowrap'}
                      >
                        {incident.access_log_endpoint}
                      </Text>
                    </Flex>
                  </Td>
                  <Td fontSize={'13px'} minW={'220px'}>
                    {incident.description}
                  </Td>
                  <Td
                    whiteSpace={'nowrap'}
                    fontFamily={'monospace'}
                    fontSize={'12px'}
                  >
                    {formatLogDateTime(incident.created_at)}
                  </Td>
                  <Td>
                    <ButtonGroup size={'xs'} isAttached variant={'outline'}>
                      {IncidentReportStatus.values().map((s) => (
                        <Button
                          key={s}
                          variant={incident.status === s ? 'solid' : 'outline'}
                          colorScheme={
                            incident.status === s
                              ? IncidentReportStatus.getColorScheme(s)
                              : 'gray'
                          }
                          onClick={() => handleChangeStatus(incident.id, s)}
                        >
                          {IncidentReportStatus.translate(s)}
                        </Button>
                      ))}
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {pageResponse.data.length === 0 && (
            <Flex justify={'center'} py={'40px'}>
              <Text color={'uspolis.lightGray'} fontSize={'13px'}>
                Nenhum incidente encontrado para esses filtros.
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
    </Flex>
  );
}

export default IncidentsTab;
