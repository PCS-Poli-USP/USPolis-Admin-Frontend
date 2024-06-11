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
  min?: string | number | undefined;
  max?: string | number | undefined;
}

export function Input({
  label,
  name,
  type = 'text',
  disabled = false,
  hidden = false,
  placeholder = undefined,
  value = undefined,
  min = undefined,
  max = undefined,
}: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl isInvalid={!!errors[name]} hidden={hidden}>
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <ChakraInput
        {...register(name)}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        hidden={hidden}
        min={min}
        max={max}
      />
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
