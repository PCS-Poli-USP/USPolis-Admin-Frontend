import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Progress,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuActivity } from 'react-icons/lu';
import PageContent from '../../components/common/PageContent';
import PageHeader from '../../components/common/PageHeader';
import useApiAccessLogs from '../../hooks/apiAccessLogs/useApiAccessLogs';
import { ApiAccessLogResponse } from '../../models/http/responses/apiAccessLog.response.models';
import { statusCodeColorScheme } from './apiStatus.utils';
import AccessLogsTab from './AccessLogsTab';
import IncidentsTab from './IncidentsTab';

const DAY_OPTIONS = [7, 14, 30, 90];

function SummaryCard() {
  const { summary, loadingSummary, getSummary } = useApiAccessLogs();
  const [days, setDays] = useState(7);

  useEffect(() => {
    getSummary(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const bars = (summary?.by_status_code ?? [])
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const max = bars.length ? Math.max(...bars.map((b) => b.count)) : 1;

  return (
    <Box
      border={'1px solid'}
      borderColor={'uspolis.lightGray'}
      borderRadius={'8px'}
      overflow={'hidden'}
    >
      <Flex
        align={'center'}
        justify={'space-between'}
        px={'20px'}
        py={'14px'}
        borderBottom={'1px solid'}
        borderColor={'uspolis.lightGray'}
      >
        <Text
          fontSize={'13px'}
          fontWeight={'bold'}
          textTransform={'uppercase'}
          letterSpacing={'0.03em'}
          color={'uspolis.gray'}
        >
          Resumo de erros
        </Text>
        <ButtonGroup size={'xs'} isAttached variant={'outline'}>
          {DAY_OPTIONS.map((d) => (
            <Button
              key={d}
              variant={days === d ? 'solid' : 'outline'}
              colorScheme={days === d ? 'blue' : 'gray'}
              onClick={() => setDays(d)}
            >
              {d}d
            </Button>
          ))}
        </ButtonGroup>
      </Flex>

      <Skeleton isLoaded={!loadingSummary}>
        <Flex direction={{ base: 'column', md: 'row' }}>
          <Flex
            direction={'column'}
            gap={'6px'}
            p={'20px'}
            minW={'220px'}
            justify={'center'}
            borderRight={{ md: '1px solid' }}
            borderBottom={{ base: '1px solid', md: 'none' }}
            borderColor={'uspolis.lightGray'}
          >
            <Text
              fontFamily={'monospace'}
              fontSize={'40px'}
              fontWeight={'bold'}
              lineHeight={1}
              color={'uspolis.red'}
            >
              {summary?.total_errors ?? 0}
            </Text>
            <Text fontSize={'13px'} color={'uspolis.gray'}>
              requisições com erro
            </Text>
            <Text fontSize={'12px'} color={'uspolis.lightGray'}>
              últimos {summary?.since_days ?? days} dias
            </Text>
          </Flex>

          <Flex direction={'column'} gap={'10px'} p={'18px'} flex={1}>
            {bars.map((bar) => (
              <Flex key={bar.status_code} align={'center'} gap={'12px'}>
                <Badge
                  colorScheme={statusCodeColorScheme(bar.status_code)}
                  minW={'44px'}
                  textAlign={'center'}
                >
                  {bar.status_code}
                </Badge>
                <Progress
                  value={(bar.count / max) * 100}
                  size={'sm'}
                  flex={1}
                  borderRadius={'4px'}
                  colorScheme={statusCodeColorScheme(bar.status_code)}
                />
                <Text
                  fontFamily={'monospace'}
                  fontSize={'12px'}
                  minW={'32px'}
                  textAlign={'right'}
                >
                  {bar.count}
                </Text>
              </Flex>
            ))}
            {bars.length === 0 && (
              <Text fontSize={'13px'} color={'uspolis.lightGray'}>
                Nenhum erro no período selecionado.
              </Text>
            )}
          </Flex>
        </Flex>
      </Skeleton>
    </Box>
  );
}

function ApiStatus() {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedLog, setSelectedLog] = useState<ApiAccessLogResponse | null>(
    null,
  );
  const { getAccessLogById } = useApiAccessLogs();

  async function handleOpenLogFromIncident(accessLogId: number) {
    setTabIndex(0);
    const log = await getAccessLogById(accessLogId);
    if (log) setSelectedLog(log);
  }

  return (
    <PageContent>
      <Flex direction={'column'} gap={'20px'} maxW={'1280px'} mx={'auto'}>
        <PageHeader
          title={'Status da API'}
          subtitle={'Logs de acesso, erros e incidentes da API do USPolis'}
          leftIcon={<LuActivity size={'32px'} />}
        />

        <SummaryCard />

        <Tabs
          index={tabIndex}
          onChange={setTabIndex}
          colorScheme={'blue'}
          variant={'line'}
        >
          <TabList>
            <Tab>Logs de acesso</Tab>
            <Tab>Incidentes</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <AccessLogsTab
                selectedLog={selectedLog}
                onSelectLog={setSelectedLog}
              />
            </TabPanel>
            <TabPanel px={0}>
              <IncidentsTab onOpenLog={handleOpenLogFromIncident} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </PageContent>
  );
}

export default ApiStatus;
