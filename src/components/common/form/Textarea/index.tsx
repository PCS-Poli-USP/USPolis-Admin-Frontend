import {
  FormLabel,
  Textarea as ChakraTextarea,
  FormControl,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';
import { FieldProps } from '../form.interface';
import { useFormContext } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
    watch,
  } = useFormContext();

  const MAX_TEXT_LENGHT = 256;
  const current: string = watch(name);
  const currentLenght = current ? current.length : 0;

  return (
    <FormControl isInvalid={!!errors[name]} mt={mt} mb={mb} ml={ml} mr={mr}>
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <ChakraTextarea
        {...register(name)}
        resize='vertical'
        disabled={disabled}
        maxLength={256}
      />
      <Text>{`Caracteres restantes: ${MAX_TEXT_LENGHT - currentLenght}`}</Text>
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
