import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

const useCustomToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (title: string, description: string, status: 'success' | 'error') => {
      toast({
        title,
        description,
        status,
        isClosable: true,
        position: 'top-left',
        duration: 4000,
      });
    },
    [toast],
  );

  return showToast;
};

export default useCustomToast;
