import {
  FormLabel,
  Textarea as ChakraTextarea,
  FormControl,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';
import { FieldProps } from '../form.interface';
import { useFormContext } from 'react-hook-form';

interface InputProps extends FieldProps {
  maxSize?: number;
  height?: string | number;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export function TextareaInput({
  label,
  name,
  disabled,
  mt,
  mb,
  mr,
  ml,
  maxSize,
  height = undefined,
  placeholder = '',
  onFocus = undefined,
  onBlur = undefined,
}: InputProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const MAX_TEXT_LENGHT = !maxSize ? 256 : maxSize;
  const current: string = watch(name);
  const currentLenght = current ? current.length : 0;

  return (
    <FormControl isInvalid={!!errors[name]} mt={mt} mb={mb} ml={ml} mr={mr}>
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <ChakraTextarea
        {...register(name)}
        resize='vertical'
        disabled={disabled}
        maxLength={MAX_TEXT_LENGHT}
        height={height}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <Text>{`Caracteres restantes: ${MAX_TEXT_LENGHT - currentLenght}`}</Text>
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
