import { FormLabel, Input as ChakraInput, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { FieldProps } from 'models/interfaces';
import { useFormContext } from 'react-hook-form';

interface InputProps extends FieldProps {
  type?: React.HTMLInputTypeAttribute;
}

export function Input({ label, name, type = 'text', disabled = false }: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <ChakraInput {...register(name)} type={type} disabled={disabled} />
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
