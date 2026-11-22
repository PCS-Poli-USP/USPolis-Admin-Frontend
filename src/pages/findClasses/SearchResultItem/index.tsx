import { Badge, Box, Flex, Icon, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import {
  MdApartment,
  MdAssignment,
  MdEvent,
  MdForum,
  MdGroups,
  MdMeetingRoom,
  MdMenuBook,
  MdPerson,
} from 'react-icons/md';
import { SearchItemResponse } from '../../../models/http/responses/search.response.models';
import { SearchEntityType } from '../../../utils/enums/searchEntityType.enum';
import {
  describeSearchItem,
  formatSearchItemTitle,
  getSearchItemLiveStatus,
  isMonitoria,
} from '../../../utils/search/search.formatter';
import HighlightedText from '../HighlightedText';

export const searchEntityIcons: { [key in SearchEntityType]: IconType } = {
  [SearchEntityType.SUBJECT]: MdMenuBook,
  [SearchEntityType.CLASS]: MdGroups,
  [SearchEntityType.CLASSROOM]: MdMeetingRoom,
  [SearchEntityType.BUILDING]: MdApartment,
  [SearchEntityType.PROFESSOR]: MdPerson,
  [SearchEntityType.EXAM]: MdAssignment,
  [SearchEntityType.EVENT]: MdEvent,
  [SearchEntityType.MEETING]: MdForum,
};

interface SearchResultItemProps {
  item: SearchItemResponse;
  query: string;
  onSelect: (item: SearchItemResponse) => void;
  isSelected?: boolean;
  // Compact: title + first detail line only (used inside the top panel).
  compact?: boolean;
}

function SearchResultItem({
  item,
  query,
  onSelect,
  isSelected = false,
  compact = false,
}: SearchResultItemProps) {
  const details = describeSearchItem(item);
  // Compact keeps the first line; classes also keep the period (2nd line),
  // which tells apart classes with the same number in different semesters.
  const compactLines = item.type === SearchEntityType.CLASS ? 2 : 1;
  const status = getSearchItemLiveStatus(item);

  return (
    <Box
      as='button'
      type='button'
      onClick={() => onSelect(item)}
      aria-current={isSelected ? 'true' : undefined}
      w={'full'}
      textAlign={'left'}
      px={compact ? 2 : 3}
      py={compact ? 1.5 : 2.5}
      borderRadius={'md'}
      bg={isSelected ? 'uspolis.surfaceSubtle' : 'transparent'}
      _hover={{ bg: 'uspolis.hover' }}
      _focusVisible={{ outline: '2px solid', outlineColor: 'uspolis.blue' }}
    >
      <Flex gap={3} align={'flex-start'}>
        <Icon
          as={searchEntityIcons[item.type]}
          boxSize={compact ? 4 : 5}
          mt={'2px'}
          color={'uspolis.blue'}
          flexShrink={0}
          aria-hidden
        />
        <Box minW={0} flex={1}>
          <Flex gap={2} align={'center'} wrap={'wrap'}>
            <HighlightedText
              text={formatSearchItemTitle(item)}
              query={query}
              fontWeight={'semibold'}
              fontSize={compact ? 'sm' : 'md'}
              noOfLines={compact ? 1 : 2}
            />
            {isMonitoria(item) && (
              <Badge
                colorScheme={'purple'}
                borderRadius={'10px'}
                fontSize={'2xs'}
              >
                Monitoria
              </Badge>
            )}
            {status && (
              <Badge
                colorScheme={status.color}
                borderRadius={'10px'}
                fontSize={'2xs'}
              >
                {status.label}
              </Badge>
            )}
          </Flex>
          {item.subtitle &&
            // Subjects list professors and classrooms the building in the
            // detail lines already.
            item.type !== SearchEntityType.SUBJECT &&
            item.type !== SearchEntityType.CLASSROOM && (
              <HighlightedText
                text={item.subtitle}
                query={query}
                fontSize={'sm'}
                color={'uspolis.textMuted'}
                noOfLines={1}
              />
            )}
          {(compact ? details.slice(0, compactLines) : details).map(
            (line, index) => (
              <Text
                key={index}
                fontSize={'xs'}
                color={'uspolis.textMuted'}
                noOfLines={compact ? 1 : 2}
              >
                {line}
              </Text>
            ),
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export default SearchResultItem;
