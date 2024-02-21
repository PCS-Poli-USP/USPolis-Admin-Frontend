import { FormLabel, Textarea as ChakraTextarea, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { FieldProps } from 'models/interfaces';
import { useFormContext } from 'react-hook-form';

interface InputProps extends FieldProps {}

export function Textarea({ label, name, disabled }: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <ChakraTextarea {...register(name)} resize='vertical' disabled={disabled} />
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
