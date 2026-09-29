import { Box, Collapse, Flex, Text, Wrap } from '@chakra-ui/react';
import { useState } from 'react';
import { ServerFilesTopic } from './topics.data';
import PathChip from './PathChip';

interface ServerFilesTopicCardProps {
  topic: ServerFilesTopic;
  defaultOpen: boolean;
}

function ServerFilesTopicCard({
  topic,
  defaultOpen,
}: ServerFilesTopicCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Box
      border={'1px solid'}
      borderColor={'uspolis.lightGray'}
      borderRadius={'8px'}
      mb={'16px'}
      overflow={'hidden'}
    >
      <Flex
        as={'button'}
        w={'full'}
        align={'center'}
        justify={'space-between'}
        px={'18px'}
        py={'14px'}
        bg={'#FAFAFA'}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Flex align={'center'} gap={'10px'}>
          <Text fontWeight={'bold'} fontSize={'15px'} color={'#262626'}>
            {topic.title}
          </Text>
          <Text fontSize={'12px'} color={'#a5a4a8'}>
            {topic.paths.length} caminhos
          </Text>
        </Flex>
        <Text fontSize={'13px'} color={'#408080'} fontWeight={'medium'}>
          {open ? 'Ocultar árvore ▲' : 'Mostrar árvore ▼'}
        </Text>
      </Flex>

      <Box px={'18px'} py={'16px'}>
        <Text fontSize={'13.5px'} color={'uspolis.gray'} mb={'12px'}>
          {topic.note}
        </Text>

        <Wrap spacing={'8px'} mb={'14px'}>
          {topic.paths.map((path) => (
            <PathChip key={path} path={path} />
          ))}
        </Wrap>

        <Collapse in={open} animateOpacity>
          <Box
            as={'pre'}
            bg={'#262626'}
            color={'#f4f4f4'}
            px={'16px'}
            py={'14px'}
            borderRadius={'6px'}
            fontFamily={'ui-monospace, monospace'}
            fontSize={'12.5px'}
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
