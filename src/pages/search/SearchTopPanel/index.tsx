import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { MdArrowBack, MdOpenInNew } from 'react-icons/md';
import {
  SearchGroupResponse,
  SearchItemResponse,
  SearchTopResponse,
} from '../../../models/http/responses/search.response.models';
import { SearchEntityType } from '../../../utils/enums/searchEntityType.enum';
import {
  describeSearchItem,
  formatSearchItemTitle,
  isMonitoria,
  isReservationItem,
} from '../../../utils/search/search.formatter';
import HighlightedText from '../HighlightedText';
import SearchResultItem, { searchEntityIcons } from '../SearchResultItem';

interface SearchTopPanelProps {
  // vertical: side column (many results); horizontal: full width below a
  // short result list, details on the left and related groups in columns.
  layout?: 'vertical' | 'horizontal';
  doc: SearchTopResponse | null;
  query: string;
  loading: boolean;
  error: boolean;
  // True when the user clicked a result (instead of the best match).
  isFocused: boolean;
  onSelect: (item: SearchItemResponse) => void;
  onBack: () => void;
}

function SearchTopPanel({
  layout = 'vertical',
  doc,
  query,
  loading,
  error,
  isFocused,
  onSelect,
  onBack,
}: SearchTopPanelProps) {
  if (loading) {
    return (
      <Stack
        p={5}
        border={'1px solid'}
        borderColor={'uspolis.border'}
        borderRadius={'lg'}
      >
        <Skeleton h={'24px'} w={'60%'} />
        <Skeleton h={'16px'} w={'40%'} />
        <Skeleton h={'80px'} />
      </Stack>
    );
  }
  if (error) {
    return (
      <Alert status='error' borderRadius={'lg'}>
        <AlertIcon />
        Não foi possível carregar este resultado.
      </Alert>
    );
  }
  if (!doc) return null;
  const title = formatSearchItemTitle(doc);

  const header = (
    <>
      {isFocused && (
        <Button
          size={'xs'}
          variant={'ghost'}
          leftIcon={<MdArrowBack />}
          mb={2}
          onClick={onBack}
        >
          Voltar ao melhor resultado
        </Button>
      )}
      <Flex gap={3} align={'center'}>
        <Icon
          as={searchEntityIcons[doc.type]}
          boxSize={8}
          color={'uspolis.blue'}
          aria-hidden
        />
        <Box minW={0}>
          <Badge borderRadius={'10px'}>
            {SearchEntityType.translate(doc.type)}
          </Badge>
          {isMonitoria(doc) && (
            <Badge colorScheme={'purple'} borderRadius={'10px'} ml={2}>
              Monitoria
            </Badge>
          )}
          <Heading as='h2' size={'md'} mt={1}>
            <HighlightedText as='span' text={title} query={query} />
          </Heading>
          {doc.subtitle &&
            doc.type !== SearchEntityType.SUBJECT &&
            doc.type !== SearchEntityType.CLASSROOM && (
              <Text color={'uspolis.textMuted'}>{doc.subtitle}</Text>
            )}
        </Box>
      </Flex>

      <Stack spacing={1} mt={3}>
        {describeSearchItem(doc).map((line, index) => (
          <Text key={index} fontSize={'sm'}>
            {line}
          </Text>
        ))}
        {isReservationItem(doc) && doc.payload.link && (
          <Link
            href={doc.payload.link}
            isExternal
            fontSize={'sm'}
            color={'uspolis.blue'}
            fontWeight={'semibold'}
          >
            Mais informações <Icon as={MdOpenInNew} mx={'2px'} />
          </Link>
        )}
      </Stack>
    </>
  );

  const renderGroup = (group: SearchGroupResponse) => (
    <>
      <Text fontWeight={'bold'} fontSize={'sm'} mb={1}>
        {SearchEntityType.translatePlural(group.type)}
        {group.total > group.items.length &&
          ` (${group.items.length} de ${group.total})`}
      </Text>
      <Stack spacing={0}>
        {group.items.map((item) => (
          <SearchResultItem
            key={item.doc_key}
            item={item}
            query={query}
            onSelect={onSelect}
            compact
          />
        ))}
      </Stack>
    </>
  );

  return (
    <Box
      as='section'
      aria-label={`Destaque: ${title}`}
      p={5}
      border={'1px solid'}
      borderColor={'uspolis.border'}
      borderRadius={'lg'}
      boxShadow={'sm'}
      bg={'uspolis.white'}
    >
      {layout === 'horizontal' ? (
        <Flex gap={8} align={'flex-start'}>
          <Box w={'320px'} flexShrink={0}>
            {header}
          </Box>
          {doc.related.length > 0 && (
            <SimpleGrid
              flex={1}
              minW={0}
              minChildWidth={'220px'}
              spacing={6}
              borderLeft={'1px solid'}
              borderColor={'uspolis.border'}
              pl={6}
            >
              {doc.related.map((group) => (
                <Box key={group.type}>{renderGroup(group)}</Box>
              ))}
            </SimpleGrid>
          )}
        </Flex>
      ) : (
        <>
          {header}
          {doc.related.map((group) => (
            <Box key={group.type} mt={4}>
              <Divider mb={3} />
              {renderGroup(group)}
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}

export default SearchTopPanel;
