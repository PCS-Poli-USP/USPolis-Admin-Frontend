import { CloseIcon } from '@chakra-ui/icons';
import {
  useToast,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { useCallback } from 'react';

const useCustomToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (title: string, description: string, status: 'success' | 'error') => {
      toast({
        status,
        position: 'top-left',
        duration: 5000,
        isClosable: true,

        render: ({ onClose }) => (
          <Alert
            status={status}
            variant='solid'
            borderRadius='md'
            cursor='pointer'
            onClick={onClose}
            boxShadow='lg'
            p={4}
          >
            <AlertIcon />
            <Box w={'full'}>
              <Flex direction={'row'} justify={'space-between'} w={'full'}>
                <AlertTitle>{title}</AlertTitle>
                <IconButton
                  aria-label='close-toast'
                  icon={<CloseIcon />}
                  size={'sm'}
                  variant={'ghost'}
                  color={'uspolis.white'}
                />
              </Flex>
              <AlertDescription>{description}</AlertDescription>
            </Box>
          </Alert>
        ),
      });
    },
    [toast],
  );

  return showToast;
};

export default useCustomToast;
