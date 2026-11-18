import { useColorModeValue } from '@chakra-ui/react';

// Background for code and directory trees, kept distinct from the page in both
// themes (the dark page background is also #262626).
export function useCodeSurfaceBg() {
  return useColorModeValue('#262626', '#171717');
}
