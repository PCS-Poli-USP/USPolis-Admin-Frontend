import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  FormLabel,
  Select as ChakraSelect,
  FormControl,
  FormErrorMessage,
  Spinner,
} from '@chakra-ui/react';
import { FieldProps } from 'models/interfaces';
import { useFormContext } from 'react-hook-form';

type Option = {
  label: string;
  value: string | number;
};

interface SelectProps extends FieldProps {
  options: Option[];
  value?: string | number;
}

export function Select({
  label,
  name,
  options,
  disabled = false,
  value = undefined,
  placeholder = undefined,
  isLoading = false,
}: SelectProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel alignSelf='flex-start'>{label}</FormLabel>
      <ChakraSelect
        {...register(name)}
        disabled={disabled || isLoading}
        value={value}
        placeholder={placeholder}
        icon={isLoading ? <Spinner /> : <ChevronDownIcon />}
      >
        <option value={undefined}>Selecione uma opção</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </ChakraSelect>
      <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
}
