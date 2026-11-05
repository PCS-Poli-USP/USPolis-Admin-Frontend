import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { LuKeyRound, LuRotateCw } from 'react-icons/lu';

export function LoadError({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry: () => void;
}) {
  return (
    <Alert status='error' borderRadius='md' alignItems='flex-start' gap={1}>
      <AlertIcon />
      <Box flex={1}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Box>
      <Button
        size='sm'
        variant='outline'
        colorScheme='red'
        leftIcon={<LuRotateCw />}
        onClick={onRetry}
      >
        Tentar novamente
      </Button>
    </Alert>
  );
}

export function EmptyState({
  title,
  description,
  action,
  big = false,
}: {
  title: string;
  description: string;
  action: ReactNode;
  big?: boolean;
}) {
  return (
    <Flex
      direction='column'
      align='center'
      textAlign='center'
      gap={3}
      border='1px solid'
      borderColor='uspolis.blue'
      borderRadius='lg'
      py={big ? 14 : 10}
      px={6}
    >
      <LuKeyRound size={big ? 64 : 48} />
      <Text fontSize={big ? '2xl' : 'xl'} fontWeight='bold' mt={2}>
        {title}
      </Text>
      <Text maxW='560px' lineHeight={1.5}>
        {description}
      </Text>
      <Box mt={2}>{action}</Box>
    </Flex>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Text as='span'>
      <Text as='span' color='uspolis.textMuted'>
        {label}:
      </Text>{' '}
      {children}
    </Text>
  );
}
