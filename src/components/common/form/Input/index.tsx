import {
  FormLabel,
  Input as ChakraInput,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FieldProps } from 'models/interfaces';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface InputProps extends FieldProps {
  type?: React.HTMLInputTypeAttribute;
  value?: string | number | readonly string[] | undefined;
}

export function Input({
  label,
  name,
  type = 'text',
  disabled = false,
  placeholder = undefined,
  value = undefined,
}: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <ChakraInput
        {...register(name)}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
      />
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
