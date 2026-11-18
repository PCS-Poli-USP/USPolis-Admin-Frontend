import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  Text,
  Tooltip,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react';
import { useCopyToClipboard } from './useCopyToClipboard';

interface PathChipProps {
  path: string;
}

// The whole chip is the copy button: the 24px icon button it used to have was
// too small to tap on a phone.
function PathChip({ path }: PathChipProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)', { ssr: false });
  const { copied, copy } = useCopyToClipboard();
  const copiedBg = useColorModeValue('#E3F5F0', 'rgba(47, 158, 110, 0.2)');

  return (
    <Tooltip
      label={copied ? 'Copiado!' : 'Copiar caminho'}
      isDisabled={isMobile}
    >
      <HStack
        as={'button'}
        type={'button'}
        onClick={() => copy(path)}
        aria-label={`Copiar caminho ${path}`}
        spacing={'8px'}
        maxW={'100%'}
        minH={isMobile ? '40px' : '32px'}
        textAlign={'left'}
        bg={copied ? copiedBg : 'uspolis.surfaceSubtle'}
        border={'1px solid'}
        borderColor={'uspolis.border'}
        borderRadius={'4px'}
        pl={'10px'}
        pr={'10px'}
        py={'4px'}
        _hover={{ borderColor: 'uspolis.text' }}
        _focusVisible={{ outline: '2px solid', outlineColor: 'uspolis.blue' }}
      >
        <Text
          fontFamily={'ui-monospace, monospace'}
          fontSize={'12.5px'}
          color={'uspolis.black'}
          minW={0}
          wordBreak={'break-all'}
        >
          {path}
        </Text>
        <Box
          as={copied ? CheckIcon : CopyIcon}
          aria-hidden
          flexShrink={0}
          boxSize={'14px'}
          color={copied ? '#2F9E6E' : 'uspolis.textMuted'}
        />
      </HStack>
    </Tooltip>
  );
}

export default PathChip;
