import {
  FormLabel,
  Textarea as ChakraTextarea,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FieldProps } from '../form.interface';
import { useFormContext } from 'react-hook-form';

interface InputProps extends FieldProps {}

export function Textarea({
  label,
  name,
  disabled,
  mt,
  mb,
  mr,
  ml,
}: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl isInvalid={!!errors[name]} mt={mt} mb={mb} ml={ml} mr={mr}>
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <ChakraTextarea
        {...register(name)}
        resize='vertical'
        disabled={disabled}
      />
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
