import { Text, TextProps } from '@chakra-ui/react';
import { highlightMatches } from '../../../utils/search/search.formatter';

interface HighlightedTextProps extends TextProps {
  text: string;
  query: string;
}

// Bolds the parts of `text` that match the query, like a search engine does.
function HighlightedText({ text, query, ...props }: HighlightedTextProps) {
  return (
    <Text {...props}>
      {highlightMatches(text, query).map((part, index) =>
        part.match ? (
          <Text as='strong' key={index} fontWeight={'extrabold'}>
            {part.text}
          </Text>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </Text>
  );
}

export default HighlightedText;
