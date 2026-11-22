import {
  Badge,
  Box,
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
import { MdManageSearch } from 'react-icons/md';
import PageContent from '../../components/common/PageContent';
import PageHeader from '../../components/common/PageHeader';
import useSearchLogs from '../../hooks/searchLogs/useSearchLogs';

// Windows offered; the backend caps them at SEARCH_LOG_RETENTION_DAYS.
export const SEARCH_LOG_DAY_OPTIONS = [7, 30, 90, 365];
export const SEARCH_LOG_LIST_LIMIT = 100;

type View = 'all' | 'empty';

function StatTile({
  label,
  value,
  detail,
  color,
}: {
  label: string;
  value: number;
  detail?: string;
  color?: string;
}) {
  return (
    <Box
      border={'1px solid'}
      borderColor={'uspolis.border'}
      borderRadius={'lg'}
      p={4}
      bg={'uspolis.white'}
    >
      <Text fontSize={'sm'} color={'uspolis.textMuted'}>
        {label}
      </Text>
      <Text
        fontSize={'3xl'}
        fontWeight={'bold'}
        lineHeight={1.2}
        color={color}
        fontFamily={'monospace'}
      >
        {value.toLocaleString('pt-BR')}
      </Text>
      {detail && (
        <Text fontSize={'xs'} color={'uspolis.textMuted'}>
          {detail}
        </Text>
      )}
    </Box>
  );
}

function SearchLogs() {
  const { summary, loading, getSummary } = useSearchLogs();
  const [days, setDays] = useState(30);
  const [view, setView] = useState<View>('empty');

  useEffect(() => {
    getSummary({
      days,
      only_empty: view === 'empty',
      limit: SEARCH_LOG_LIST_LIMIT,
    });
  }, [getSummary, days, view]);

  const total = summary?.total_searches ?? 0;
  const empty = summary?.empty_searches ?? 0;
  const emptyShare = total > 0 ? Math.round((empty / total) * 100) : 0;
  const queries = summary?.queries ?? [];

  return (
    <PageContent>
      <Flex direction={'column'} gap={5} w={'full'} maxW={'1100px'} mx={'auto'}>
        <PageHeader
          title={'Registro de buscas'}
          subtitle={'O que as pessoas procuram na busca geral'}
          leftIcon={<MdManageSearch size={'32px'} />}
        />

        <Flex justify={'space-between'} align={'center'} gap={3} wrap={'wrap'}>
          <ButtonGroup size={'sm'} isAttached variant={'outline'}>
            <Button
              variant={view === 'empty' ? 'solid' : 'outline'}
              colorScheme={view === 'empty' ? 'blue' : 'gray'}
              aria-pressed={view === 'empty'}
              onClick={() => setView('empty')}
            >
              Sem resultado
            </Button>
            <Button
              variant={view === 'all' ? 'solid' : 'outline'}
              colorScheme={view === 'all' ? 'blue' : 'gray'}
              aria-pressed={view === 'all'}
              onClick={() => setView('all')}
            >
              Mais buscadas
            </Button>
          </ButtonGroup>
          <ButtonGroup
            size={'sm'}
            isAttached
            variant={'outline'}
            aria-label={'Período'}
          >
            {SEARCH_LOG_DAY_OPTIONS.map((d) => (
              <Button
                key={d}
                variant={days === d ? 'solid' : 'outline'}
                colorScheme={days === d ? 'blue' : 'gray'}
                aria-pressed={days === d}
                onClick={() => setDays(d)}
              >
                {d} dias
              </Button>
            ))}
          </ButtonGroup>
        </Flex>

        <Skeleton isLoaded={!loading || !!summary} borderRadius={'lg'}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <StatTile
              label={'Buscas'}
              value={total}
              detail={`nos últimos ${summary?.since_days ?? days} dias`}
            />
            <StatTile
              label={'Consultas diferentes'}
              value={summary?.distinct_queries ?? 0}
            />
            <StatTile
              label={'Buscas sem resultado'}
              value={empty}
              detail={`${emptyShare}% das buscas`}
              color={empty > 0 ? 'red.500' : undefined}
            />
          </SimpleGrid>
        </Skeleton>

        <Text fontSize={'sm'} color={'uspolis.textMuted'}>
          {view === 'empty'
            ? 'Consultas que voltaram vazias pelo menos uma vez, das mais frequentes para as menos. É aqui que aparecem sinônimos que a busca não conhece, erros de digitação e dados que ainda não são públicos.'
            : 'Consultas mais buscadas no período.'}{' '}
          O registro é anônimo: só guarda a consulta normalizada (sem acentos e
          em minúsculas), o filtro, o número de resultados e a data.
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
                  <Td>
                    {moment(q.last_searched_at).format('DD/MM/YYYY HH:mm')}
                  </Td>
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
                  <Td colSpan={6} textAlign={'center'} py={8}>
                    <Text color={'uspolis.textMuted'}>
                      {view === 'empty'
                        ? 'Nenhuma busca sem resultado no período.'
                        : 'Nenhuma busca registrada no período.'}
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
    </PageContent>
  );
}

export default SearchLogs;
