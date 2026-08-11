import { Box, BoxProps } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.35 },
});

interface PulseDotProps extends BoxProps {
  size?: string;
}

function PulseDot({ size = '8px', ...boxProps }: PulseDotProps) {
  return (
    <Box
      as='span'
      display='inline-block'
      w={size}
      h={size}
      borderRadius='50%'
      bg='uspolis.blue'
      flexShrink={0}
      sx={{ animation: `${pulse} 1.6s ease-in-out infinite` }}
      {...boxProps}
    />
  );
}

export default PulseDot;
