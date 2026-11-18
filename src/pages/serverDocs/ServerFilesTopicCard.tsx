import {
  Box,
  Collapse,
  Flex,
  Text,
  useMediaQuery,
  Wrap,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ServerFilesTopic } from './topics.data';
import PathChip from './PathChip';
import { useCodeSurfaceBg } from './codeSurface';

interface ServerFilesTopicCardProps {
  topic: ServerFilesTopic;
  defaultOpen: boolean;
}

function ServerFilesTopicCard({
  topic,
  defaultOpen,
}: ServerFilesTopicCardProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)', { ssr: false });
  const [open, setOpen] = useState(defaultOpen);
  const codeBg = useCodeSurfaceBg();
  const padX = isMobile ? '12px' : '18px';

  return (
    <Box
      border={'1px solid'}
      borderColor={'uspolis.border'}
      borderRadius={'8px'}
      mb={'16px'}
      overflow={'hidden'}
    >
      <Flex
        as={'button'}
        type={'button'}
        aria-expanded={open}
        w={'full'}
        align={'center'}
        justify={'space-between'}
        gap={'12px'}
        px={padX}
        py={isMobile ? '12px' : '14px'}
        bg={'uspolis.surfaceSubtle'}
        textAlign={'left'}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Flex align={'baseline'} gap={'4px 10px'} wrap={'wrap'} minW={0}>
          <Text fontWeight={'bold'} fontSize={'15px'} color={'uspolis.black'}>
            {topic.title}
          </Text>
          <Text fontSize={'12px'} color={'uspolis.textMuted'}>
            {topic.paths.length} caminhos
          </Text>
        </Flex>
        <Text
          fontSize={'13px'}
          color={'uspolis.text'}
          fontWeight={'medium'}
          whiteSpace={'nowrap'}
          flexShrink={0}
        >
          {isMobile
            ? open
              ? 'Ocultar ▲'
              : 'Árvore ▼'
            : open
              ? 'Ocultar árvore ▲'
              : 'Mostrar árvore ▼'}
        </Text>
      </Flex>

      <Box px={padX} py={isMobile ? '12px' : '16px'}>
        <Text fontSize={'13.5px'} color={'uspolis.textMuted'} mb={'12px'}>
          {topic.note}
        </Text>

        <Wrap spacing={'8px'} mb={open ? '14px' : 0}>
          {topic.paths.map((path) => (
            <PathChip key={path} path={path} />
          ))}
        </Wrap>

        <Collapse in={open} animateOpacity>
          <Box
            as={'pre'}
            bg={codeBg}
            color={'#f4f4f4'}
            border={'1px solid'}
            borderColor={'uspolis.border'}
            px={isMobile ? '12px' : '16px'}
            py={isMobile ? '12px' : '14px'}
            borderRadius={'6px'}
            fontFamily={'ui-monospace, monospace'}
            fontSize={isMobile ? '12px' : '12.5px'}
            lineHeight={1.6}
            overflowX={'auto'}
            whiteSpace={'pre'}
          >
            {topic.tree}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}

export default ServerFilesTopicCard;
