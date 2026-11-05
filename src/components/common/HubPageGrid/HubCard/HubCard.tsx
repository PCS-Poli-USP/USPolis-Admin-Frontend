import {
  Box,
  Flex,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { ArrowForwardIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { HubPageGridItem } from '..';

// ≥ md: vertical card; on hover the background tints, a bar grows along the
// bottom and an "Abrir" call to action appears.
// < md: compact row with the icon in a tile and a chevron.

const DEFAULT_ACCENT = '#408080';

// Hover tints per accent: `tint` for the card background, `line` for the
// border, `soft` for the mobile icon tile.
type Tints = { tint: string; line: string; soft: string };
const LIGHT_TINTS: Record<string, Tints> = {
  '#408080': { tint: '#F4F9F9', line: '#D3E4E4', soft: '#EAF3F3' },
  '#E53E3E': { tint: '#FEF6F6', line: '#F5C6C6', soft: '#FDECEC' },
};
const DARK_TINTS: Record<string, Tints> = {
  '#408080': {
    tint: 'rgba(64, 128, 128, 0.14)',
    line: 'rgba(64, 128, 128, 0.55)',
    soft: 'rgba(64, 128, 128, 0.24)',
  },
  '#E53E3E': {
    tint: 'rgba(229, 62, 62, 0.12)',
    line: 'rgba(229, 62, 62, 0.5)',
    soft: 'rgba(229, 62, 62, 0.22)',
  },
};
const EASE = 'cubic-bezier(.2,.8,.2,1)';

function HubCard({
  icon,
  title,
  description,
  pageCount,
  onClick,
  disabled = false,
  borderColor = DEFAULT_ACCENT,
}: HubPageGridItem) {
  // ssr: false reads the viewport on the first render, so mobile doesn't
  // flash the desktop card.
  const isMobile =
    useBreakpointValue({ base: true, md: false }, { ssr: false }) ?? false;
  const palette = useColorModeValue(LIGHT_TINTS, DARK_TINTS);
  const { tint, line, soft } = palette[borderColor] ?? palette[DEFAULT_ACCENT];

  const common = {
    role: 'group',
    as: 'button' as const,
    type: 'button' as const,
    w: '100%',
    h: '100%',
    bg: 'uspolis.white',
    rounded: 'md',
    border: '1px solid',
    borderColor: 'uspolis.border',
    cursor: 'pointer',
    onClick: () => {
      if (disabled) return;
      onClick();
    },
    disabled,
    opacity: disabled ? 0.5 : 1,
    pointerEvents: (disabled ? 'none' : 'auto') as 'none' | 'auto',
    _focusVisible: {
      outline: `2px solid ${borderColor}`,
      outlineOffset: '3px',
    },
  };

  if (isMobile) {
    return (
      <Flex
        {...common}
        align='center'
        gap='16px'
        p='16px 18px'
        minH='84px'
        textAlign='left'
        transition='background .2s ease, border-color .2s ease'
        _hover={{ bg: tint, borderColor }}
        _active={{ bg: tint, borderColor }}
      >
        <Flex
          flex='none'
          w='52px'
          h='52px'
          rounded='12px'
          align='center'
          justify='center'
          fontSize='26px'
          bg={soft}
          color={borderColor}
          transition='background .2s ease, color .2s ease'
          _groupHover={{ bg: borderColor, color: 'white' }}
          _groupActive={{ bg: borderColor, color: 'white' }}
          sx={{ '& svg': { width: '26px', height: '26px' } }}
        >
          {icon}
        </Flex>
        <Flex direction='column' flex='1' minW={0} gap='3px'>
          <Text fontWeight='bold' fontSize='md'>
            {title}
          </Text>
          <Text fontSize='sm' color='uspolis.textMuted' lineHeight='1.4'>
            {description}
          </Text>
          {pageCount && (
            <Text fontSize='xs' color='uspolis.textMuted'>
              {pageCount} páginas disponíveis
            </Text>
          )}
        </Flex>
        <ChevronRightIcon
          flex='none'
          boxSize='20px'
          color={borderColor}
          opacity={0.35}
          transition='transform .2s ease, opacity .2s ease'
          _groupHover={{ opacity: 1, transform: 'translateX(4px)' }}
          _groupActive={{ opacity: 1, transform: 'translateX(4px)' }}
        />
      </Flex>
    );
  }

  return (
    <Flex
      {...common}
      position='relative'
      overflow='hidden'
      direction='column'
      alignItems='center'
      justifyContent='flex-start'
      textAlign='center'
      p='28px 20px 22px'
      transition='background .25s ease, border-color .25s ease'
      _hover={{ bg: tint, borderColor: line }}
    >
      <Box
        color={borderColor}
        transition={`transform .25s ${EASE}`}
        _groupHover={{ transform: 'translateY(-3px)' }}
      >
        {icon}
      </Box>
      <Text fontWeight='bold' fontSize='xl' mt='18px'>
        {title}
      </Text>
      <Text w='100%' color='uspolis.textMuted' mt='6px'>
        {description}
      </Text>
      {pageCount && (
        <Text fontSize='sm' color='uspolis.textMuted'>
          {pageCount} páginas disponíveis
        </Text>
      )}
      <Flex
        align='center'
        gap='6px'
        mt='auto'
        pt='12px'
        fontWeight='semibold'
        fontSize='sm'
        color={borderColor}
        opacity={0}
        transform='translateY(4px)'
        transition='opacity .2s ease, transform .25s ease'
        _groupHover={{ opacity: 1, transform: 'none' }}
        _groupFocusVisible={{ opacity: 1, transform: 'none' }}
      >
        Abrir <ArrowForwardIcon />
      </Flex>
      <Box
        position='absolute'
        left={0}
        bottom={0}
        h='3px'
        w='0%'
        bg={borderColor}
        transition={`width .3s ${EASE}`}
        _groupHover={{ w: '100%' }}
        _groupFocusVisible={{ w: '100%' }}
      />
    </Flex>
  );
}

export default HubCard;
