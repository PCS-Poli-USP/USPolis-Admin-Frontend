import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Image,
  Progress,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuActivity } from 'react-icons/lu';
import PageHeader from '../../components/common/PageHeader';
import useApiAccessLogs from '../../hooks/apiAccessLogs/useApiAccessLogs';
import { ApiAccessLogResponse } from '../../models/http/responses/apiAccessLog.response.models';
import { statusCodeColorScheme } from './apiStatus.utils';
import AccessLogsTab from './AccessLogsTab';
import IncidentsTab from './IncidentsTab';
import Logo from '../../assets/uspolis.logo.png';
import ApiStatusPageContent from './ApiStatusPageContent';

const DAY_OPTIONS = [1, 7, 15, 31];

// TESTE: tratamento de fundo "Aurora" (opção 1C do design de explorações de
// fundo) aplicado só nesta página para avaliação visual — não é definitivo.
const AURORA_BACKGROUND_LIGHT =
  'radial-gradient(820px 660px at -10% -24%, rgba(64,128,128,.24), rgba(64,128,128,.09) 46%, transparent 78%), ' +
  'radial-gradient(620px 520px at 96% 6%, rgba(180,244,244,.55), rgba(180,244,244,.22) 40%, transparent 85%), ' +
  'radial-gradient(640px 460px at 62% 114%, rgba(26,83,92,.14), transparent 74%), #F7FBFB';

// Contraparte escura: mesmo layout de camadas, tons mais contidos (o brilho
// ciano vira sutil em vez de neon) sobre uma base escura com tonalidade teal.
const AURORA_BACKGROUND_DARK =
  'radial-gradient(820px 660px at -10% -24%, rgba(64,128,128,.38), rgba(64,128,128,.12) 46%, transparent 78%), ' +
  'radial-gradient(620px 520px at 96% 6%, rgba(180,244,244,.16), rgba(180,244,244,.05) 40%, transparent 85%), ' +
  'radial-gradient(640px 460px at 62% 114%, rgba(26,83,92,.45), transparent 74%), #16201f';

function SummaryCard() {
  const { summary, loadingSummary, getSummary } = useApiAccessLogs();
  const [days, setDays] = useState(7);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

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
      bg={isDark ? 'rgba(38,38,38,.55)' : 'rgba(255,255,255,.7)'}
      backdropFilter={'blur(10px)'}
      border={
        isDark
          ? '1px solid rgba(255,255,255,.12)'
          : '1px solid rgba(255,255,255,.85)'
      }
      boxShadow={'0 6px 20px rgba(26,83,92,.1)'}
      borderRadius={'12px'}
      overflow={'hidden'}
    >
      <Flex
        align={'center'}
        justify={'space-between'}
        px={'20px'}
        py={'14px'}
        borderBottom={'1px solid'}
        borderColor={isDark ? 'rgba(255,255,255,.12)' : 'rgba(38,38,38,.1)'}
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
            borderColor={isDark ? 'rgba(255,255,255,.12)' : 'rgba(38,38,38,.1)'}
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
            <Text fontSize={'12px'} color={'uspolis.gray'}>
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
              <Text fontSize={'13px'} color={'uspolis.gray'}>
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
  const { colorMode } = useColorMode();
  const background =
    colorMode === 'dark' ? AURORA_BACKGROUND_DARK : AURORA_BACKGROUND_LIGHT;

  async function handleOpenLogFromIncident(accessLogId: number) {
    setTabIndex(0);
    const log = await getAccessLogById(accessLogId);
    if (log) setSelectedLog(log);
  }

  return (
    <ApiStatusPageContent background={background}>
      <Flex
        direction={'column'}
        align={'center'}
        position={'absolute'}
        left={'50%'}
        top={'50%'}
        transform={'translate(-50%, -50%)'}
        opacity={0.07}
        pointerEvents={'none'}
      >
        <Image src={Logo} alt={''} w={'260px'} />
        <Text
          fontSize={'40px'}
          fontWeight={'bold'}
          letterSpacing={'0.04em'}
          color={'uspolis.blue'}
          mt={'8px'}
        >
          USPolis
        </Text>
      </Flex>

      <Flex
        direction={'column'}
        gap={'20px'}
        maxW={'1280px'}
        mx={'auto'}
        position={'relative'}
      >
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
    </ApiStatusPageContent>
  );
}

export default ApiStatus;
