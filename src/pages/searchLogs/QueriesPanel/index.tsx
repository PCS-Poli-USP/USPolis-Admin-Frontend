import {
  Badge,
  Button,
  ButtonGroup,
  Flex,
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
import moment from 'moment';
import { useEffect, useState } from 'react';
import { LuExternalLink } from 'react-icons/lu';
import useSearchLogs from '../../../hooks/searchLogs/useSearchLogs';
import StatTile from '../StatTile';
import { formatCount, formatShare, share } from '../format';

export const SEARCH_LOG_LIST_LIMIT = 100;

type QueryView = 'empty' | 'all' | 'unclicked';

const VIEW_LABELS: Record<QueryView, string> = {
  empty: 'Sem resultado',
  all: 'Mais buscadas',
  unclicked: 'Sem clique',
};

const VIEW_DESCRIPTIONS: Record<QueryView, string> = {
  empty:
    'Consultas que voltaram vazias pelo menos uma vez, das mais frequentes para as menos. É aqui que aparecem sinônimos que a busca não conhece, erros de digitação e dados que ainda não são públicos.',
  all: 'Consultas mais buscadas no período.',
  unclicked:
    'Consultas que encontraram resultados, mas em que ninguém abriu nenhum. Costuma indicar resultados na ordem errada ou títulos que não dizem o que a pessoa procura.',
};

const EMPTY_MESSAGES: Record<QueryView, string> = {
  empty: 'Nenhuma busca sem resultado no período.',
  all: 'Nenhuma busca registrada no período.',
  unclicked: 'Nenhuma consulta sem clique no período.',
};

interface QueriesPanelProps {
  days: number;
}

function QueriesPanel({ days }: QueriesPanelProps) {
  const { summary, loading, getSummary } = useSearchLogs();
  const [view, setView] = useState<QueryView>('empty');

  useEffect(() => {
    getSummary({
      days,
      only_empty: view === 'empty',
      only_unclicked: view === 'unclicked',
      limit: SEARCH_LOG_LIST_LIMIT,
    });
  }, [getSummary, days, view]);

  const total = summary?.total_searches ?? 0;
  const empty = summary?.empty_searches ?? 0;
  const distinct = summary?.distinct_queries ?? 0;
  const clickedQueries = summary?.clicked_queries ?? 0;
  const queries = summary?.queries ?? [];

  return (
    <Flex direction={'column'} gap={5}>
      <ButtonGroup size={'sm'} isAttached variant={'outline'}>
        {(Object.keys(VIEW_LABELS) as QueryView[]).map((key) => (
          <Button
            key={key}
            variant={view === key ? 'solid' : 'outline'}
            colorScheme={view === key ? 'blue' : 'gray'}
            aria-pressed={view === key}
            onClick={() => setView(key)}
          >
            {VIEW_LABELS[key]}
          </Button>
        ))}
      </ButtonGroup>

      <Skeleton isLoaded={!loading || !!summary} borderRadius={'lg'}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
          <StatTile
            label={'Buscas'}
            value={formatCount(total)}
            detail={`nos últimos ${summary?.since_days ?? days} dias`}
          />
          <StatTile
            label={'Consultas diferentes'}
            value={formatCount(distinct)}
          />
          <StatTile
            label={'Buscas sem resultado'}
            value={formatCount(empty)}
            detail={`${formatShare(share(empty, total))} das buscas`}
            color={empty > 0 ? 'red.500' : undefined}
          />
          <StatTile
            label={'Consultas com clique'}
            value={formatCount(clickedQueries)}
            detail={`${formatShare(share(clickedQueries, distinct))} das consultas`}
          />
        </SimpleGrid>
      </Skeleton>

      <Text fontSize={'sm'} color={'uspolis.textMuted'}>
        {VIEW_DESCRIPTIONS[view]} O registro é anônimo: só guarda a consulta
        normalizada (sem acentos e em minúsculas), o filtro, o número de
        resultados, os resultados abertos e a data.
      </Text>

      <TableContainer
        border={'1px solid'}
        borderColor={'uspolis.border'}
        borderRadius={'lg'}
        opacity={loading ? 0.6 : 1}
        aria-busy={loading}
      >
        <Table size={'sm'}>
          <Thead>
            <Tr>
              <Th>Consulta</Th>
              <Th isNumeric>Buscas</Th>
              <Th isNumeric>Sem resultado</Th>
              <Th isNumeric>Cliques</Th>
              <Th>Na última busca</Th>
              <Th>Última busca</Th>
              <Th aria-label={'Ações'} />
            </Tr>
          </Thead>
          <Tbody>
            {queries.map((q) => (
              <Tr key={q.query}>
                <Td fontFamily={'monospace'} whiteSpace={'normal'}>
                  {q.query}
                </Td>
                <Td isNumeric>{q.searches}</Td>
                <Td
                  isNumeric
                  color={q.empty_searches > 0 ? 'red.500' : undefined}
                >
                  {q.empty_searches}
                </Td>
                <Td isNumeric>{q.clicks}</Td>
                <Td>
                  {q.last_result_count === 0 ? (
                    <Badge colorScheme={'red'}>Sem resultado</Badge>
                  ) : (
                    <Badge colorScheme={'green'}>
                      {q.last_result_count}{' '}
                      {q.last_result_count === 1 ? 'resultado' : 'resultados'}
                    </Badge>
                  )}
                </Td>
                <Td>{moment(q.last_searched_at).format('DD/MM/YYYY HH:mm')}</Td>
                <Td>
                  <Tooltip label={'Ver o que a busca mostra hoje'}>
                    <IconButton
                      as={'a'}
                      href={`/public/search?q=${encodeURIComponent(q.query)}`}
                      target={'_blank'}
                      rel={'noopener noreferrer'}
                      aria-label={`Abrir "${q.query}" na busca`}
                      icon={<LuExternalLink />}
                      size={'xs'}
                      variant={'ghost'}
                    />
                  </Tooltip>
                </Td>
              </Tr>
            ))}
            {!loading && summary && queries.length === 0 && (
              <Tr>
                <Td colSpan={7} textAlign={'center'} py={8}>
                  <Text color={'uspolis.textMuted'}>
                    {EMPTY_MESSAGES[view]}
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {queries.length >= SEARCH_LOG_LIST_LIMIT && (
        <Text fontSize={'sm'} color={'uspolis.textMuted'}>
          Mostrando as {SEARCH_LOG_LIST_LIMIT} primeiras consultas.
        </Text>
      )}
    </Flex>
  );
}

export default QueriesPanel;
