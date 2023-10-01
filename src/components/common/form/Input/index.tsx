import { Flex, FormLabel, Input as ChakraInput } from '@chakra-ui/react';
import { FieldProps } from 'models/interfaces';
import { useFormContext } from 'react-hook-form';

interface InputProps extends FieldProps {}

export function Input({ label, name }: InputProps) {
  const { register } = useFormContext();

  return (
    <Flex direction='column' w='100%'>
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <ChakraInput {...register(name)} />
    </Flex>
  );
}
