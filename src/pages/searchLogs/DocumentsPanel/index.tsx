import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
  SimpleGrid,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuExternalLink } from 'react-icons/lu';
import { MdTrendingDown, MdTrendingFlat, MdTrendingUp } from 'react-icons/md';
import HelpPopover from '../../../components/common/HelpPopover';
import useSearchLogs from '../../../hooks/searchLogs/useSearchLogs';
import { SearchDocumentSort } from '../../../models/http/requests/search.request.models';
import { SearchDocumentStatResponse } from '../../../models/http/responses/search.response.models';
import { SearchEntityType } from '../../../utils/enums/searchEntityType.enum';
import StatTile from '../StatTile';
import { formatCount, formatShare, share } from '../format';

export const SEARCH_DOCUMENT_LIST_LIMIT = 100;

// Trend = recent clicks over the long-term rate: above RISING it is going
// up, below FALLING going down.
const RISING = 1.5;
const FALLING = 0.67;

const SORT_LABELS: Record<SearchDocumentSort, string> = {
  [SearchDocumentSort.CLICKS]: 'Mais abertos',
  [SearchDocumentSort.TRENDING]: 'Em alta',
};

const SORT_DESCRIPTIONS: Record<SearchDocumentSort, string> = {
  [SearchDocumentSort.CLICKS]:
    'Resultados mais abertos a partir da busca no período. CTR é a fração das vezes em que o documento apareceu entre os primeiros resultados e foi aberto.',
  [SearchDocumentSort.TRENDING]:
    'Documentos cujos cliques dos últimos dias estão acima do ritmo de costume (calculado com envelhecimento, a cada atualização do índice). Precisam de alguns cliques recentes para entrar.',
};

type Metric =
  | 'clicks'
  | 'impressions'
  | 'ctr'
  | 'positionCtr'
  | 'position'
  | 'trend';

const METRIC_HELP: Record<
  Metric,
  {
    title: string;
    question: string;
    text: string;
    formula?: string;
    note?: string;
  }
> = {
  clicks: {
    title: 'Resultados abertos',
    question: 'O que são resultados abertos?',
    text: 'Quantas vezes alguém abriu um resultado a partir da busca, na lista ou no painel de destaque.',
    note: 'Conta uma vez por pessoa, documento e dia. O servidor só aceita o clique se o documento estava mesmo nos resultados daquela busca.',
  },
  impressions: {
    title: 'Impressões',
    question: 'O que são impressões?',
    text: 'Quantas vezes o documento apareceu entre os 10 primeiros resultados de uma busca.',
    note: 'Conta uma vez por pessoa, consulta e dia. Aparecer não é sinal de interesse: é o denominador do CTR.',
  },
  ctr: {
    title: 'CTR',
    question: 'O que é CTR?',
    text: 'Taxa de cliques (click-through rate): a fração das vezes em que um resultado apareceu e foi aberto.',
    formula: 'CTR = cliques ÷ impressões',
    note: 'Ex.: 20 aberturas em 200 impressões = 10%.',
  },
  positionCtr: {
    title: 'CTR por posição',
    question: 'O que é o CTR por posição?',
    text: 'O CTR de cada posição da lista, somando todos os documentos.',
    formula: 'cliques na posição ÷ impressões na posição',
    note: 'Mostra quanto a posição sozinha atrai cliques. O ranking usa essa curva para descontar a vantagem de quem já aparece no topo.',
  },
  position: {
    title: 'Posição média do clique',
    question: 'O que é a posição média do clique?',
    text: 'Em que posição da lista, em média, estava o resultado que a pessoa abriu.',
    formula: 'média = Σ posição ÷ cliques',
    note: 'Perto de 1 quer dizer que o que as pessoas procuram já aparece no topo.',
  },
  trend: {
    title: 'Tendência',
    question: 'Como ler a tendência?',
    text: 'Ritmo recente de cliques do documento comparado com o ritmo de costume.',
    formula: 'média diária recente ÷ média diária de costume',
    note: 'As duas médias dão mais peso aos dias recentes: meia-vida de 7 dias na recente e de 30 no costume. Acima de 1,5× está subindo; abaixo de 0,67×, caindo. Atualiza a cada atualização do índice.',
  },
};

function MetricHelp({ metric }: { metric: Metric }) {
  const { title, question, text, formula, note } = METRIC_HELP[metric];
  return (
    <HelpPopover
      title={title}
      tooltip={question}
      size={'xs'}
      ariaLabel={question}
      inPortal
    >
      <Text fontSize={'sm'}>{text}</Text>
      {formula && (
        <Text
          fontSize={'sm'}
          fontFamily={'monospace'}
          my={2}
          textAlign={'center'}
        >
          {formula}
        </Text>
      )}
      {note && (
        <Text fontSize={'sm'} color={'uspolis.textMuted'} mt={formula ? 0 : 2}>
          {note}
        </Text>
      )}
    </HelpPopover>
  );
}

function formatTrend(trend: number): string {
  return `${trend.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}×`;
}

function TrendCell({ trend }: { trend: number | null }) {
  if (trend === null) return <Text color={'uspolis.textMuted'}>—</Text>;
  const [icon, color, label] =
    trend >= RISING
      ? [MdTrendingUp, 'green.500', 'subindo']
      : trend <= FALLING
        ? [MdTrendingDown, 'red.500', 'caindo']
        : [MdTrendingFlat, 'uspolis.textMuted', 'estável'];
  return (
    <Flex
      align={'center'}
      gap={1}
      color={color}
      aria-label={`${label}, ${formatTrend(trend)}`}
    >
      <Icon as={icon} boxSize={4} />
      <Text as={'span'} fontFamily={'monospace'}>
        {formatTrend(trend)}
      </Text>
    </Flex>
  );
}

function DocumentTitle({ doc }: { doc: SearchDocumentStatResponse }) {
  if (!doc.type || !doc.title) {
    return (
      <Text color={'uspolis.textMuted'}>
        {doc.doc_key}{' '}
        <Text as={'span'} fontSize={'xs'}>
          (removido do índice)
        </Text>
      </Text>
    );
  }
  return (
    <Flex align={'center'} gap={2} wrap={'wrap'}>
      <Badge variant={'subtle'}>{SearchEntityType.translate(doc.type)}</Badge>
      <Text whiteSpace={'normal'}>{doc.title}</Text>
    </Flex>
  );
}

interface DocumentsPanelProps {
  days: number;
}

function DocumentsPanel({ days }: DocumentsPanelProps) {
  const { documents, loadingDocuments, getDocuments } = useSearchLogs();
  const [sort, setSort] = useState<SearchDocumentSort>(
    SearchDocumentSort.CLICKS,
  );

  useEffect(() => {
    getDocuments({ days, sort, limit: SEARCH_DOCUMENT_LIST_LIMIT });
  }, [getDocuments, days, sort]);

  const clicks = documents?.clicks ?? 0;
  const impressions = documents?.impressions ?? 0;
  const rows = documents?.documents ?? [];
  const positions = documents?.positions ?? [];
  const meanPosition = documents?.mean_click_position ?? null;

  return (
    <Flex direction={'column'} gap={5}>
      <ButtonGroup size={'sm'} isAttached variant={'outline'}>
        {Object.values(SearchDocumentSort).map((key) => (
          <Button
            key={key}
            variant={sort === key ? 'solid' : 'outline'}
            colorScheme={sort === key ? 'blue' : 'gray'}
            aria-pressed={sort === key}
            onClick={() => setSort(key)}
          >
            {SORT_LABELS[key]}
          </Button>
        ))}
      </ButtonGroup>

      <Skeleton isLoaded={!loadingDocuments || !!documents} borderRadius={'lg'}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
          <StatTile
            label={'Resultados abertos'}
            help={<MetricHelp metric={'clicks'} />}
            value={formatCount(clicks)}
            detail={`${formatCount(documents?.distinct_documents ?? 0)} documentos diferentes`}
          />
          <StatTile
            label={'Impressões'}
            help={<MetricHelp metric={'impressions'} />}
            value={formatCount(impressions)}
            detail={'vezes entre os 10 primeiros'}
          />
          <StatTile
            label={'CTR'}
            value={formatShare(share(clicks, impressions))}
            detail={'aberturas por impressão'}
            help={<MetricHelp metric={'ctr'} />}
          />
          <StatTile
            label={'Posição média do clique'}
            help={<MetricHelp metric={'position'} />}
            value={
              meanPosition === null
                ? '—'
                : meanPosition.toLocaleString('pt-BR', {
                    maximumFractionDigits: 1,
                  })
            }
            detail={'quanto menor, melhor o ranking'}
          />
        </SimpleGrid>
      </Skeleton>

      {positions.length > 0 && (
        <Box>
          <Flex align={'center'} gap={1} mb={2}>
            <Text fontSize={'sm'} fontWeight={'semibold'}>
              CTR por posição
            </Text>
            <MetricHelp metric={'positionCtr'} />
          </Flex>
          <Flex
            gap={2}
            wrap={'wrap'}
            role={'list'}
            aria-label={'CTR por posição'}
          >
            {positions.map((p) => (
              <Box
                key={p.position}
                role={'listitem'}
                border={'1px solid'}
                borderColor={'uspolis.border'}
                borderRadius={'md'}
                px={3}
                py={1}
                fontSize={'sm'}
              >
                <Text as={'span'} color={'uspolis.textMuted'}>
                  {p.position}º{' '}
                </Text>
                <Text as={'span'} fontFamily={'monospace'}>
                  {formatShare(p.ctr)}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      )}

      <Text fontSize={'sm'} color={'uspolis.textMuted'}>
        {SORT_DESCRIPTIONS[sort]} Os cliques são anônimos e contados uma vez por
        pessoa, documento e dia.
      </Text>

      <TableContainer
        border={'1px solid'}
        borderColor={'uspolis.border'}
        borderRadius={'lg'}
        opacity={loadingDocuments ? 0.6 : 1}
        aria-busy={loadingDocuments}
      >
        <Table size={'sm'}>
          <Thead>
            <Tr>
              <Th>Documento</Th>
              <Th isNumeric>Cliques</Th>
              <Th isNumeric>Impressões</Th>
              <Th isNumeric>CTR</Th>
              <Th>
                <Flex align={'center'} gap={1}>
                  Tendência
                  <MetricHelp metric={'trend'} />
                </Flex>
              </Th>
              <Th aria-label={'Ações'} />
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((doc) => (
              <Tr key={doc.doc_key}>
                <Td whiteSpace={'normal'} minW={'240px'}>
                  <DocumentTitle doc={doc} />
                </Td>
                <Td isNumeric>{doc.clicks}</Td>
                <Td isNumeric>{doc.impressions}</Td>
                <Td isNumeric>{formatShare(doc.ctr)}</Td>
                <Td>
                  <TrendCell trend={doc.trend} />
                </Td>
                <Td>
                  {doc.title && (
                    <Tooltip label={'Ver na busca'}>
                      <IconButton
                        as={'a'}
                        href={`/public/search?q=${encodeURIComponent(
                          doc.title,
                        )}&focus=${encodeURIComponent(doc.doc_key)}`}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                        aria-label={`Ver "${doc.title}" na busca`}
                        icon={<LuExternalLink />}
                        size={'xs'}
                        variant={'ghost'}
                      />
                    </Tooltip>
                  )}
                </Td>
              </Tr>
            ))}
            {!loadingDocuments && documents && rows.length === 0 && (
              <Tr>
                <Td colSpan={6} textAlign={'center'} py={8}>
                  <Text color={'uspolis.textMuted'}>
                    {sort === SearchDocumentSort.TRENDING
                      ? 'Nenhum documento em alta agora.'
                      : 'Nenhum resultado aberto no período.'}
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}

export default DocumentsPanel;
