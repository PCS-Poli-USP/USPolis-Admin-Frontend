import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import PageContent from '../../components/common/PageContent';
import { appContext } from '../../context/AppContext';
import {
  SEARCH_MIN_QUERY_LENGTH,
  useGeneralSearch,
  useSearchDocument,
} from '../../hooks/search/useGeneralSearch';
import { useSearchLog } from '../../hooks/search/useSearchLog';
import { SearchItemResponse } from '../../models/http/responses/search.response.models';
import { SearchEntityType } from '../../utils/enums/searchEntityType.enum';
import SearchResultItem from './SearchResultItem';
import SearchTopPanel from './SearchTopPanel';
import SearchTypeFilter from './SearchTypeFilter';

// URL state: ?q=<query>&type=<SearchEntityType>&focus=<doc_key>, so a search
// can be shared and the browser back button returns to the previous result.
type SearchUrlParam = 'q' | 'type' | 'focus';

// Height of the app's fixed top bar (PageContent has the same margin-top).
const APP_BAR_HEIGHT = 60;

function GeneralSearch() {
  const { isMobile } = useContext(appContext);

  // The search bar + filters stick below the app bar like a header; the
  // side highlight panel sticks below it, so it needs the header's height.
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    const header = headerRef.current;
    if (!header || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() =>
      setHeaderHeight(header.offsetHeight),
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  const panelTop = APP_BAR_HEIGHT + headerHeight + 16;
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const focus = searchParams.get('focus');
  const typeParam = searchParams.get('type');
  const type =
    typeParam && SearchEntityType.isValid(typeParam) ? typeParam : null;

  const [input, setInput] = useState(urlQuery);
  useEffect(() => {
    setInput(urlQuery);
  }, [urlQuery]);

  const hasQuery = urlQuery.trim().length >= SEARCH_MIN_QUERY_LENGTH;
  const centered = !hasQuery && !isMobile;
  const search = useGeneralSearch({
    query: urlQuery,
    type,
    limit: type ? 20 : 5,
  });
  const focused = useSearchDocument(hasQuery ? focus : null);
  const { logNow } = useSearchLog({ query: urlQuery, type });

  function updateParams(
    changes: Partial<Record<SearchUrlParam, string | null>>,
    replace = true,
  ) {
    // react-router-dom 6.3: setSearchParams takes no updater function.
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace });
  }

  function handleQueryChange(value: string) {
    setInput(value);
    updateParams({ q: value || null, focus: null });
  }

  function handleSelect(item: SearchItemResponse) {
    // Opening a result means this is the query the user wanted.
    logNow();
    // push (not replace): back returns to the previous highlighted result
    updateParams({ focus: item.doc_key }, false);
    if (isMobile) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const groups = search.data?.groups ?? [];
  const totalResults = groups.reduce((sum, group) => sum + group.total, 0);
  const topDoc = focus ? focused.data : (search.data?.top ?? null);
  // Few results (e.g. a professor search): the list is short, so on desktop
  // the highlight goes full width below it, with related groups side by side.
  const listedResults = groups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );
  const stacked = !isMobile && listedResults <= 3;

  return (
    <PageContent>
      <Flex
        direction={'column'}
        align={'center'}
        w={'full'}
        maxW={'1200px'}
        mx={'auto'}
        gap={4}
        // Before a search, on desktop the field sits in the middle of the page
        // (a bit above the true center, which reads better). On mobile it
        // stays at the top, clear of the on-screen keyboard.
        minH={centered ? '100%' : undefined}
        justify={centered ? 'center' : 'flex-start'}
        pt={centered ? 0 : hasQuery ? 2 : 6}
        pb={centered ? '12vh' : 10}
      >
        {!hasQuery && (
          <Box textAlign={'center'}>
            <Heading as='h1' size={isMobile ? '2xl' : '3xl'}>
              Busque no USPolis
            </Heading>
            <Text
              color={'uspolis.textMuted'}
              fontSize={isMobile ? 'lg' : 'xl'}
              mt={3}
            >
              Disciplinas, turmas, salas, prédios, professores, provas e
              monitorias em um só lugar
            </Text>
          </Box>
        )}

        <Flex
          ref={headerRef}
          direction={'column'}
          align={'center'}
          gap={3}
          w={'full'}
          position={'sticky'}
          top={`${APP_BAR_HEIGHT}px`}
          zIndex={10}
          bg={'uspolis.white'}
          pt={2}
          pb={3}
          borderBottom={hasQuery ? '1px solid' : 'none'}
          borderColor={'uspolis.border'}
        >
          <Box
            as='form'
            role='search'
            w={'full'}
            // Wider than the subtitle line above it
            maxW={'880px'}
            onSubmit={(e: React.FormEvent) => e.preventDefault()}
          >
            <InputGroup size={'lg'}>
              <InputLeftElement pointerEvents={'none'} h={'56px'} w={'56px'}>
                <Icon as={MdSearch} boxSize={7} color={'uspolis.textMuted'} />
              </InputLeftElement>
              <Input
                autoFocus
                value={input}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder={'Pesquise o que você precisa'}
                aria-label={'Pesquisar no USPolis'}
                borderRadius={'full'}
                h={'56px'}
                pl={'56px'}
                fontSize={isMobile ? 'lg' : 'xl'}
                autoComplete={'off'}
                enterKeyHint={'search'}
              />
              {input && (
                <InputRightElement h={'56px'} w={'56px'}>
                  <IconButton
                    aria-label={'Limpar busca'}
                    icon={<MdClose />}
                    size={'sm'}
                    variant={'ghost'}
                    borderRadius={'full'}
                    onClick={() => handleQueryChange('')}
                  />
                </InputRightElement>
              )}
            </InputGroup>
            {!hasQuery && (
              <Text
                fontSize={isMobile ? 'sm' : 'md'}
                color={'uspolis.textMuted'}
                textAlign={'center'}
                mt={2}
              >
                Ex.: “cálculo”, “MAC0110”, “B2-04”, “prova de cálculo”,
                “monitoria” ou o nome de um(a) professor(a)
              </Text>
            )}
          </Box>

          {hasQuery && (
            <SearchTypeFilter
              value={type}
              onChange={(value) => updateParams({ type: value, focus: null })}
            />
          )}
        </Flex>

        {hasQuery && (
          <Flex
            w={'full'}
            minH={'24px'}
            align={'center'}
            gap={2}
            aria-live={'polite'}
            color={'uspolis.textMuted'}
            fontSize={'sm'}
          >
            {search.loading && <Spinner size={'sm'} />}
            {search.loading
              ? 'Buscando...'
              : search.data &&
                `${totalResults} ${totalResults === 1 ? 'resultado' : 'resultados'}`}
          </Flex>
        )}

        {hasQuery && search.error && (
          <Alert status='error' borderRadius={'lg'}>
            <AlertIcon />
            Não foi possível buscar agora. Tente novamente em instantes.
          </Alert>
        )}

        {hasQuery && !search.loading && search.data && groups.length === 0 && (
          <Alert
            status='info'
            borderRadius={'lg'}
            flexDirection={'column'}
            alignItems={'flex-start'}
          >
            <Flex align={'center'}>
              <AlertIcon />
              <AlertTitle>Nenhum resultado para “{urlQuery.trim()}”</AlertTitle>
            </Flex>
            <AlertDescription fontSize={'sm'}>
              Tente o código da disciplina (ex.: MAC0110), o nome da sala ou
              parte do nome do(a) professor(a).
              {type && ' Ou remova o filtro de tipo.'}
            </AlertDescription>
          </Alert>
        )}

        {hasQuery && groups.length > 0 && (
          <Flex
            direction={isMobile || stacked ? 'column' : 'row'}
            gap={6}
            w={'full'}
            align={'flex-start'}
          >
            <Box
              flex={stacked ? undefined : 2}
              w={'full'}
              minW={0}
              order={isMobile ? 0 : 1}
              position={isMobile || stacked ? 'static' : 'sticky'}
              top={`${panelTop}px`}
              // A panel taller than the viewport would hide its bottom while
              // stuck; scroll it on its own instead.
              maxH={
                isMobile || stacked
                  ? undefined
                  : `calc(100vh - ${panelTop + 16}px)`
              }
              overflowY={isMobile || stacked ? undefined : 'auto'}
            >
              <SearchTopPanel
                layout={stacked ? 'horizontal' : 'vertical'}
                doc={topDoc}
                query={urlQuery}
                loading={!!focus && focused.loading}
                error={!!focus && focused.error}
                isFocused={!!focus}
                onSelect={handleSelect}
                onBack={() => updateParams({ focus: null }, false)}
              />
            </Box>

            <Stack
              flex={stacked ? undefined : 3}
              w={'full'}
              minW={0}
              spacing={6}
              order={0}
            >
              {groups.map((group) => (
                <Box as='section' key={group.type}>
                  <Flex justify={'space-between'} align={'baseline'} px={3}>
                    <Heading as='h3' size={'sm'}>
                      {SearchEntityType.translatePlural(group.type)}{' '}
                      <Text
                        as='span'
                        fontWeight={'normal'}
                        color={'uspolis.textMuted'}
                      >
                        ({group.total})
                      </Text>
                    </Heading>
                    {!type && group.total > group.items.length && (
                      <Button
                        size={'xs'}
                        variant={'link'}
                        onClick={() =>
                          updateParams({ type: group.type, focus: null })
                        }
                      >
                        Ver {group.total}
                      </Button>
                    )}
                  </Flex>
                  <Stack spacing={0} mt={1}>
                    {group.items.map((item) => (
                      <SearchResultItem
                        key={item.doc_key}
                        item={item}
                        query={urlQuery}
                        onSelect={handleSelect}
                        isSelected={item.doc_key === topDoc?.doc_key}
                      />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Flex>
        )}
      </Flex>
    </PageContent>
  );
}

export default GeneralSearch;
